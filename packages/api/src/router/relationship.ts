import { RelationShip, Roles } from "@prisma/client";
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
        const created: RelationShip = await ctx.prisma.relationShip.create({
          data: {
            userId: user.id,
            postId: post.id,
          },
        });
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        return created.isMatch;
      }
      const updated: RelationShip = await ctx.prisma.relationShip.update({
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
        const created: RelationShip = await ctx.prisma.relationShip.create({
          data: {
            userId: ctx.session.user.id,
            postId: post.id,
          },
        });
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        return created.isMatch;
      }

      const updated: RelationShip = await ctx.prisma.relationShip.update({
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
});
