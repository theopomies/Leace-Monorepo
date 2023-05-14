import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { ReportReason, ReportStatus, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const reportModeration = router({
  getReport: protectedProcedure([Role.ADMIN, Role.MODERATOR]).query(
    ({ ctx }) => {
      return ctx.prisma.report.findFirstOrThrow({
        orderBy: { createdAt: "desc" },
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
        id: z.string(),
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
        where: { id: input.id },
        data: {
          reason: input.reason,
          status: ReportStatus.RESOLVED,
        },
      });
    }),
  rejectUserReports: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      //utile ? si non une seule procédure pour rejectReports
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      //
      const reports = await ctx.prisma.report.findMany({
        where: { userId: input.userId, status: ReportStatus.PENDING },
      });
      if (reports.length === 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "No reports to reject",
        });
      }

      reports.forEach(async (report) => {
        await ctx.prisma.report.update({
          where: { id: report.id },
          data: { status: ReportStatus.REJECTED },
        });
      });
    }),
  rejectPostReports: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      const reports = await ctx.prisma.report.findMany({
        where: { postId: input.postId, status: ReportStatus.PENDING },
      });
      if (reports.length === 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "No reports to reject",
        });
      }
      reports.forEach(async (report) => {
        await ctx.prisma.report.update({
          where: { id: report.id },
          data: { status: ReportStatus.REJECTED },
        });
      });
    }),
});
