import { Image, Role } from "@prisma/client";
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
import { getId } from "../utils/getId";

export const imageRouter = router({
  putSignedUrl: protectedProcedure([Role.TENANT, Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        userId: z.string().optional(),
        postId: z.string().optional(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();

      const ext = input.fileType.split("/")[1];
      if (!ext || (ext != "png" && ext != "jpeg"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      if (input.userId) {
        const userId = getId({ ctx: ctx, userId: input.userId });

        const user = await ctx.prisma.user.findUnique({
          where: { id: userId },
        });
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const key = `users/${userId}/image/profilePicture.${ext}`;
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

        const created = await ctx.prisma.image.create({
          data: { id: id, postId: input.postId, ext: ext },
        });
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const key = `posts/${getPost.id}/images/${id}.${ext}`;
        const bucketParams = {
          Bucket: "leaceawsbucket",
          Key: key,
        };
        const command = new PutObjectCommand(bucketParams);

        return await getSignedUrl(ctx.s3Client, command);
      }
    }),
  getSignedPostUrl: protectedProcedure([
    Role.TENANT,
    Role.AGENCY,
    Role.OWNER,
    Role.ADMIN,
    Role.MODERATOR,
  ])
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const getPost = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });

      const images = await ctx.prisma.image.findMany({
        where: { postId: getPost.id },
      });
      if (!images) return null;

      return await Promise.all(
        images.map(async (image: Image) => {
          const bucketParams = {
            Bucket: "leaceawsbucket",
            Key: `posts/${getPost.id}/images/${image.id}.${image.ext}`,
          };
          const command = new GetObjectCommand(bucketParams);
          const url = await getSignedUrl(ctx.s3Client, command);
          return { ...image, url };
        }),
      );
    }),
  getSignedUserUrl: protectedProcedure([Role.TENANT, Role.AGENCY, Role.OWNER])
    .input(z.object({ userId: z.string(), fileType: z.string() }))
    .query(async ({ ctx, input }) => {
      const getUser = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });
      if (!getUser) throw new TRPCError({ code: "NOT_FOUND" });

      const ext = input.fileType.split("/")[1];
      if (!ext || (ext != "png" && ext != "jpeg"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: `users/${input.userId}/image/profilePicture.${ext}`,
      };
      const command = new GetObjectCommand(bucketParams);
      return await getSignedUrl(ctx.s3Client, command);
    }),
  deleteSignedPostUrl: protectedProcedure([
    Role.TENANT,
    Role.AGENCY,
    Role.OWNER,
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
        Key: `posts/${getPost.id}/images/${image.id}.${image.ext}`,
      };
      const command = new DeleteObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
});
