import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { PostType } from "@prisma/client";

export const postRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({ where: { id: input } });
  }),
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        desc: z.string(),
        type: z.enum([PostType.RENTED, PostType.WAITING_FOR_RENT]),
        price: z.number(),
        duration: z.date(),
        size: z.number(),
        furnished: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({ data: input });
    }),
});
