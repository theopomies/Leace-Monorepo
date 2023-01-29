import { ConversationType, PostType, Roles } from "@leace/db";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const conversationRouter = router({
  sendDealToUser: protectedProcedure([Roles.AGENCY, Roles.OWNER])
    .input(
      z.object({
        conversationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.relationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const relationShip = await ctx.prisma.relationShip.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationShip) throw new TRPCError({ code: "NOT_FOUND" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: relationShip.postId },
      });

      if (post?.createdById != ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      if (post?.type != PostType.TO_BE_RENTED)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const type = conversation.type;
      if (type == ConversationType.TENANT) {
        await ctx.prisma.conversation.update({
          where: { id: conversation.id },
          data: { type: ConversationType.DONE },
        });
        await ctx.prisma.post.update({
          where: { id: relationShip.postId },
          data: {
            type: PostType.RENTED,
          },
        });
      } else if (type == ConversationType.NONE) {
        const userType = ctx.session.user.role;

        await ctx.prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            type:
              userType == Roles.AGENCY
                ? ConversationType.AGENCY
                : ConversationType.OWNER,
          },
        });
      } else {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  sendDealToPost: protectedProcedure([Roles.TENANT])
    .input(
      z.object({
        conversationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.relationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const relationShip = await ctx.prisma.relationShip.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationShip) throw new TRPCError({ code: "NOT_FOUND" });

      if (relationShip.userId != ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: relationShip.postId },
      });
      if (post?.type != PostType.TO_BE_RENTED)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const type = conversation.type;
      if (type == ConversationType.NONE) {
        await ctx.prisma.conversation.update({
          where: { id: conversation.id },
          data: { type: ConversationType.TENANT },
        });
      } else if (
        type == ConversationType.TENANT ||
        type == ConversationType.AGENCY
      ) {
        await ctx.prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            type: ConversationType.DONE,
          },
        });
        await ctx.prisma.post.update({
          where: { id: relationShip.postId },
          data: {
            type: PostType.RENTED,
          },
        });
      } else {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  cancelDeal: protectedProcedure([Roles.AGENCY, Roles.OWNER, Roles.TENANT])
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.relationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const relationShip = await ctx.prisma.relationShip.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationShip) throw new TRPCError({ code: "NOT_FOUND" });
      if (
        ctx.session.user.role == Roles.OWNER ||
        ctx.session.user.role == Roles.AGENCY
      ) {
        const post = await ctx.prisma.post.findUnique({
          where: { id: relationShip.postId },
        });
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        if (post.createdById != ctx.session.user.id)
          throw new TRPCError({ code: "FORBIDDEN" });
      } else if (ctx.session.user.role == Roles.TENANT) {
        if (relationShip.userId != ctx.session.user.id)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (
        (conversation.type == ConversationType.TENANT &&
          ctx.session.user.role == Roles.TENANT) ||
        (conversation.type == ConversationType.AGENCY &&
          ctx.session.user.role == Roles.AGENCY) ||
        (conversation.type == ConversationType.OWNER &&
          ctx.session.user.role == Roles.OWNER)
      ) {
        await ctx.prisma.conversation.update({
          where: { id: conversation.id },
          data: { type: ConversationType.NONE },
        });
      } else if (
        conversation.type == ConversationType.DONE ||
        conversation.type == ConversationType.NONE
      ) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      } else {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    }),
});
