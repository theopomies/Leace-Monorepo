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

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (post.createdById != ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      if (post.type != PostType.TO_BE_RENTED)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const type = conversation.type;
      if (type != ConversationType.TENANT && type != ConversationType.NONE)
        throw new TRPCError({ code: "BAD_REQUEST" });
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
        return;
      }

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

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (post.type != PostType.TO_BE_RENTED)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const type = conversation.type;
      if (
        type != ConversationType.NONE &&
        type != ConversationType.TENANT &&
        type != ConversationType.AGENCY
      )
        throw new TRPCError({ code: "BAD_REQUEST" });

      if (type == ConversationType.NONE) {
        await ctx.prisma.conversation.update({
          where: { id: conversation.id },
          data: { type: ConversationType.TENANT },
        });
        return;
      }
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
      }
      if (ctx.session.user.role == Roles.TENANT) {
        if (relationShip.userId != ctx.session.user.id)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (
        conversation.type == ConversationType.DONE ||
        conversation.type == ConversationType.NONE
      ) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      if (
        (conversation.type == ConversationType.TENANT &&
          ctx.session.user.role != Roles.TENANT) ||
        (conversation.type == ConversationType.AGENCY &&
          ctx.session.user.role != Roles.AGENCY) ||
        (conversation.type == ConversationType.OWNER &&
          ctx.session.user.role != Roles.OWNER)
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.prisma.conversation.update({
        where: { id: conversation.id },
        data: { type: ConversationType.NONE },
      });
    }),
  sendMessage: protectedProcedure([Roles.AGENCY, Roles.OWNER, Roles.TENANT])
    .input(z.object({ conversationId: z.string(), content: z.string() }))
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
      }
      if (ctx.session.user.role == Roles.TENANT) {
        if (relationShip.userId != ctx.session.user.id)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.prisma.message.create({
        data: {
          content: input.content,
          conversationId: conversation.id,
          senderId: ctx.session.user.id,
        },
      });
    }),
  readAllMessages: protectedProcedure([Roles.AGENCY, Roles.OWNER, Roles.TENANT])
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
      }
      if (ctx.session.user.role == Roles.TENANT) {
        if (relationShip.userId != ctx.session.user.id)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.prisma.message.updateMany({
        where: {
          conversationId: conversation.id,
          senderId: { not: ctx.session.user.id },
          read: false,
        },
        data: { read: true },
      });
    }),
  getMessages: protectedProcedure([Roles.AGENCY, Roles.OWNER, Roles.TENANT])
    .input(
      z.object({
        conversationId: z.string(),
        cursor: z.string().optional(),
        take: z.number().default(40),
      }),
    )
    .query(async ({ ctx, input }) => {
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
      }
      if (ctx.session.user.role == Roles.TENANT) {
        if (relationShip.userId != ctx.session.user.id)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      const messages = await ctx.prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "asc" },
        take: input.take,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      return messages;
    }),
  countUnreads: protectedProcedure([Roles.AGENCY, Roles.OWNER, Roles.TENANT])
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
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
      }
      if (ctx.session.user.role == Roles.TENANT) {
        if (relationShip.userId != ctx.session.user.id)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      const count = await ctx.prisma.message.count({
        where: {
          conversationId: conversation.id,
          senderId: { not: ctx.session.user.id },
          read: false,
        },
      });

      return count;
    }),
});
