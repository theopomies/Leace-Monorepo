import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { PostType, Roles } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
  create: protectedProcedure([Roles.USER, Roles.ADMIN, Roles.MODERATOR])
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
  all: protectedProcedure([Roles.USER, Roles.ADMIN, Roles.MODERATOR]).query(
    ({ ctx }) => {
      return ctx.prisma.post.findMany();
    },
  ),
  byId: protectedProcedure([Roles.USER, Roles.ADMIN, Roles.MODERATOR])
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findFirst({ where: { id: input } });
    }),
  deleteById: protectedProcedure([Roles.USER, Roles.ADMIN, Roles.MODERATOR])
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
});
