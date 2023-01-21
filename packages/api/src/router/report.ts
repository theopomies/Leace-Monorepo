import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { ReportReason, ReportStatus, Roles } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const reportRouter = router({
  reportUser: protectedProcedure([
    Roles.AGENCY,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.MODERATOR,
  ])
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
          createdById: ctx.session.user.id,
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
          createdById: ctx.session.user.id,
          postId: input.postId,
          desc: input.desc,
          status: ReportStatus.PENDING,
          reason: input.reason,
        },
      });
    }),
});
