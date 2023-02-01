import { Roles } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const relationShipRouter = router({
  likeUser: protectedProcedure([Roles.OWNER, Roles.AGENCY])
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
      if (user.role != Roles.TENANT)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      if (post.createdById != ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      const rs = await ctx.prisma.relationShip.findFirst({
        where: { postId: post.id, userId: user.id },
      });
      if (!rs) {
        const created = await ctx.prisma.relationShip.create({
          data: {
            userId: user.id,
            postId: post.id,
          },
        });
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        return created.isMatch;
      }
      const updated = await ctx.prisma.relationShip.update({
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
  dislikeUser: protectedProcedure([Roles.AGENCY, Roles.OWNER])
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
      if (user.role != Roles.TENANT)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      if (post.createdById != ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      const rs = await ctx.prisma.relationShip.findFirst({
        where: { postId: post.id, userId: input.userId },
      });
      if (!rs) {
        return { message: "No relationship to delete" };
      }

      const deleted = await ctx.prisma.relationShip.delete({
        where: { id: rs.id },
      });
      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return { message: "You missed a match!" };
    }),
  likePost: protectedProcedure([Roles.TENANT])
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationShip.findFirst({
        where: { postId: post.id, userId: ctx.session.user.id },
      });
      if (!rs) {
        const created = await ctx.prisma.relationShip.create({
          data: {
            userId: ctx.session.user.id,
            postId: post.id,
          },
        });
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        return created.isMatch;
      }

      const updated = await ctx.prisma.relationShip.update({
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
  dislikePost: protectedProcedure([Roles.TENANT])
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationShip.findFirst({
        where: { postId: post.id, userId: ctx.session.user.id },
      });
      if (!rs) {
        return { message: "No relationship to delete" };
      }

      const deleted = await ctx.prisma.relationShip.delete({
        where: { id: rs.id },
      });
      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return { message: "You missed a match!" };
    }),
  getOwnerMatch: protectedProcedure([Roles.OWNER, Roles.AGENCY]).query(
    async ({ ctx }) => {
      const postIds = await ctx.prisma.post.findMany({
        where: { createdById: ctx.session.user.id },
        select: { id: true },
      });
      if (!postIds) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationShip.findMany({
        where: {
          isMatch: true,
          postId: {
            in: postIds.map((postObj) => {
              return postObj.id;
            }),
          },
        },
        include: {
          user: true,
        },
      });
      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      return rs;
    },
  ),
  getTenantMatch: protectedProcedure([Roles.TENANT]).query(async ({ ctx }) => {
    const rs = await ctx.prisma.relationShip.findMany({
      where: { isMatch: true, userId: ctx.session.user.id },
      include: {
        post: {
          include: {
            createdBy: true,
          },
        },
      },
    });
    if (!rs) throw new TRPCError({ code: "NOT_FOUND" });
    return rs;
  }),
  deleteMatch: protectedProcedure([Roles.TENANT, Roles.OWNER, Roles.AGENCY])
    .input(z.object({ rsId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role == Roles.TENANT) {
        const rs = await ctx.prisma.relationShip.findFirst({
          where: { id: input.rsId, userId: ctx.session.user.id, isMatch: true },
        });
        if (!rs) throw new TRPCError({ code: "NOT_FOUND" });
        return await ctx.prisma.relationShip.delete({ where: { id: rs.id } });
      }

      const postIds = await ctx.prisma.post.findMany({
        where: { createdById: ctx.session.user.id },
        select: { id: true },
      });
      if (!postIds) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationShip.findFirst({
        where: {
          isMatch: true,
          id: input.rsId,
          postId: {
            in: postIds.map((postObj) => {
              return postObj.id;
            }),
          },
        },
      });
      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      return await ctx.prisma.relationShip.delete({ where: { id: rs.id } });
    }),
  getLike: protectedProcedure([Roles.TENANT, Roles.OWNER, Roles.AGENCY]).query(
    async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { isPremium: true },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (ctx.session.user.role == Roles.TENANT) {
        const rs = await ctx.prisma.relationShip.findMany({
          where: { isMatch: false, userId: ctx.session.user.id },
          include: {
            post: {
              include: {
                createdBy: true,
              },
            },
          },
        });
        if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

        if (!user.isPremium) {
          return rs.length;
        }
        return rs;
      }

      const postIds = await ctx.prisma.post.findMany({
        where: { createdById: ctx.session.user.id },
        select: { id: true },
      });
      if (!postIds) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationShip.findMany({
        where: {
          isMatch: false,
          postId: {
            in: postIds.map((postObj) => {
              return postObj.id;
            }),
          },
        },
        include: {
          user: true,
        },
      });
      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      if (!user.isPremium) {
        return rs.length;
      }
      return rs;
    },
  ),
});
import { Roles } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const relationshipRouter = router({
  likeUser: protectedProcedure([Roles.OWNER, Roles.AGENCY])
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
      if (user.role != Roles.TENANT)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      if (post.createdById != ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });

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
  dislikeUser: protectedProcedure([Roles.AGENCY, Roles.OWNER])
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
      if (user.role != Roles.TENANT)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      if (post.createdById != ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      const rs = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: input.userId },
      });
      if (!rs) {
        return { message: "No relationship to delete" };
      }

      const deleted = await ctx.prisma.relationship.delete({
        where: { id: rs.id },
      });
      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return { message: "You missed a match!" };
    }),
  likePost: protectedProcedure([Roles.TENANT])
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: ctx.session.user.id },
      });
      if (!rs) {
        const created = await ctx.prisma.relationship.create({
          data: {
            userId: ctx.session.user.id,
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
  dislikePost: protectedProcedure([Roles.TENANT])
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationship.findFirst({
        where: { postId: post.id, userId: ctx.session.user.id },
      });
      if (!rs) {
        return { message: "No relationship to delete" };
      }

      const deleted = await ctx.prisma.relationship.delete({
        where: { id: rs.id },
      });
      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return { message: "You missed a match!" };
    }),
  getMatch: protectedProcedure([Roles.TENANT, Roles.OWNER, Roles.AGENCY])
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      if (ctx.session.user.role == Roles.TENANT) {
        const rs = await ctx.prisma.relationship.findMany({
          where: { isMatch: true, userId: ctx.session.user.id },
          include: {
            post: {
              include: {
                createdBy: true,
              },
            },
            user: true,
            conversation: {
              include: { messages: true },
            },
          },
        });
        if (!rs) throw new TRPCError({ code: "NOT_FOUND" });
        return rs;
      }

      const postIds = await ctx.prisma.post.findMany({
        where: { createdById: ctx.session.user.id },
        select: { id: true },
      });
      if (!postIds) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationship.findMany({
        where: {
          isMatch: true,
          postId: {
            in: postIds.map((postObj) => {
              return postObj.id;
            }),
          },
        },
        include: {
          post: {
            include: {
              createdBy: true,
            },
          },
          user: true,
          conversation: {
            include: { messages: true },
          },
        },
      });
      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      return rs;
    }),
  deleteMatch: protectedProcedure([Roles.TENANT, Roles.OWNER, Roles.AGENCY])
    .input(z.object({ rsId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role == Roles.TENANT) {
        const rs = await ctx.prisma.relationship.findFirst({
          where: { id: input.rsId, userId: ctx.session.user.id, isMatch: true },
        });
        if (!rs) throw new TRPCError({ code: "NOT_FOUND" });
        return await ctx.prisma.relationship.delete({ where: { id: rs.id } });
      }

      const postIds = await ctx.prisma.post.findMany({
        where: { createdById: ctx.session.user.id },
        select: { id: true },
      });
      if (!postIds) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationship.findFirst({
        where: {
          isMatch: true,
          id: input.rsId,
          postId: {
            in: postIds.map((postObj) => {
              return postObj.id;
            }),
          },
        },
      });
      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      return await ctx.prisma.relationship.delete({ where: { id: rs.id } });
    }),
  getLike: protectedProcedure([Roles.TENANT, Roles.OWNER, Roles.AGENCY]).query(
    async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { isPremium: true },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (ctx.session.user.role == Roles.TENANT) {
        const rs = await ctx.prisma.relationship.findMany({
          where: { isMatch: false, userId: ctx.session.user.id },
          include: {
            post: {
              include: {
                createdBy: true,
              },
            },
          },
        });
        if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

        if (!user.isPremium) {
          return rs.length;
        }
        return rs;
      }

      const postIds = await ctx.prisma.post.findMany({
        where: { createdById: ctx.session.user.id },
        select: { id: true },
      });
      if (!postIds) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationship.findMany({
        where: {
          isMatch: false,
          postId: {
            in: postIds.map((postObj) => {
              return postObj.id;
            }),
          },
        },
        include: {
          user: true,
        },
      });
      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      if (!user.isPremium) {
        return rs.length;
      }
      return rs;
    },
  ),
});
