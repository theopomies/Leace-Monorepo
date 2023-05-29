import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { ReportReason, ReportStatus, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const banModeration = router({
  getIsBan: protectedProcedure([
    Role.ADMIN,
    Role.MODERATOR,
    Role.TENANT,
    Role.OWNER,
    Role.AGENCY,
  ])
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const lastBan = await ctx.prisma.ban.findFirst({
        where: { userId: input.userId },
        orderBy: { until: "desc" },
      });
      if (!lastBan) return false;
      return lastBan.until > new Date();
    }),
  unBanUser: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const lastBan = await ctx.prisma.ban.findFirst({
        where: { userId: input.userId },
        orderBy: { until: "desc" },
      });
      if (!lastBan) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.prisma.ban.update({
        where: { id: lastBan.id },
        data: { until: new Date() },
      });
    }),
  createBan: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(
      z.object({
        userId: z.string(),
        reportIds: z.array(z.string()),
        reason: z.enum([
          ReportReason.SCAM,
          ReportReason.SPAM,
          ReportReason.INAPPROPRIATE,
          ReportReason.OTHER,
        ]),
        comment: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: { bans: true },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const lastBan = await ctx.prisma.ban.findFirst({
        where: { userId: input.userId },
        orderBy: { until: "desc" },
      });
      if (lastBan && lastBan.until > new Date()) {
        throw new TRPCError({ code: "CONFLICT", message: "Already Banned" });
      }

      // update reports to resolved
      if (input.reportIds) {
        input.reportIds.forEach(async (id) => {
          await ctx.prisma.report.update({
            where: { id },
            data: { status: ReportStatus.RESOLVED },
          });
        });
      }

      switch (input.reason) {
        case "SCAM":
          return ctx.prisma.ban.create({
            data: {
              createdById: ctx.auth.userId,
              userId: input.userId,
              reports: { connect: input.reportIds?.map((id) => ({ id })) },
              reason: input.reason,
              duration: "365 days",
              until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 365 days
              comment: input.comment,
            },
          });
        case "SPAM":
          return ctx.prisma.ban.create({
            data: {
              createdById: ctx.auth.userId,
              userId: input.userId,
              reports: { connect: input.reportIds?.map((id) => ({ id })) },
              reason: input.reason,
              duration: "30 days",
              until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
              comment: input.comment,
            },
          });
        case "INAPPROPRIATE":
          return ctx.prisma.ban.create({
            data: {
              createdById: ctx.auth.userId,
              userId: input.userId,
              reports: { connect: input.reportIds?.map((id) => ({ id })) },
              reason: input.reason,
              duration: "15 days",
              until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days
              comment: input.comment,
            },
          });
        case "OTHER":
          return ctx.prisma.ban.create({
            data: {
              createdById: ctx.auth.userId,
              userId: input.userId,
              reports: { connect: input.reportIds?.map((id) => ({ id })) },
              reason: input.reason,
              duration: "7 days",
              until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
              comment: input.comment,
            },
          });
      }
    }),
});
