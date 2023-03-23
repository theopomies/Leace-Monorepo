import { router, protectedProcedure, isAuthedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Roles, UserStatus } from "@prisma/client";
import { isPossiblePhoneNumber } from "libphonenumber-js";

export const userRouter = router({
  updateUserRole: isAuthedProcedure
    .input(z.enum([Roles.TENANT, Roles.OWNER, Roles.AGENCY]))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.auth.userId },
      });
      if (!user) {
        const user = await ctx.clerkClient.users.getUser(ctx.auth.userId);
        const newAccount = await ctx.prisma.user.create({
          data: {
            id: ctx.auth.userId,
            image: user.profileImageUrl,
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.primaryPhoneNumberId,
            role: input,
          },
        });
        if (!newAccount) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const att = await ctx.prisma.attribute.findUnique({
        where: { userId: ctx.auth.userId },
      });
      if (!att) {
        const attCreate = await ctx.prisma.attribute.create({
          data: {
            userId: ctx.auth.userId,
          },
        });
        if (!attCreate) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return ctx.prisma.user.update({
        where: { id: ctx.auth.userId },
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
        birthDate: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const getUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.auth.userId },
      });

      if (!getUser) throw new TRPCError({ code: "NOT_FOUND" });

      if (getUser.id !== ctx.auth.userId)
        throw new TRPCError({ code: "FORBIDDEN" });

      if (input.phoneNumber && !isPossiblePhoneNumber(input.phoneNumber, "FR"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      if (input.birthDate) {
        const birthDate = new Date(input.birthDate);
        const diff_ms = Date.now() - birthDate.getTime();
        const age_dt = new Date(diff_ms);
        const age = Math.abs(age_dt.getUTCFullYear() - 1970);
        if (age < 18) throw new TRPCError({ code: "BAD_REQUEST" });
        return ctx.prisma.user.update({
          where: { id: ctx.auth.userId },
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNumber: input.phoneNumber,
            description: input.description,
            birthDate: birthDate,
            status: UserStatus.ACTIVE,
          },
        });
      }

      return ctx.prisma.user.update({
        where: { id: ctx.auth.userId },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          description: input.description,
        },
      });
    }),
  getUser: protectedProcedure([
    Roles.TENANT,
    Roles.AGENCY,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.MODERATOR,
  ])
    .input(z.string().optional())
    .query(({ ctx, input }) => {
      if (!input) {
        return ctx.prisma.user.findUniqueOrThrow({
          where: { id: ctx.auth.userId },
          include: {
            attribute: true,
          },
        });
      }
      return ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: input,
        },
        include: {
          attribute: true,
        },
      });
    }),
  deleteUser: protectedProcedure([
    Roles.TENANT,
    Roles.AGENCY,
    Roles.OWNER,
  ]).mutation(({ ctx }) => {
    return ctx.prisma.user.delete({ where: { id: ctx.auth.userId } });
  }),
});
