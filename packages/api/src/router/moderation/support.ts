import { Role, ConversationType } from "@prisma/client";
import { protectedProcedure, router } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getId } from "../../utils/getId";

export const supportModeration = router({
  getRelationships: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const supportRs = await ctx.prisma.supportRelationship.findMany({
        where: {
          supportId: userId,
          conversation: {
            type: { not: ConversationType.DONE },
          },
        },
        include: {
          support: true,
          user: true,
          conversation: true,
        },
        orderBy: { updatedAt: "desc" },
      });
      if (!supportRs) throw new TRPCError({ code: "NOT_FOUND" });

      return supportRs;
    }),
  getConversation: protectedProcedure([Role.ADMIN, Role.MODERATOR])
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
      if (!conversation.supportRelationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const supportRelationship =
        await ctx.prisma.supportRelationship.findUnique({
          where: { id: conversation.supportRelationId },
        });
      if (!supportRelationship) throw new TRPCError({ code: "NOT_FOUND" });

      if (supportRelationship.supportId != ctx.auth.userId)
        throw new TRPCError({ code: "FORBIDDEN" });

      return conversation;
    }),
  sendMessage: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ conversationId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.supportRelationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const supportRelationship =
        await ctx.prisma.supportRelationship.findUnique({
          where: { id: conversation.supportRelationId },
        });
      if (!supportRelationship) throw new TRPCError({ code: "NOT_FOUND" });

      if (supportRelationship.supportId != ctx.auth.userId)
        throw new TRPCError({ code: "FORBIDDEN" });

      await ctx.prisma.message.create({
        data: {
          content: input.content,
          conversationId: conversation.id,
          senderId: ctx.auth.userId,
        },
      });
    }),
});
