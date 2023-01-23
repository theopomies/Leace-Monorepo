import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { PostType, Roles } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
  createPost: protectedProcedure([Roles.AGENCY, Roles.OWNER])
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
  deletePost: protectedProcedure([Roles.AGENCY, Roles.OWNER])
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
  getAllPost: protectedProcedure().query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  getPost: protectedProcedure([Roles.TENANT])
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findUniqueOrThrow({ where: { id: input } });
    }),
  getMyPost: protectedProcedure([Roles.AGENCY, Roles.OWNER])
    .input(z.enum([PostType.RENTED, PostType.TO_BE_RENTED]).optional())
    .query(({ ctx, input }) => {
      if (!input) {
        return ctx.prisma.post.findMany({
          where: { createdById: ctx.session.user.id },
        });
      }
      return ctx.prisma.post.findMany({
        where: { createdById: ctx.session.user.id, type: input },
      });
    }),
});
