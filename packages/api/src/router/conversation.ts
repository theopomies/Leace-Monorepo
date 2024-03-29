import { RelationType } from "@leace/db";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { checkConversation } from "../utils/checkConversation";

export const conversationRouter = router({
  sendMessage: protectedProcedure([Role.AGENCY, Role.OWNER, Role.TENANT])
    .input(z.object({ conversationId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation
        .findUnique({
          where: { id: input.conversationId },
        })
        .then((conversation) => {
          return checkConversation({ ctx, conversation });
        });

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
        if (
          post.createdById != ctx.auth.userId &&
          ctx.auth.userId != post.managedById
        )
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
  getConversation: protectedProcedure([Role.AGENCY, Role.OWNER, Role.TENANT])
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
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: input.take,
            skip: input.cursor ? 1 : 0,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            include: { sender: true },
          },
        },
      });
      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.relationId && !conversation.supportRelationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (conversation.relationId) {
        const relationship = await ctx.prisma.relationship.findUnique({
          where: { id: conversation.relationId },
        });
        if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });
        if (ctx.role == Role.OWNER || ctx.role == Role.AGENCY) {
          const post = await ctx.prisma.post.findUnique({
            where: { id: relationship.postId },
          });
          if (!post) throw new TRPCError({ code: "NOT_FOUND" });
          if (
            post.createdById != ctx.auth.userId &&
            ctx.auth.userId != post.managedById
          ) {
            throw new TRPCError({ code: "FORBIDDEN" });
          }
        }
        if (ctx.role == Role.TENANT) {
          if (relationship.userId != ctx.auth.userId) {
            throw new TRPCError({ code: "FORBIDDEN" });
          }
        }
      }
      if (conversation.supportRelationId) {
        const supportRelationship =
          await ctx.prisma.supportRelationship.findUnique({
            where: { id: conversation.supportRelationId },
          });
        if (!supportRelationship) throw new TRPCError({ code: "NOT_FOUND" });

        if (ctx.role == Role.ADMIN || ctx.role == Role.MODERATOR) {
          if (supportRelationship.supportId != ctx.auth.userId)
            throw new TRPCError({ code: "FORBIDDEN" });
        } else {
          if (supportRelationship.userId != ctx.auth.userId)
            throw new TRPCError({ code: "FORBIDDEN" });
        }
      }
      return conversation;
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
        if (
          post.createdById != ctx.auth.userId &&
          ctx.auth.userId != post.managedById
        )
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
  totalUnreads: protectedProcedure([Role.AGENCY, Role.OWNER, Role.TENANT])
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const relationshipsWithConversations = await ctx.prisma.relationship.findMany({
        where: {
          userId: input.userId,
          relationType: RelationType.MATCH,
        },
        include: {
          conversation: true
        },
      });

      if (!relationshipsWithConversations) throw new TRPCError({ code: "NOT_FOUND" });

      const supportRelationshipsWithConversations = await ctx.prisma.supportRelationship.findMany({
        where: {
          userId: input.userId
        },
        include: { conversation: true },
      });

      if (!supportRelationshipsWithConversations) throw new TRPCError({ code: "NOT_FOUND" });

      const unreadsList = relationshipsWithConversations.map(async (relationship) => {
        return ctx.prisma.message.count({
          where: {
            conversationId: relationship.conversation?.id,
            senderId: { not: input.userId },
            read: false,
          },
        });
      })

      const supportUnreadsList = supportRelationshipsWithConversations.map(async (relationship) => {
        return ctx.prisma.message.count({
          where: {
            conversationId: relationship.conversation?.id,
            senderId: { not: input.userId },
            read: false,
          },
        });
      })

      const unreads = await Promise.all(unreadsList);
      const supportUnreads = await Promise.all(supportUnreadsList);

      const totalUnreads = unreads.reduce((a, b) => a + b, 0);
      const totalSupportUnreads = supportUnreads.reduce((a, b) => a + b, 0);

      return totalUnreads + totalSupportUnreads;
    }),
});
