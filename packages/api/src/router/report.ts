import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { ReportReason, ReportStatus, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const reportRouter = router({
  reportUserById: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        userId: z.string(),
        reason: z.enum([
          ReportReason.SCAM,
          ReportReason.SPAM,
          ReportReason.INAPPROPRIATE,
          ReportReason.OTHER,
        ]),
        desc: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId;
      const createdById = ctx.auth.userId;

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const report = await ctx.prisma.report.create({
        data: {
          createdById,
          userId,
          desc: input.desc,
          status: ReportStatus.PENDING,
          reason: input.reason,
        },
      });

      if (!report) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),

  reportPostById: protectedProcedure([Role.TENANT])
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
    .mutation(async ({ ctx, input }) => {
      const postId = input.postId;
      const createdById = ctx.auth.userId;

      const post = await ctx.prisma.post.findUnique({ where: { id: postId } });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      const report = await ctx.prisma.report.create({
        data: {
          createdById,
          postId,
          desc: input.desc,
          status: ReportStatus.PENDING,
          reason: input.reason,
        },
      });

      if (!report) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
});
