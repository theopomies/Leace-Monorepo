import { Document, Image, Roles } from "@prisma/client";
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
  PutSignedUserUrl: protectedProcedure([
    Roles.TENANT,
    Roles.OWNER,
    Roles.AGENCY,
  ])
    .input(z.object({ fileType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();

      const ext = input.fileType.split("/")[1];
      if (!ext || (ext != "png" && ext != "jpeg" && ext != "pdf"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      const created = await ctx.prisma.document.create({
        data: { id: id, userId: ctx.session.user.id, ext: ext },
      });
      if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const key = `${ctx.session.user.id}/documents/${id}.${ext}`;
      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: key,
      };
      const command = new PutObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
  GetSignedUserUrl: protectedProcedure([
    Roles.TENANT,
    Roles.OWNER,
    Roles.AGENCY,
  ])
    .input(z.string().optional())
    .mutation(async ({ ctx, input }) => {
      const userId = input ? input : ctx.session.user.id;

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

          return await getSignedUrl(ctx.s3Client, command);
        }),
      );
    }),
  DeleteSignedUserUrl: protectedProcedure([
    Roles.TENANT,
    Roles.OWNER,
    Roles.AGENCY,
  ])
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findFirst({
        where: { id: input, userId: ctx.session.user.id },
      });
      if (!document) throw new TRPCError({ code: "NOT_FOUND" });

      const deleted = await ctx.prisma.document.delete({
        where: { id: document.id },
      });
      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: `${ctx.session.user.id}/documents/${document.id}.${document.ext}`,
      };
      const command = new DeleteObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),

  PutSignedPostUrl: protectedProcedure([Roles.OWNER, Roles.AGENCY])
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
  GetSignedPostUrl: protectedProcedure([
    Roles.TENANT,
    Roles.OWNER,
    Roles.AGENCY,
  ])
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
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
        documents.map(async (document: Image) => {
          const bucketParams = {
            Bucket: "leaceawsbucket",
            Key: `${getPost.id}/documents/${document.id}.${document.ext}`,
          };
          const command = new GetObjectCommand(bucketParams);
          return await getSignedUrl(ctx.s3Client, command);
        }),
      );
    }),
  DeleteSignedPostUrl: protectedProcedure([Roles.OWNER, Roles.AGENCY])
    .input(z.object({ postId: z.string(), documentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findFirst({
        where: { id: input.documentId, postId: input.postId },
      });
      if (!document || !document.postId)
        throw new TRPCError({ code: "NOT_FOUND" });

      const getPost = await ctx.prisma.post.findFirst({
        where: { id: document.postId, createdById: ctx.session.user.id },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });

      const deleted = await ctx.prisma.document.delete({
        where: { id: document.id },
      });
      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: `${ctx.session.user.id}/documents/${document.id}.${document.ext}`,
      };
      const command = new DeleteObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
});
