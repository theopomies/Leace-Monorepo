import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Roles, UserStatus } from "@prisma/client";
import { isPossiblePhoneNumber } from "libphonenumber-js";

export const userRouter = router({
  updateUserRole: protectedProcedure([Roles.NONE])
    .input(z.enum([Roles.TENANT, Roles.OWNER, Roles.AGENCY]))
    .mutation(async ({ ctx, input }) => {
      const att = await ctx.prisma.attribute.create({
        data: {
          userId: ctx.session.user.id,
        },
      });
      if (!att) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { role: input },
      });
    }),
  updateUser: protectedProcedure([Roles.TENANT, Roles.AGENCY, Roles.OWNER])
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional(),
        description: z.string().optional(),
        birthDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const getUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
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
          where: { id: ctx.session.user.id },
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
        where: { id: ctx.session.user.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          description: input.description,
        },
      });
    }),
  getUser: protectedProcedure([Roles.TENANT, Roles.AGENCY, Roles.OWNER])
    .input(z.string().optional())
    .query(({ ctx, input }) => {
      if (!input) {
        return ctx.prisma.user.findUniqueOrThrow({
          where: { id: ctx.session.user.id },
        });
      }
      return ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: input,
        },
      });
    }),
  deleteUser: protectedProcedure([
    Roles.TENANT,
    Roles.AGENCY,
    Roles.OWNER,
  ]).mutation(({ ctx }) => {
    return ctx.prisma.user.delete({ where: { id: ctx.session.user.id } });
  }),
});
