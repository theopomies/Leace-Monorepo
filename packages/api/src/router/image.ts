import { Image, Roles } from "@prisma/client";
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

export const imageRouter = router({
  PutSignedUserUrl: protectedProcedure()
    .input(z.object({ fileType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();

      const ext = input.fileType.split("/")[1];
      if (!ext || (ext != "png" && ext != "jpeg"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      const created = await ctx.prisma.image.create({
        data: { id: id, userId: ctx.auth.userId, ext: ext },
      });
      if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const key = `${ctx.auth.userId}/images/${id}.${ext}`;
      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: key,
      };
      const command = new PutObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
  GetSignedUserUrl: protectedProcedure()
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      const userId = input ? input : ctx.auth.userId;

      const images = await ctx.prisma.image.findMany({
        where: {
          userId: userId,
        },
      });
      if (!images) throw new TRPCError({ code: "NOT_FOUND" });

      return await Promise.all(
        images.map(async (image: Image) => {
          const bucketParams = {
            Bucket: "leaceawsbucket",
            Key: `${userId}/images/${image.id}.${image.ext}`,
          };
          const command = new GetObjectCommand(bucketParams);

          return { ...image, url: await getSignedUrl(ctx.s3Client, command) };
        }),
      );
    }),
  DeleteSignedUserUrl: protectedProcedure()
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.prisma.image.findFirst({
        where: { id: input, userId: ctx.auth.userId },
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

  PutSignedPostUrl: protectedProcedure([
    Roles.OWNER,
    Roles.AGENCY,
    Roles.MODERATOR,
    Roles.ADMIN,
  ])
    .input(z.object({ postId: z.string(), fileType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();

      const ext = input.fileType.split("/")[1];
      if (!ext || (ext != "png" && ext != "jpeg"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      const getPost = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });

      const created = await ctx.prisma.image.create({
        data: { id: id, postId: input.postId, ext: ext },
      });
      if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const key = `${getPost.id}/images/${id}.${ext}`;
      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: key,
      };
      const command = new PutObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
  GetSignedPostUrl: protectedProcedure()
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const getPost = await ctx.prisma.post.findUnique({
        where: { id: input },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });

      const images = await ctx.prisma.image.findMany({
        where: {
          postId: getPost.id,
        },
      });
      if (!images) throw new TRPCError({ code: "NOT_FOUND" });

      return await Promise.all(
        images.map(async (image: Image) => {
          const bucketParams = {
            Bucket: "leaceawsbucket",
            Key: `${getPost.id}/images/${image.id}.${image.ext}`,
          };
          const command = new GetObjectCommand(bucketParams);
          return { ...image, url: await getSignedUrl(ctx.s3Client, command) };
        }),
      );
    }),
  DeleteSignedPostUrl: protectedProcedure([
    Roles.OWNER,
    Roles.AGENCY,
    Roles.MODERATOR,
    Roles.ADMIN,
  ])
    .input(z.object({ postId: z.string(), imageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.prisma.image.findFirst({
        where: { id: input.imageId, postId: input.postId },
      });
      if (!image || !image.postId) throw new TRPCError({ code: "NOT_FOUND" });

      const getPost = await ctx.prisma.post.findFirst({
        where: { id: image.postId, createdById: ctx.auth.userId },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });

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
});
