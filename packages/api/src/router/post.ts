import { RelationType, PostType, Role, EnergyClass } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getPostsWithAttribute,
  getUsersWithAttribute,
  shuffle,
} from "../utils/algorithm";
import { filterStrings } from "../utils/filter";
import { getId } from "../utils/getId";

export const postRouter = router({
  createPost: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        desc: z.string(),
        energyClass: z
          .enum([EnergyClass.A, EnergyClass.B, EnergyClass.C, EnergyClass.D])
          .optional(),
        ges: z
          .enum([EnergyClass.A, EnergyClass.B, EnergyClass.C, EnergyClass.D])
          .optional(),
        constructionDate: z.date().optional(),
        estimatedCosts: z.number().optional(),
        nearedShops: z.number().optional(),
        securityAlarm: z.boolean().optional(),
        internetFiber: z.boolean().optional(),
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
          constructionDate: input.constructionDate,
          estimatedCosts: input.estimatedCosts,
          nearestShops: input.nearedShops,
          securityAlarm: input.securityAlarm,
          internetFiber: input.internetFiber,
        },
      });

      if (!post) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      filterStrings({
        ctx,
        postId: post.id,
        check: [input.title, input.content, input.desc],
      });

      return post;
    }),
  updatePostById: protectedProcedure([Role.AGENCY, Role.OWNER, Role.ADMIN])
    .input(
      z.object({
        postId: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        desc: z.string().optional(),
        energyClass: z
          .enum([EnergyClass.A, EnergyClass.B, EnergyClass.C, EnergyClass.D])
          .optional(),
        ges: z
          .enum([EnergyClass.A, EnergyClass.B, EnergyClass.C, EnergyClass.D])
          .optional(),
        constructionDate: z.date().optional(),
        estimatedCosts: z.number().optional(),
        nearedShops: z.number().optional(),
        securityAlarm: z.boolean().optional(),
        internetFiber: z.boolean().optional(),
        type: z
          .enum([PostType.RENTED, PostType.TO_BE_RENTED, PostType.HIDE])
          .optional(),
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
          constructionDate: input.constructionDate,
          estimatedCosts: input.estimatedCosts,
          nearestShops: input.nearedShops,
          securityAlarm: input.securityAlarm,
          internetFiber: input.internetFiber,
          ges: input.ges,
          energyClass: input.energyClass,
        },
      });

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      filterStrings({
        ctx,
        postId: input.postId,
        check: [input.title, input.content, input.desc],
      });
    }),
  deletePostById: protectedProcedure([Role.AGENCY, Role.OWNER, Role.ADMIN])
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
  getPostById: protectedProcedure([
    Role.TENANT,
    Role.AGENCY,
    Role.OWNER,
    Role.ADMIN,
    Role.MODERATOR,
  ])
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
          message: "User provided can't create post",
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
  RentDataAgencyByUserId: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const currentDate = new Date();

      const leases = await ctx.prisma.lease.findMany({
        where: {
          createdById: ctx.auth.userId,
          isSigned: true,
          endDate: { lte: currentDate },
        },
      });

      if (!leases) throw new TRPCError({ code: "NOT_FOUND" });

      let income = 0;
      let expense = 0;
      leases.map((lease) => {
        income += lease.rentCost;
        expense += lease.utilitiesCost;
      });

      return { income, expense };
    }),
  getPostsToBeSeen: protectedProcedure([Role.TENANT])
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.userId !== ctx.auth.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: input.userId },
        include: {
          postsToBeSeen: { include: { images: true, attribute: true } },
        },
      });

      // Remove hidden and inactive posts
      user.postsToBeSeen = user.postsToBeSeen.filter(
        (post) => post.type === PostType.TO_BE_RENTED,
      );

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
          include: {
            postsToBeSeen: { include: { images: true, attribute: true } },
          },
        });
        shuffle(updatedUser.postsToBeSeen);
        return updatedUser.postsToBeSeen;
      }
      // If more than 3 posts, return the list
      shuffle(user.postsToBeSeen);
      return user.postsToBeSeen;
    }),
  getUsersToBeSeen: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUniqueOrThrow({
        where: { id: input.postId },
        include: { usersToBeSeen: true },
      });

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

      const currentDate = new Date();

      const relationship = await ctx.prisma.relationship.findFirst({
        where: {
          userId: userId,
          relationType: RelationType.MATCH,
          post: { type: PostType.RENTED },
          lease: { isSigned: true, endDate: { lte: currentDate } },
        },
        include: { lease: true },
      });

      if (!relationship || !relationship.lease)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return {
        rentCost: relationship.lease.rentCost,
        utilitiesCost: relationship.lease.utilitiesCost,
      };
    }),
  addReview: protectedProcedure([Role.TENANT])
    .input(
      z.object({ postId: z.string(), comment: z.string(), stars: z.number() }),
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (input.stars < 0 || input.stars > 5)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "stars must be between 0-5",
        });

      const created = await ctx.prisma.review.create({
        data: {
          createdById: ctx.auth.userId,
          postId: input.postId,
          comment: input.comment,
          stars: input.stars,
        },
      });
      if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
  likeAgency: protectedProcedure([Role.TENANT])
    .input(z.object({ agencyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.agencyId },
      });

      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      if (user.role != Role.AGENCY)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const updated = await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: { like: user.like + 1 },
      });

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
});
