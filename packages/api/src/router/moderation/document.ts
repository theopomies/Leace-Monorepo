import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { Role, Document } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export const documentModeration = router({
  putSignedUrl: protectedProcedure([Role.ADMIN])
    .input(
      z.object({
        userId: z.string().optional(),
        postId: z.string().optional(),
        leaseId: z.string().optional(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();

      const ext = input.fileType.split("/")[1];
      if (!ext || (ext != "png" && ext != "jpeg" && ext != "pdf"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      if (input.userId) {
        const getUser = await ctx.prisma.user.findUnique({
          where: { id: input.userId },
        });
        if (!getUser) throw new TRPCError({ code: "NOT_FOUND" });

        const created = await ctx.prisma.document.create({
          data: { id: id, userId: getUser.id, ext: ext },
        });
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const key = `users/${getUser.id}/documents/${id}.${ext}`;
        const bucketParams = {
          Bucket: "leaceawsbucket",
          Key: key,
          ContentType: input.fileType,
        };
        const command = new PutObjectCommand(bucketParams);

        return await getSignedUrl(ctx.s3Client, command);
      } else if (input.postId) {
        const getPost = await ctx.prisma.post.findUnique({
          where: { id: input.postId },
        });
        if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });

        const created = await ctx.prisma.document.create({
          data: { id: id, postId: getPost.id, ext: ext },
        });
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const key = `posts/${getPost.id}/documents/${id}.${ext}`;
        const bucketParams = {
          Bucket: "leaceawsbucket",
          Key: key,
          ContentType: input.fileType,
        };
        const command = new PutObjectCommand(bucketParams);
        return await getSignedUrl(ctx.s3Client, command);
      } else if (input.leaseId) {
        const getLease = await ctx.prisma.lease.findUnique({
          where: { id: input.leaseId },
        });
        if (!getLease) throw new TRPCError({ code: "NOT_FOUND" });
        const created = await ctx.prisma.document.create({
          data: { id: id, leaseId: getLease.id, ext: ext },
        });
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const key = `leases/${getLease.id}/documents/${id}.${ext}`;
        const bucketParams = {
          Bucket: "leaceawsbucket",
          Key: key,
        };
        const command = new PutObjectCommand(bucketParams);
        return await getSignedUrl(ctx.s3Client, command);
      }
    }),
  getSignedUrl: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(
      z.object({
        userId: z.string().optional(),
        postId: z.string().optional(),
        leaseId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.userId) {
        const documents = await ctx.prisma.document.findMany({
          where: { userId: input.userId },
        });
        if (!documents) throw new TRPCError({ code: "NOT_FOUND" });

        return await Promise.all(
          documents.map(async (document: Document) => {
            const bucketParams = {
              Bucket: "leaceawsbucket",
              Key: `users/${input.userId}/documents/${document.id}.${document.ext}`,
            };
            const command = new GetObjectCommand(bucketParams);
            return {
              ...document,
              url: await getSignedUrl(ctx.s3Client, command),
            };
          }),
        );
      } else if (input.postId) {
        const documents = await ctx.prisma.document.findMany({
          where: { postId: input.postId },
        });
        if (!documents) throw new TRPCError({ code: "NOT_FOUND" });

        return await Promise.all(
          documents.map(async (document: Document) => {
            const bucketParams = {
              Bucket: "leaceawsbucket",
              Key: `posts/${input.postId}/documents/${document.id}.${document.ext}`,
            };
            const command = new GetObjectCommand(bucketParams);
            return {
              ...document,
              url: await getSignedUrl(ctx.s3Client, command),
            };
          }),
        );
      } else if (input.leaseId) {
        const getLease = await ctx.prisma.lease.findUnique({
          where: { id: input.leaseId },
        });
        if (!getLease) throw new TRPCError({ code: "NOT_FOUND" });

        const documents = await ctx.prisma.document.findMany({
          where: {
            leaseId: getLease.id,
          },
        });
        if (!documents) throw new TRPCError({ code: "NOT_FOUND" });

        return await Promise.all(
          documents.map(async (document: Document) => {
            const bucketParams = {
              Bucket: "leaceawsbucket",
              Key: `leases/${getLease.id}/documents/${document.id}.${document.ext}`,
            };
            const command = new GetObjectCommand(bucketParams);
            return {
              ...document,
              url: await getSignedUrl(ctx.s3Client, command),
            };
          }),
        );
      }
    }),
  deleteSignedUrl: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(
      z.object({
        userId: z.string().optional(),
        postId: z.string().optional(),
        leaseId: z.string().optional(),
        documentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId) {
        const document = await ctx.prisma.document.findFirst({
          where: { id: input.documentId, userId: input.userId },
        });
        if (!document) throw new TRPCError({ code: "NOT_FOUND" });

        const deleted = await ctx.prisma.document.delete({
          where: { id: document.id },
        });
        if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const bucketParams = {
          Bucket: "leaceawsbucket",
          Key: `users/${input.userId}/documents/${document.id}.${document.ext}`,
        };
        const command = new DeleteObjectCommand(bucketParams);

        return await getSignedUrl(ctx.s3Client, command);
      } else if (input.postId) {
        const document = await ctx.prisma.document.findFirst({
          where: { id: input.documentId, postId: input.postId },
        });
        if (!document) throw new TRPCError({ code: "NOT_FOUND" });

        const deleted = await ctx.prisma.document.delete({
          where: { id: document.id },
        });
        if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const bucketParams = {
          Bucket: "leaceawsbucket",
          Key: `posts/${input.postId}/documents/${document.id}.${document.ext}`,
        };
        const command = new DeleteObjectCommand(bucketParams);

        return await getSignedUrl(ctx.s3Client, command);
      } else if (input.leaseId) {
        const document = await ctx.prisma.document.findFirst({
          where: { id: input.documentId, leaseId: input.leaseId },
        });
        if (!document) throw new TRPCError({ code: "NOT_FOUND" });

        const deleted = await ctx.prisma.document.delete({
          where: { id: document.id },
        });
        if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const bucketParams = {
          Bucket: "leaceawsbucket",
          Key: `leases/${input.leaseId}/documents/${document.id}.${document.ext}`,
        };
        const command = new DeleteObjectCommand(bucketParams);

        return await getSignedUrl(ctx.s3Client, command);
      }
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
});
