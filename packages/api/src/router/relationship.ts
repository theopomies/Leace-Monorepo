import { PostType, UserStatus } from "@prisma/client";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { getId } from "../utils/getId";
import { movePostToSeen, moveUserToSeen } from "../utils/algorithm";

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

      await moveUserToSeen(ctx.auth.userId, post.id);

      const rs = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: user.id },
      });

      if (!rs) {
        const created = await ctx.prisma.relationship.create({
          data: {
            userId: user.id,
            postId: post.id,
          },
        });
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return created.isMatch;
      }

      const updated = await ctx.prisma.relationship.update({
        where: { id: rs.id },
        data: { isMatch: true },
      });

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const chat = await ctx.prisma.conversation.create({
        data: { relationId: updated.id },
      });
      if (!chat) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return updated.isMatch;
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

      await moveUserToSeen(ctx.auth.userId, post.id);

      const rs = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: user.id },
      });

      if (!rs) return { missed: false, message: "Nothing to do" };

      const deleted = await ctx.prisma.relationship.delete({
        where: { id: rs.id },
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
      await movePostToSeen(ctx.auth.userId, post.id);

      const rs = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: user.id },
      });

      if (!rs) {
        const created = await ctx.prisma.relationship.create({
          data: {
            userId: user.id,
            postId: post.id,
          },
        });

        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return created.isMatch;
      }

      const updated = await ctx.prisma.relationship.update({
        where: { id: rs.id },
        data: { isMatch: true },
      });

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const chat = await ctx.prisma.conversation.create({
        data: { relationId: updated.id },
      });

      if (!chat) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return updated.isMatch;
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
      await movePostToSeen(ctx.auth.userId, post.id);

      const rs = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: user.id },
      });

      if (!rs) return { missed: false, message: "Nothing to do" };

      const deleted = await ctx.prisma.relationship.delete({
        where: { id: rs.id },
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

      const relationShips = await ctx.prisma.relationship.findMany({
        where: { isMatch: true, userId: userId },
        include: {
          post: { include: { createdBy: true } },
          conversation: true,
          user: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      if (!relationShips) throw new TRPCError({ code: "NOT_FOUND" });

      return relationShips;
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

      const relationShips = await ctx.prisma.relationship.findMany({
        where: {
          isMatch: true,
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

      if (!relationShips) throw new TRPCError({ code: "NOT_FOUND" });

      return relationShips;
    }),
  deleteMatchForTenant: protectedProcedure([Role.TENANT])
    .input(z.object({ userId: z.string(), relationShipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT) throw new TRPCError({ code: "FORBIDDEN" });

      const rs = await ctx.prisma.relationship.findUnique({
        where: {
          id: input.relationShipId,
        },
      });

      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      if (rs.userId != userId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This user does not correspond to this relationship",
        });

      if (!rs.isMatch)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This is not a match",
        });

      const deleted = await ctx.prisma.relationship.delete({
        where: { id: rs.id },
      });

      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
  deleteMatchForOwner: protectedProcedure([Role.OWNER, Role.AGENCY])
    .input(z.object({ userId: z.string(), relationShipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.AGENCY && user.role != Role.OWNER)
        throw new TRPCError({ code: "FORBIDDEN" });

      const rs = await ctx.prisma.relationship.findUnique({
        where: { id: input.relationShipId },
        include: { post: true },
      });

      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      if (rs.post.createdById != userId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This user does not correspond to this relationship",
        });

      if (!rs.isMatch)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This is not a match",
        });

      const deleted = await ctx.prisma.relationship.delete({
        where: { id: rs.id },
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

      const relationShips = await ctx.prisma.relationship.findMany({
        where: { isMatch: false, userId: userId },
        include: {
          post: true,
        },
      });

      if (!relationShips) throw new TRPCError({ code: "NOT_FOUND" });

      if (!user.isPremium) return { count: relationShips.length, rs: null };

      return { count: relationShips.length, rs: relationShips };
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

      const relationShips = await ctx.prisma.relationship.findMany({
        where: {
          isMatch: false,
          postId: {
            in: postIds,
          },
        },
        include: {
          user: true,
        },
      });

      if (!relationShips) throw new TRPCError({ code: "NOT_FOUND" });

      if (!user.isPremium) return { count: relationShips.length, rs: null };

      return { count: relationShips.length, rs: relationShips };
    }),
});
