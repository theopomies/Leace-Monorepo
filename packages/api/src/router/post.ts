import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { ConversationType, PostType, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  getPostsWithAttribute,
  getUsersWithAttribute,
  shuffle,
} from "../utils/algorithm";
import { getId } from "../utils/getId";

export const postRouter = router({
  createPost: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        desc: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.AGENCY && user.role != Role.OWNER)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User provided is cannot create post",
        });

      const post = await ctx.prisma.post.create({
        data: {
          createdById: userId,
          title: input.title,
          content: input.content,
          desc: input.desc,
          type: PostType.TO_BE_RENTED,
        },
      });

      if (!post) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return post;
    }),
  updatePostById: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        postId: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        desc: z.string().optional(),
        type: z.enum([PostType.RENTED, PostType.TO_BE_RENTED]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (
        post.createdById != ctx.auth.userId &&
        ctx.role != Role.ADMIN &&
        ctx.role != Role.MODERATOR
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This is not a post from this user",
        });

      const updated = await ctx.prisma.post.update({
        where: { id: input.postId },
        data: {
          title: input.title,
          content: input.content,
          desc: input.desc,
          type: input.type,
        },
      });

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
  deletePostById: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      if (
        post.createdById != ctx.auth.userId &&
        ctx.role != Role.ADMIN &&
        ctx.role != Role.MODERATOR
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This is not a post from this user",
        });

      const deleted = await ctx.prisma.post.delete({
        where: { id: input.postId },
      });

      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
  getPostById: protectedProcedure([Role.TENANT, Role.AGENCY, Role.OWNER])
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
        include: { attribute: true },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return post;
    }),
  getPostsByUserId: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        userId: z.string(),
        postType: z.enum([PostType.RENTED, PostType.TO_BE_RENTED]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.AGENCY && user.role != Role.OWNER) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User provided is cannot create post",
        });
      }

      if (!input.postType) {
        const posts = await ctx.prisma.post.findMany({
          where: { createdById: userId },
          include: { attribute: true },
        });

        if (!posts) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return posts;
      }

      const posts = await ctx.prisma.post.findMany({
        where: { createdById: userId, type: input.postType },
        include: { attribute: true },
      });

      if (!posts) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return posts;
    }),
  getRentIncomeByUserId: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.AGENCY && user.role != Role.OWNER)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User provided does not fit in this scope",
        });

      const posts = await ctx.prisma.post.findMany({
        where: { createdById: userId, type: PostType.RENTED },
        include: { attribute: true },
      });

      if (!posts) throw new TRPCError({ code: "NOT_FOUND" });

      let total = 0;
      posts.map((post) => {
        if (post.attribute && post.attribute.price)
          total += post.attribute.price;
      });

      return total;
    }),
  getPostsToBeSeen: protectedProcedure([Role.TENANT]).query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.auth.userId },
      include: { postsToBeSeen: true },
    });
    // If less or equal than 3 posts, add more
    if (user.postsToBeSeen.length <= 3) {
      const newPosts = await getPostsWithAttribute(user.id);
      if (newPosts.length === 0) return user.postsToBeSeen;
      const updatedUser = await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          postsToBeSeen: {
            connect: newPosts.map((post) => ({ id: post.id })),
          },
        },
        include: { postsToBeSeen: true },
      });
      shuffle(updatedUser.postsToBeSeen);
      return updatedUser.postsToBeSeen;
    }
    // If more than 3 posts, return the list
    shuffle(user.postsToBeSeen);
    return user.postsToBeSeen;
  }),
  getUsersToBeSeen: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(z.object({ userId: z.string(), postId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.userId !== ctx.auth.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const post = await ctx.prisma.post.findUniqueOrThrow({
        where: { id: input.postId },
        include: { usersToBeSeen: true },
      });

      if (post.createdById !== input.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // If less or equal than 3 posts, add more
      if (post.usersToBeSeen.length <= 3) {
        const newUsers = await getUsersWithAttribute(post.id);
        if (newUsers.length === 0) return post.usersToBeSeen;
        const updatedPost = await ctx.prisma.post.update({
          where: { id: post.id },
          data: {
            usersToBeSeen: {
              connect: newUsers.map((user) => ({ id: user.id })),
            },
          },
          include: { usersToBeSeen: true },
        });
        shuffle(updatedPost.usersToBeSeen);
        return updatedPost.usersToBeSeen;
      }
      // If more than 3 posts, return the list
      shuffle(post.usersToBeSeen);
      return post.usersToBeSeen;
    }),
  getRentExpenseByUserId: protectedProcedure([Role.TENANT])
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User provided does not fit in this scope",
        });

      const rs = await ctx.prisma.relationship.findMany({
        where: {
          userId: userId,
          isMatch: true,
          post: { type: PostType.RENTED },
          conversation: { type: ConversationType.DONE },
        },
        include: { post: { include: { attribute: true } } },
      });

      let total = 0;

      rs.map((rs) => {
        if (rs.post && rs.post.attribute && rs.post.attribute.price)
          total += rs.post.attribute.price;
      });

      return total;
    }),
});
