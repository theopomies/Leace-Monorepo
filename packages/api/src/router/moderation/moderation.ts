import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { ReportReason, ReportStatus, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const moderationRouter = router({
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
  getUserById: protectedProcedure([Role.ADMIN])
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirstOrThrow({
        where: { id: input },
      });
    }),
  getPostById: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findFirstOrThrow({
        where: { id: input },
      });
    }),
  getUser: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: input.userId,
        },
        include: {
          attribute: true,
          reports: true,
        },
      });
    }),
  getPosts: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: { createdById: input.userId },
      });
      if (!posts) throw new TRPCError({ code: "NOT_FOUND" });
      return posts;
    }),
  getPost: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findUniqueOrThrow({
        where: { id: input.postId },
        include: { attribute: true, reports: true },
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
  getIsBan: protectedProcedure([Role.ADMIN, Role.MODERATOR])
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
              until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
              comment: input.comment,
            },
          });
      }
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
  deleteUserImage: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { image: null },
      });
    }),
  deletePostImage: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ postId: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.prisma.image.findFirst({
        where: { id: input.id, postId: input.postId },
      });
      if (!image) throw new TRPCError({ code: "NOT_FOUND" });

      const deleted = await ctx.prisma.image.delete({
        where: { id: image.id },
      });
      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: `${ctx.auth.userId}/images/${image.id}.${image.ext}`,
      };
      const command = new DeleteObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
  documentValidation: protectedProcedure([Role.ADMIN, Role.MODERATOR])
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
  getMatch: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ id: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input ? input.id : ctx.auth.userId },
        select: { role: true, id: true },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role === Role.AGENCY || user.role === Role.OWNER) {
        const postIds = await ctx.prisma.post.findMany({
          where: { createdById: user.id },
          select: { id: true },
        });
        if (!postIds) throw new TRPCError({ code: "NOT_FOUND" });

        const rs = await ctx.prisma.relationship.findMany({
          where: {
            isMatch: true,
            postId: {
              in: postIds.map((postObj) => {
                return postObj.id;
              }),
            },
          },
          include: {
            post: {
              include: {
                createdBy: true,
              },
            },
            user: true,
            conversation: {
              include: { messages: true },
            },
          },
        });
        if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

        return rs;
      }
      const rs = await ctx.prisma.relationship.findMany({
        where: {
          isMatch: true,
          userId: user.id,
        },
        include: {
          post: {
            include: {
              createdBy: true,
            },
          },
          user: true,
          conversation: {
            include: { messages: true },
          },
        },
      });
      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });
      return rs;
    }),
  getMessages: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(
      z.object({
        conversationId: z.string(),
        cursor: z.string().optional(),
        take: z.number().default(40),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.relationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const relationship = await ctx.prisma.relationship.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.role == Role.OWNER || ctx.role == Role.AGENCY) {
        const post = await ctx.prisma.post.findUnique({
          where: { id: relationship.postId },
        });
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        if (post.createdById != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (ctx.role == Role.TENANT) {
        if (relationship.userId != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      const messages = await ctx.prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "asc" },
        take: input.take,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { sender: true },
      });

      return messages;
    }),
  sendMessage: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ conversationId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      if (!conversation.relationId)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const relationship = await ctx.prisma.relationship.findUnique({
        where: { id: conversation.relationId },
      });
      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.role == Role.OWNER || ctx.role == Role.AGENCY) {
        const post = await ctx.prisma.post.findUnique({
          where: { id: relationship.postId },
        });
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        if (post.createdById != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (ctx.role == Role.TENANT) {
        if (relationship.userId != ctx.auth.userId)
          throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.prisma.message.create({
        data: {
          content: input.content,
          conversationId: conversation.id,
          senderId: ctx.auth.userId,
        },
      });
    }),
});
