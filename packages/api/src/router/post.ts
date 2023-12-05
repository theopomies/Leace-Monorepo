import { User } from "@leace/db";
import { EnergyClass, PostType, RelationType, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { getPostsWithAttribute } from "../utils/algorithm";
import { filterStrings } from "../utils/filter";
import { getId } from "../utils/getId";

interface UserLike extends User {
  relationshipCreated: Date;
}

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
        constructionDate: z.date().optional().nullable(),
        estimatedCosts: z.number().optional(),
        nearedShops: z.number().optional(),
        managedBy: z.string().optional(),
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

      if (input.managedBy) {
        const managedBy = await ctx.prisma.user.findUnique({
          where: { id: input.managedBy },
        });

        if (!managedBy) throw new TRPCError({ code: "NOT_FOUND" });

        if (managedBy.role != Role.AGENCY)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User provided is can't manage a post",
          });

        if (userId == managedBy.id)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Same manager and creator",
          });
      }

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
          managedById: input.managedBy,
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
        constructionDate: z.date().optional().nullable(),
        estimatedCosts: z.number().optional(),
        nearedShops: z.number().optional(),
        type: z
          .enum([PostType.RENTED, PostType.TO_BE_RENTED, PostType.HIDE])
          .optional(),
        managedBy: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (
        post.createdById != userId &&
        userId != post.managedById &&
        ctx.role != Role.ADMIN &&
        ctx.role != Role.MODERATOR
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This is not a post from or managed by this user",
        });
      }

      if (input.managedBy) {
        const managedBy = await ctx.prisma.user.findUnique({
          where: { id: input.managedBy },
        });

        if (!managedBy) throw new TRPCError({ code: "NOT_FOUND" });

        if (managedBy.role != Role.AGENCY)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User provided is can't manage a post",
          });

        if (userId == managedBy.id)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Same manager and creator",
          });
      }

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
          ges: input.ges,
          energyClass: input.energyClass,
          managedById: input.managedBy,
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
      const userId = ctx.auth.userId;

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (
        post.createdById != userId &&
        userId != post.managedById &&
        ctx.role != Role.ADMIN &&
        ctx.role != Role.MODERATOR
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This is not a post from or managed by this user",
        });
      }

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
        const newPosts = await getPostsWithAttribute(
          user.id,
          user.isPremium ?? false,
        );
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
        return updatedUser.postsToBeSeen;
      }
      // If more than 3 posts, return the list
      return user.postsToBeSeen;
    }),
  getUsersToBeSeen: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUniqueOrThrow({
        where: { id: input.postId },
        // relationships without already matched users or disliked users
        include: {
          relationships: {
            where: {
              relationType: RelationType.TENANT,
            },
            include: {
              user: true,
            },
          },
        },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (post.createdById != ctx.auth.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const usersLikes: UserLike[] = post.relationships.map((relationship) => {
        return {
          ...relationship.user,
          relationshipCreated: relationship.createdAt,
        };
      });

      usersLikes.sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        if (a.relationshipCreated < b.relationshipCreated) return -1;
        if (a.relationshipCreated > b.relationshipCreated) return 1;
        return 0;
      });

      return usersLikes;
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
});
