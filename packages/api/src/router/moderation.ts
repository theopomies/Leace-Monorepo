import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ReportReason, ReportStatus, Roles } from "@prisma/client";

export const moderationRouter = router({
  getReportedUser: protectedProcedure([Roles.ADMIN, Roles.MODERATOR]).query(
    async ({ ctx }) => {
      const getReport = await ctx.prisma.report.findFirstOrThrow({
        orderBy: { createdAt: "desc" },
        where: { NOT: [{ userId: null }], status: ReportStatus.PENDING },
      });
      if (!getReport.userId) throw new TRPCError({ code: "NOT_FOUND" });
      return await ctx.prisma.user.findFirstOrThrow({
        orderBy: { createdAt: "desc" },
        where: { id: getReport.userId },
        include: { reports: true, images: true },
      });
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
      getUser.reports.map(async (report) => {
        if (report.status == ReportStatus.PENDING) {
          await ctx.prisma.report.update({
            where: { id: report.id },
            data: {
              reason: input.reason,
              status: input.status,
            },
          });
        }
        return getUser;
      });
    }),
});
