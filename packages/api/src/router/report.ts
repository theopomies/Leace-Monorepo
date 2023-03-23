import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { ReportReason, ReportStatus, Roles } from "@prisma/client";

export const reportRouter = router({
  reportUser: protectedProcedure([Roles.AGENCY, Roles.OWNER])
    .input(
      z.object({
        userId: z.string(),
        reason: z.enum([
          ReportReason.INAPPROPRIATE,
          ReportReason.OTHER,
          ReportReason.SCAM,
          ReportReason.SPAM,
        ]),
        desc: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.report.create({
        data: {
          createdById: ctx.auth.userId,
          userId: input.userId,
          desc: input.desc,
          status: ReportStatus.PENDING,
          reason: input.reason,
        },
      });
    }),
  reportPost: protectedProcedure([Roles.TENANT])
    .input(
      z.object({
        postId: z.string(),
        reason: z.enum([
          ReportReason.INAPPROPRIATE,
          ReportReason.OTHER,
          ReportReason.SCAM,
          ReportReason.SPAM,
        ]),
        desc: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.report.create({
        data: {
          createdById: ctx.auth.userId,
          postId: input.postId,
          desc: input.desc,
          status: ReportStatus.PENDING,
          reason: input.reason,
        },
      });
    }),
});
