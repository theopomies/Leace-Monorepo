import { RelationType, PostType, UserStatus } from "@prisma/client";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { getId } from "../utils/getId";

export const relationshipRouter = router({
  likeTenantForPost: protectedProcedure([Role.OWNER, Role.AGENCY])
    .input(
      z.object({
        userId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT)
        throw new TRPCError({ code: "BAD_REQUEST" });

      if (user.status == UserStatus.INACTIVE)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This user is INACTIVE",
        });

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (post.type == PostType.RENTED)
        throw new TRPCError({ code: "FORBIDDEN" });

      if (
        ctx.role != Role.MODERATOR &&
        ctx.role != Role.ADMIN &&
        ctx.auth.userId != post.createdById
      )
        throw new TRPCError({ code: "FORBIDDEN" });

      const relationship = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: user.id },
      });

      if (!relationship) {
        const created = await ctx.prisma.relationship.create({
          data: {
            userId: user.id,
            postId: post.id,
            relationType: RelationType.POST,
          },
        });
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return created.relationType;
      }

      const updated = await ctx.prisma.relationship.update({
        where: { id: relationship.id },
        data: { relationType: RelationType.MATCH },
      });

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const chat = await ctx.prisma.conversation.create({
        data: { relationId: updated.id },
      });
      if (!chat) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return updated.relationType;
    }),
  dislikeTenantForPost: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        userId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (post.type == PostType.RENTED)
        throw new TRPCError({ code: "FORBIDDEN" });

      if (
        ctx.role != Role.MODERATOR &&
        ctx.role != Role.ADMIN &&
        ctx.auth.userId != post.createdById
      )
        throw new TRPCError({ code: "FORBIDDEN" });

      const relationship = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: user.id },
      });

      if (!relationship) return { missed: false, message: "Nothing to do" };

      const deleted = await ctx.prisma.relationship.delete({
        where: { id: relationship.id },
      });

      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return { missed: true, message: "You missed a match!" };
    }),
  likePostForTenant: protectedProcedure([Role.TENANT])
    .input(
      z.object({
        userId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT) throw new TRPCError({ code: "FORBIDDEN" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (post.type == PostType.RENTED)
        throw new TRPCError({ code: "FORBIDDEN" });

      const relationship = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: user.id },
      });

      if (!relationship) {
        const created = await ctx.prisma.relationship.create({
          data: {
            userId: user.id,
            postId: post.id,
            relationType: RelationType.TENANT,
          },
        });

        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return created.relationType;
      }

      const updated = await ctx.prisma.relationship.update({
        where: { id: relationship.id },
        data: { relationType: RelationType.MATCH },
      });

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const chat = await ctx.prisma.conversation.create({
        data: { relationId: updated.id },
      });

      if (!chat) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return updated.relationType;
    }),
  dislikePostForTenant: protectedProcedure([Role.TENANT])
    .input(
      z.object({
        userId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT) throw new TRPCError({ code: "FORBIDDEN" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (post.type == PostType.RENTED)
        throw new TRPCError({ code: "FORBIDDEN" });

      const relationship = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: user.id },
      });

      if (!relationship) return { missed: false, message: "Nothing to do" };

      const deleted = await ctx.prisma.relationship.delete({
        where: { id: relationship.id },
      });

      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return { missed: true, message: "You missed a match!" };
    }),
  getMatchesForTenant: protectedProcedure([Role.TENANT])
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT) throw new TRPCError({ code: "FORBIDDEN" });

      const relationships = await ctx.prisma.relationship.findMany({
        where: { relationType: RelationType.MATCH, userId: userId },
        include: {
          post: { include: { createdBy: true } },
          conversation: true,
          user: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      if (!relationships) throw new TRPCError({ code: "NOT_FOUND" });

      return relationships;
    }),
  getMatchesForOwner: protectedProcedure([Role.OWNER, Role.AGENCY])
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.OWNER && user.role != Role.AGENCY)
        throw new TRPCError({ code: "FORBIDDEN" });

      const postIds = await ctx.prisma.post
        .findMany({
          where: { createdById: userId },
          select: { id: true },
        })
        .then((result) => {
          return result.map((postObj) => {
            return postObj.id;
          });
        });

      if (!postIds) throw new TRPCError({ code: "NOT_FOUND" });

      const relationships = await ctx.prisma.relationship.findMany({
        where: {
          relationType: RelationType.MATCH,
          postId: {
            in: postIds,
          },
        },
        include: {
          post: { include: { createdBy: true } },
          conversation: true,
          user: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      if (!relationships) throw new TRPCError({ code: "NOT_FOUND" });

      return relationships;
    }),
  deleteRelationForTenant: protectedProcedure([Role.TENANT])
    .input(z.object({ userId: z.string(), relationshipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT) throw new TRPCError({ code: "FORBIDDEN" });

      const relationship = await ctx.prisma.relationship.findUnique({
        where: {
          id: input.relationshipId,
        },
      });

      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });

      if (relationship.userId != userId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This user does not correspond to this relationship",
        });

      const deleted = await ctx.prisma.relationship.delete({
        where: { id: relationship.id },
      });

      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
  deleteRelationForOwner: protectedProcedure([Role.OWNER, Role.AGENCY])
    .input(z.object({ userId: z.string(), relationshipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.AGENCY && user.role != Role.OWNER)
        throw new TRPCError({ code: "FORBIDDEN" });

      const relationship = await ctx.prisma.relationship.findUnique({
        where: { id: input.relationshipId },
        include: { post: true },
      });

      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });

      if (relationship.post.createdById != userId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This user does not correspond to this relationship",
        });

      const deleted = await ctx.prisma.relationship.delete({
        where: { id: relationship.id },
      });

      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
  getLikesForTenant: protectedProcedure([Role.TENANT])
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { isPremium: true, role: true },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT) throw new TRPCError({ code: "FORBIDDEN" });

      const relationships = await ctx.prisma.relationship.findMany({
        where: { relationType: RelationType.POST, userId: userId },
        include: {
          post: true,
        },
      });

      if (!relationships) throw new TRPCError({ code: "NOT_FOUND" });

      if (!user.isPremium)
        return { count: relationships.length, relationship: null };

      return { count: relationships.length, relationship: relationships };
    }),
  getLikesForOwner: protectedProcedure([Role.OWNER, Role.AGENCY])
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { isPremium: true, role: true },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.OWNER && user.role != Role.AGENCY)
        throw new TRPCError({ code: "FORBIDDEN" });

      const postIds = await ctx.prisma.post
        .findMany({
          where: { createdById: userId },
          select: { id: true },
        })
        .then((result) => {
          return result.map((postObj) => {
            return postObj.id;
          });
        });

      if (!postIds) throw new TRPCError({ code: "NOT_FOUND" });

      const relationships = await ctx.prisma.relationship.findMany({
        where: {
          relationType: RelationType.TENANT,
          postId: {
            in: postIds,
          },
        },
        include: {
          user: true,
          post: true,
        },
      });

      if (!relationships) throw new TRPCError({ code: "NOT_FOUND" });

      if (!user.isPremium)
        return { count: relationships.length, relationship: null };

      return { count: relationships.length, relationship: relationships };
    }),
});
