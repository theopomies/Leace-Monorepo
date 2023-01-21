import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { PostType, Roles } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
  create: protectedProcedure([
    Roles.AGENCY,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.MODERATOR,
  ])
    .input(
      z.object({
        createdById: z.string(),
        title: z.string(),
        content: z.string(),
        desc: z.string(),
        type: z.enum([PostType.RENTED, PostType.TO_BE_RENTED]),
        price: z.number(),
        duration: z.date(),
        size: z.number(),
        furnished: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({ data: input });
    }),
  updatePost: protectedProcedure([
    Roles.AGENCY,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.MODERATOR,
  ])
    .input(
      z.object({
        id: z.string(),
        createdBy: z.string(),
        title: z.string(),
        content: z.string(),
        desc: z.string(),
        type: z.enum([PostType.RENTED, PostType.TO_BE_RENTED]),
        price: z.number(),
        duration: z.date(),
        size: z.number(),
        furnished: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const getPost = await ctx.prisma.post.findUnique({
        where: { id: input.id },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });
      if (
        getPost.createdById !== ctx.session.user.id &&
        ctx.session.user.role !== Roles.ADMIN
      )
        throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.prisma.post.delete({ where: { id: input.id } });
    }),
  all: protectedProcedure().query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  byId: protectedProcedure()
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findFirst({ where: { id: input } });
    }),
  deleteById: protectedProcedure([
    Roles.AGENCY,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.MODERATOR,
  ])
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const getPost = await ctx.prisma.post.findUnique({
        where: { id: input },
      });
      if (!getPost) throw new TRPCError({ code: "NOT_FOUND" });
      if (
        getPost.createdById !== ctx.session.user.id ||
        ctx.session.user.role !== Roles.ADMIN
      )
        throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.prisma.post.delete({ where: { id: input } });
    }),
  activePostsByUser: protectedProcedure()
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const getPosts = await ctx.prisma.post.findMany({
        where: { createdById: input, type: PostType.TO_BE_RENTED },
      });
      if (!getPosts) throw new TRPCError({ code: "NOT_FOUND" });
      return getPosts;
    }),
  inactivePostsByUser: protectedProcedure()
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const getPosts = await ctx.prisma.post.findMany({
        where: { createdById: input, type: PostType.RENTED },
      });
      if (!getPosts) throw new TRPCError({ code: "NOT_FOUND" });
      return getPosts;
    }),
});
