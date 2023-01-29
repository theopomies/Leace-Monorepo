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
});
