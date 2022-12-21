import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Roles } from "@prisma/client";

export const userRouter = router({
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        phoneNumber: z.string(),
        description: z.string(),
        age: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const getUser = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
      if (!getUser) throw new TRPCError({ code: "NOT_FOUND" });
      if (
        getUser.id !== ctx.session.user.id &&
        ctx.session.user.role !== Roles.ADMIN
      )
        throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          description: input.description,
          age: input.age,
        },
      });
    }),
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: input,
      },
    });
  }),
});
