import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { Role, Document } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const documentModeration = router({
  getSignedAssetUrl: protectedProcedure([Role.TENANT, Role.AGENCY, Role.OWNER])
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const bucketParams = {
        Bucket: "leaceawsbucket",
        Key: `assets/${input.name}`,
      };
      const command = new GetObjectCommand(bucketParams);

      return await getSignedUrl(ctx.s3Client, command);
    }),
  getSignedUserUrl: protectedProcedure([Role.ADMIN, Role.MODERATOR])
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
  getSignedPostUrl: protectedProcedure([Role.ADMIN, Role.MODERATOR])
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
