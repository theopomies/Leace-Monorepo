import { router, protectedProcedure } from "../trpc";
import { date, z } from "zod";
import { TRPCError } from "@trpc/server";
import { Roles } from "@prisma/client";
import { isPossiblePhoneNumber } from "libphonenumber-js";

export const userRouter = router({
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        phoneNumber: z.string(),
        description: z.string(),
        birthDate: z.date(),
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
      if (!isPossiblePhoneNumber(input.phoneNumber, "FR"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      const diff_ms = Date.now() - input.birthDate.getTime();
      const age_dt = new Date(diff_ms);
      const age = Math.abs(age_dt.getUTCFullYear() - 1970);
      if (age < 18 || age > 125) throw new TRPCError({ code: "BAD_REQUEST" });

      return ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          description: input.description,
          birthDate: input.birthDate,
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
