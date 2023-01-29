import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { ReportReason, ReportStatus, Roles, UserStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const moderationRouter = router({
  getReport: protectedProcedure([Roles.ADMIN, Roles.MODERATOR]).query(
    ({ ctx }) => {
      return ctx.prisma.report.findFirstOrThrow({
        orderBy: { createdAt: "desc" },
        where: { NOT: [{ userId: null }], status: ReportStatus.PENDING },
        include: {
          createdBy: {
            include: { reports: true },
          },
        },
      });
    },
  ),
  getById: protectedProcedure([Roles.ADMIN])
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirstOrThrow({
        where: {
          id: input,
        },
        include: { reports: true },
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
    .mutation(({ ctx, input }) => {
      return ctx.prisma.report.update({
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
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
  deleteImage: protectedProcedure()
    .input(z.object({ userId: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.prisma.image.findFirst({
        where: { id: input.id, userId: input.userId },
      });
      if (!image) throw new TRPCError({ code: "NOT_FOUND" });

      const deleted = await ctx.prisma.image.delete({
        where: { id: image.id },
      });
      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: `${ctx.session.user.id}/images/${image.id}.${image.ext}`,
      };
      const command = new DeleteObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
  documentValidation: protectedProcedure([Roles.ADMIN, Roles.MODERATOR])
    .input(
      z.object({
        id: z.string(),
        valid: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const documents = await ctx.prisma.document.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!documents) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.prisma.document.update({
        where: { id: input.id },
        data: { valid: input.valid },
      });
    }),
});
