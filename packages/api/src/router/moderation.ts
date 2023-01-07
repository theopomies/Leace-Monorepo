import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ReportReason, ReportStatus, Roles } from "@prisma/client";

export const moderationRouter = router({
  getReportedUser: protectedProcedure([Roles.ADMIN, Roles.MODERATOR]).query(
    async ({ ctx }) => {
      const getReport = await ctx.prisma.report.findFirst({
        orderBy: [{ createdAt: "asc" }],
        where: { status: ReportStatus.PENDING },
      });
      if (!getReport || !getReport.userId)
        throw new TRPCError({ code: "NOT_FOUND" });
      const userId: string = getReport.userId;
      const userReported = ctx.prisma.user.findUnique({
        where: { id: userId },
        include: { images: true, reports: true },
      });
      if (!userReported) throw new TRPCError({ code: "NOT_FOUND" });
      return userReported;
    },
  ),
  getById: protectedProcedure([Roles.ADMIN])
    .input(z.string())
    .query(({ ctx, input }) => {
      const getUser = ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
        include: { images: true, reports: true },
      });
      if (!getUser) throw new TRPCError({ code: "NOT_FOUND" });
      return getUser;
    }),
  updateReport: protectedProcedure([Roles.ADMIN, Roles.MODERATOR])
    .input(
      z.object({
        id: z.string(),
        reason: z
          .enum([
            ReportReason.SCAM,
            ReportReason.SPAM,
            ReportReason.INAPPROPRIATE,
            ReportReason.OTHER,
          ])
          .optional(),
        status: z.enum([
          ReportStatus.PENDING,
          ReportStatus.REJECTED,
          ReportStatus.RESOLVED,
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const getUser = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: { reports: true },
      });
      if (!getUser) throw new TRPCError({ code: "NOT_FOUND" });
      getUser.reports.map((report) => {
        if (report.status != ReportStatus.PENDING) {
          report.status = input.status;
        }
      });
    }),
});
