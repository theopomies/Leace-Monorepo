import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const postModeration = router({
  getPostById: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findFirstOrThrow({
        where: { id: input },
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
  getUncertifiedPosts: protectedProcedure([Role.ADMIN, Role.MODERATOR]).query(
    ({ ctx }) => {
      return ctx.prisma.post.findFirst({
        orderBy: { createdAt: "asc" },
        where: { certified: false },
      });
    },
  ),
  certifyPost: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ postId: z.string(), certify: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: { id: input.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.post.update({
        where: { id: post.id },
        data: { certified: input.certify },
      });
    }),
});
