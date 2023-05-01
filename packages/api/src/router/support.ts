import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { getId } from "../utils/getId";

export const supportRouter = router({
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
