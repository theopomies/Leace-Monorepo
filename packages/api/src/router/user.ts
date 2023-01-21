import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Roles, UserStatus } from "@prisma/client";
import { isPossiblePhoneNumber } from "libphonenumber-js";

export const userRouter = router({
  updateUser: protectedProcedure([
    Roles.TENANT,
    Roles.AGENCY,
    Roles.OWNER,
    Roles.NONE,
  ])
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional(),
        description: z.string().optional(),
        birthDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const getUser = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!getUser) throw new TRPCError({ code: "NOT_FOUND" });

      if (getUser.id !== ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      if (input.phoneNumber && !isPossiblePhoneNumber(input.phoneNumber, "FR"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      if (input.birthDate) {
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
            status: UserStatus.ACTIVE,
          },
        });
      }

      return ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          description: input.description,
        },
      });
    }),
  getById: protectedProcedure()
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          sessions: true,
          accounts: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          country: true,
          description: true,
          birthDate: true,
        },
      });
    }),
});
