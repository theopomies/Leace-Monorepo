import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { ConversationType, PostType, Roles } from "@prisma/client";
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
    .mutation(async ({ ctx, input }) => {
      const getPost = await ctx.prisma.post.create({
        data: {
          createdById: ctx.session.user.id,
          title: input.title,
          content: input.content,
          desc: input.desc,
          type: PostType.TO_BE_RENTED,
        },
      });
      if (!getPost) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const att = await ctx.prisma.attribute.create({
        data: {
          postId: getPost.id,
        },
      });
      if (!att) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return getPost;
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
    .mutation(async ({ input, ctx }) => {
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
  getPost: protectedProcedure([Roles.TENANT, Roles.AGENCY, Roles.OWNER])
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findUniqueOrThrow({
        where: { id: input },
        include: { attribute: true },
      });
    }),
  getMyPost: protectedProcedure([Roles.AGENCY, Roles.OWNER])
    .input(z.enum([PostType.RENTED, PostType.TO_BE_RENTED]).optional())
    .query(({ ctx, input }) => {
      if (!input) {
        return ctx.prisma.post.findMany({
          where: { createdById: ctx.session.user.id },
          include: { attribute: true },
        });
      }
      return ctx.prisma.post.findMany({
        where: { createdById: ctx.session.user.id, type: input },
        include: { attribute: true },
      });
    }),
  getRentIncome: protectedProcedure([Roles.AGENCY, Roles.OWNER]).query(
    async ({ ctx }) => {
      const posts = await ctx.prisma.post.findMany({
        where: { createdById: ctx.session.user.id, type: PostType.RENTED },
        include: { attribute: true },
      });
      if (!posts) throw new TRPCError({ code: "NOT_FOUND" });
      let total = 0;
      posts.map((post) => {
        if (post.attribute && post.attribute.price)
          total += post.attribute.price;
      });
      return total;
    },
  ),
  getRentExpense: protectedProcedure([Roles.TENANT]).query(async ({ ctx }) => {
    const rs = await ctx.prisma.relationship.findMany({
      where: {
        userId: ctx.session.user.id,
        isMatch: true,
        post: { type: PostType.RENTED },
        conversation: { type: ConversationType.DONE },
      },
      include: { post: { include: { attribute: true } } },
    });
    let total = 0;
    rs.map((rs) => {
      if (rs.post && rs.post.attribute && rs.post.attribute.price)
        total += rs.post.attribute.price;
    });
    return total;
  }),
});
