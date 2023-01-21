import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { PostType, Roles } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
  create: protectedProcedure([Roles.AGENCY, Roles.OWNER])
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        desc: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          createdById: ctx.session.user.id,
          title: input.title,
          content: input.content,
          desc: input.desc,
          type: PostType.TO_BE_RENTED,
        },
      });
    }),
  updatePost: protectedProcedure([Roles.AGENCY, Roles.OWNER])
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        desc: z.string().optional(),
        type: z.enum([PostType.RENTED, PostType.TO_BE_RENTED]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const getPost = await ctx.prisma.post.findUnique({
        where: { id: input.id },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });
      if (getPost.createdById !== ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.prisma.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          desc: input.desc,
          type: input.type,
        },
      });
    }),
  all: protectedProcedure().query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  byId: protectedProcedure()
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findFirst({ where: { id: input } });
    }),
  deleteById: protectedProcedure([Roles.AGENCY, Roles.OWNER])
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const getPost = await ctx.prisma.post.findUnique({
        where: { id: input },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });
      if (getPost.createdById !== ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.prisma.post.delete({ where: { id: input } });
    }),
  activePostsByOwner: protectedProcedure()
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const getPosts = await ctx.prisma.post.findMany({
        where: { createdById: input, type: PostType.TO_BE_RENTED },
      });
      if (!getPosts) throw new TRPCError({ code: "NOT_FOUND" });
      return getPosts;
    }),
  inactivePostsByOwner: protectedProcedure()
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const getPosts = await ctx.prisma.post.findMany({
        where: { createdById: input, type: PostType.RENTED },
      });
      if (!getPosts) throw new TRPCError({ code: "NOT_FOUND" });
      return getPosts;
    }),
});
