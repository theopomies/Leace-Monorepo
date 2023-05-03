import { Role, ConversationType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { getId } from "../utils/getId";

export const supportRouter = router({
  createRelationship: protectedProcedure([Role.TENANT, Role.OWNER, Role.AGENCY])
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const supports = await ctx.prisma.user.findMany({
        where: { role: Role.ADMIN },
        include: { supporting: true },
        orderBy: { supporting: { _count: "asc" } }, // Support who has the least supportRelationships
      });
      if (!supports) throw new TRPCError({ code: "NOT_FOUND" });

      const support = supports[0];
      if (!support)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No support available",
        });

      const supportRelationship = await ctx.prisma.supportRelationship.create({
        data: { userId, supportId: support.id },
      });
      if (!supportRelationship) throw new TRPCError({ code: "NOT_FOUND" });

      const conversation = await ctx.prisma.conversation.create({
        data: { supportRelationId: supportRelationship.id },
      });
      if (!conversation) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await ctx.prisma.message.create({
        data: {
          content: "What can the best mechanic in LS do for you ?",
          conversationId: conversation.id,
          senderId: support.id,
        },
      });

      return conversation;
    }),
  getRelationshipsForTenant: protectedProcedure([Role.TENANT])
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT) throw new TRPCError({ code: "FORBIDDEN" });

      const supportRelationships =
        await ctx.prisma.supportRelationship.findMany({
          where: {
            userId,
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

      if (!supportRelationships) throw new TRPCError({ code: "NOT_FOUND" });

      return supportRelationships;
    }),
  getRelationshipsForOwner: protectedProcedure([Role.OWNER, Role.AGENCY])
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.OWNER && user.role != Role.AGENCY)
        throw new TRPCError({ code: "FORBIDDEN" });

      const supportRelationShips =
        await ctx.prisma.supportRelationship.findMany({
          where: {
            userId,
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

      if (!supportRelationShips) throw new TRPCError({ code: "NOT_FOUND" });

      return supportRelationShips;
    }),
  endOfConversation: protectedProcedure([
    Role.TENANT,
    Role.OWNER,
    Role.AGENCY,
    Role.ADMIN,
    Role.MODERATOR,
  ])
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
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

      if (
        supportRelationship.userId != ctx.auth.userId &&
        supportRelationship.supportId != ctx.auth.userId
      )
        throw new TRPCError({ code: "FORBIDDEN" });

      if (conversation.type === ConversationType.DONE)
        throw new TRPCError({ code: "BAD_REQUEST" });

      await ctx.prisma.conversation.update({
        where: { id: conversation.id },
        data: { type: ConversationType.DONE },
      });
    }),
});
