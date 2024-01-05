import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { ReportReason, ReportStatus, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const reportModeration = router({
  getReport: protectedProcedure([Role.ADMIN, Role.MODERATOR]).query(
    ({ ctx }) => {
      return ctx.prisma.report.findFirst({
        orderBy: { createdAt: "asc" },
        where: { status: ReportStatus.PENDING },
      });
    },
  ),
  getReportsByUserId: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.report.findMany({
        where: { userId: input.userId, status: ReportStatus.PENDING },
      });
    }),
  updateReport: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(
      z.object({
        reportId: z.string(),
        reason: z.enum([
          ReportReason.SCAM,
          ReportReason.SPAM,
          ReportReason.INAPPROPRIATE,
          ReportReason.OTHER,
        ]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.report.update({
        where: { id: input.reportId },
        data: {
          reason: input.reason,
          status: ReportStatus.RESOLVED,
        },
      });
    }),
  rejectReports: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ reportId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const report = await ctx.prisma.report.findUnique({
        where: { id: input.reportId },
      });
      if (!report) throw new TRPCError({ code: "NOT_FOUND" });

      const relatedReports = await ctx.prisma.report.findMany({
        where: {
          OR: [{ userId: report.userId }, { postId: report.postId }],
          status: ReportStatus.PENDING,
        },
      });
      if (relatedReports.length === 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "No reports to reject",
        });
      }

      relatedReports.forEach(async (report) => {
        await ctx.prisma.report.update({
          where: { id: report.id },
          data: { status: ReportStatus.REJECTED },
        });
      });
    }),
});
