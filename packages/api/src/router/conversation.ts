import { ConversationType, PostType, Role } from "@leace/db";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const conversationRouter = router({
  sendDealToUser: protectedProcedure([Role.AGENCY, Role.OWNER])
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

      const relationship = await ctx.prisma.relationship.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: relationship.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (post.createdById != ctx.auth.userId)
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
          where: { id: relationship.postId },
          data: {
            type: PostType.RENTED,
          },
        });
        return;
      }

      const userType = ctx.role;

      await ctx.prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          type:
            userType == Role.AGENCY
              ? ConversationType.AGENCY
              : ConversationType.OWNER,
        },
      });
    }),
  sendDealToPost: protectedProcedure([Role.TENANT])
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

      const relationship = await ctx.prisma.relationship.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });

      if (relationship.userId != ctx.auth.userId)
        throw new TRPCError({ code: "FORBIDDEN" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: relationship.postId },
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
        where: { id: relationship.postId },
        data: {
          type: PostType.RENTED,
        },
      });
    }),
  cancelDeal: protectedProcedure([Role.AGENCY, Role.OWNER, Role.TENANT])
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.relationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const relationship = await ctx.prisma.relationship.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.role == Role.OWNER || ctx.role == Role.AGENCY) {
        const post = await ctx.prisma.post.findUnique({
          where: { id: relationship.postId },
        });
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        if (post.createdById != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (ctx.role == Role.TENANT) {
        if (relationship.userId != ctx.auth.userId)
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
          ctx.role != Role.TENANT) ||
        (conversation.type == ConversationType.AGENCY &&
          ctx.role != Role.AGENCY) ||
        (conversation.type == ConversationType.OWNER && ctx.role != Role.OWNER)
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.prisma.conversation.update({
        where: { id: conversation.id },
        data: { type: ConversationType.NONE },
      });
    }),
  sendMessage: protectedProcedure([Role.AGENCY, Role.OWNER, Role.TENANT])
    .input(z.object({ conversationId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.relationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const relationship = await ctx.prisma.relationship.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.role == Role.OWNER || ctx.role == Role.AGENCY) {
        const post = await ctx.prisma.post.findUnique({
          where: { id: relationship.postId },
        });
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        if (post.createdById != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (ctx.role == Role.TENANT) {
        if (relationship.userId != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.prisma.message.create({
        data: {
          content: input.content,
          conversationId: conversation.id,
          senderId: ctx.auth.userId,
        },
      });
    }),
  readAllMessages: protectedProcedure([Role.AGENCY, Role.OWNER, Role.TENANT])
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.relationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const relationship = await ctx.prisma.relationship.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.role == Role.OWNER || ctx.role == Role.AGENCY) {
        const post = await ctx.prisma.post.findUnique({
          where: { id: relationship.postId },
        });
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        if (post.createdById != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (ctx.role == Role.TENANT) {
        if (relationship.userId != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.prisma.message.updateMany({
        where: {
          conversationId: conversation.id,
          senderId: { not: ctx.auth.userId },
          read: false,
        },
        data: { read: true },
      });
    }),
  getMessages: protectedProcedure([Role.AGENCY, Role.OWNER, Role.TENANT])
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

      const relationship = await ctx.prisma.relationship.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.role == Role.OWNER || ctx.role == Role.AGENCY) {
        const post = await ctx.prisma.post.findUnique({
          where: { id: relationship.postId },
        });
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        if (post.createdById != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (ctx.role == Role.TENANT) {
        if (relationship.userId != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      const messages = await ctx.prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "asc" },
        take: input.take,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { sender: true },
      });

      return messages;
    }),
  countUnreads: protectedProcedure([Role.AGENCY, Role.OWNER, Role.TENANT])
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.relationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const relationship = await ctx.prisma.relationship.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.role == Role.OWNER || ctx.role == Role.AGENCY) {
        const post = await ctx.prisma.post.findUnique({
          where: { id: relationship.postId },
        });
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        if (post.createdById != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (ctx.role == Role.TENANT) {
        if (relationship.userId != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      const count = await ctx.prisma.message.count({
        where: {
          conversationId: conversation.id,
          senderId: { not: ctx.auth.userId },
          read: false,
        },
      });

      return count;
    }),
});
