import { Document, Role } from "@prisma/client";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

export const documentRouter = router({
  putSignedUserUrl: protectedProcedure([
    Role.TENANT,
    Role.AGENCY,
    Role.OWNER,
    Role.ADMIN,
    Role.MODERATOR,
  ])
    .input(z.object({ fileType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();

      const ext = input.fileType.split("/")[1];
      if (!ext || (ext != "png" && ext != "jpeg" && ext != "pdf"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      const created = await ctx.prisma.document.create({
        data: { id: id, userId: ctx.auth.userId, ext: ext },
      });
      if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const key = `${ctx.auth.userId}/documents/${id}.${ext}`;
      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: key,
      };
      const command = new PutObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
  getSignedUserUrl: protectedProcedure([
    Role.TENANT,
    Role.AGENCY,
    Role.OWNER,
    Role.ADMIN,
    Role.MODERATOR,
  ])
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      const userId = input ? input : ctx.auth.userId;

      const documents = await ctx.prisma.document.findMany({
        where: {
          userId: userId,
        },
      });
      if (!documents) throw new TRPCError({ code: "NOT_FOUND" });

      return await Promise.all(
        documents.map(async (document: Document) => {
          const bucketParams = {
            Bucket: "leaceawsbucket",
            Key: `${userId}/document/${document.id}.${document.ext}`,
          };
          const command = new GetObjectCommand(bucketParams);

          return {
            ...document,
            url: await getSignedUrl(ctx.s3Client, command),
          };
        }),
      );
    }),
  deleteSignedUserUrl: protectedProcedure([
    Role.TENANT,
    Role.AGENCY,
    Role.OWNER,
    Role.ADMIN,
    Role.MODERATOR,
  ])
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findFirst({
        where: { id: input, userId: ctx.auth.userId },
      });
      if (!document) throw new TRPCError({ code: "NOT_FOUND" });

      const deleted = await ctx.prisma.document.delete({
        where: { id: document.id },
      });
      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: `${ctx.auth.userId}/documents/${document.id}.${document.ext}`,
      };
      const command = new DeleteObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),

  putSignedPostUrl: protectedProcedure([
    Role.TENANT,
    Role.AGENCY,
    Role.OWNER,
    Role.ADMIN,
    Role.MODERATOR,
  ])
    .input(z.object({ postId: z.string(), fileType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();

      const ext = input.fileType.split("/")[1];
      if (!ext || (ext != "png" && ext != "jpeg" && ext != "pdf"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      const getPost = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });

      const created = await ctx.prisma.document.create({
        data: { id: id, postId: input.postId, ext: ext },
      });
      if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const key = `${getPost.id}/documents/${id}.${ext}`;
      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: key,
      };
      const command = new PutObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
  getSignedPostUrl: protectedProcedure([
    Role.TENANT,
    Role.AGENCY,
    Role.OWNER,
    Role.ADMIN,
    Role.MODERATOR,
  ])
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const getPost = await ctx.prisma.post.findUnique({
        where: { id: input },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });

      const documents = await ctx.prisma.document.findMany({
        where: {
          postId: getPost.id,
        },
      });
      if (!documents) throw new TRPCError({ code: "NOT_FOUND" });

      return await Promise.all(
        documents.map(async (document: Document) => {
          const bucketParams = {
            Bucket: "leaceawsbucket",
            Key: `${getPost.id}/documents/${document.id}.${document.ext}`,
          };
          const command = new GetObjectCommand(bucketParams);
          return {
            ...document,
            url: await getSignedUrl(ctx.s3Client, command),
          };
        }),
      );
    }),
  deleteSignedPostUrl: protectedProcedure([
    Role.TENANT,
    Role.AGENCY,
    Role.OWNER,
    Role.ADMIN,
    Role.MODERATOR,
  ])
    .input(z.object({ postId: z.string(), documentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findFirst({
        where: { id: input.documentId, postId: input.postId },
      });
      if (!document || !document.postId)
        throw new TRPCError({ code: "NOT_FOUND" });

      const getPost = await ctx.prisma.post.findFirst({
        where: { id: document.postId, createdById: ctx.auth.userId },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });

      const deleted = await ctx.prisma.document.delete({
        where: { id: document.id },
      });
      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: `${ctx.auth.userId}/documents/${document.id}.${document.ext}`,
      };
      const command = new DeleteObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
});
