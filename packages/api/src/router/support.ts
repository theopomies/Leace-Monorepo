import { Role } from "@prisma/client";
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
      });
      if (!supports) throw new TRPCError({ code: "NOT_FOUND" });

      // **For the moment** find support who has no supportRelationship
      const support = supports.find((support) => {
        return support.supporting.length == 0;
      });
      if (!support)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No support available",
        });

      const supportRelationship = await ctx.prisma.supportRelationship.create({
        data: { userId, supportId: support.id },
      });
      if (!supportRelationship) throw new TRPCError({ code: "NOT_FOUND" });

      const chat = await ctx.prisma.conversation.create({
        data: { supportRelationId: supportRelationship.id },
      });
      if (!chat) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return chat;
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
          where: { userId },
          include: {
            support: true,
            user: true,
            conversation: { include: { messages: true } },
          },
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
          where: { userId },
          include: {
            support: true,
            user: true,
            conversation: { include: { messages: true } },
          },
        });

      if (!supportRelationShips) throw new TRPCError({ code: "NOT_FOUND" });

      return supportRelationShips;
    }),
});
