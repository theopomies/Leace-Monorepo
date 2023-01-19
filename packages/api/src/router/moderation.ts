import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { ReportReason, ReportStatus, Roles, UserStatus } from "@prisma/client";

export const moderationRouter = router({
  getReport: protectedProcedure([Roles.ADMIN, Roles.MODERATOR]).query(
    async ({ ctx }) => {
      return await ctx.prisma.report.findFirstOrThrow({
        orderBy: { createdAt: "desc" },
        where: { NOT: [{ userId: null }], status: ReportStatus.PENDING },
        include: {
          createdBy: {
            include: { images: true, reports: true },
          },
        },
      });
    },
  ),
  getById: protectedProcedure([Roles.ADMIN])
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirstOrThrow({
        where: {
          id: input,
        },
        include: { images: true, reports: true },
      });
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
      return await ctx.prisma.report.update({
        where: { id: input.id },
        data: input.reason
          ? {
              reason: input.reason,
              status: input.status,
            }
          : { status: input.status },
      });
    }),
  banUser: protectedProcedure([Roles.ADMIN, Roles.MODERATOR])
    .input(
      z.object({
        id: z.string(),
        status: z.enum([UserStatus.BANNED, UserStatus.ACTIVE]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});
