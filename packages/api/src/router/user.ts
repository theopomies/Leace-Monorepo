import {
  router,
  protectedProcedure,
  AuthenticatedProcedure,
  publicProcedure,
} from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Role, UserStatus, MaritalStatus } from "@prisma/client";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import { getId } from "../utils/getId";
import { filterStrings } from "../utils/filter";
import { checkCertificationLevel } from "../utils/certification";

export const userRouter = router({
  createUser: AuthenticatedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.userId },
    });

    if (user) {
      throw new TRPCError({ code: "FORBIDDEN", message: "User already exist" });
    }

    const clerkUser = await ctx.clerkClient.users.getUser(ctx.auth.userId);

    if (!clerkUser)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found in clerk database",
      });

    const newAccount = await ctx.prisma.user.create({
      data: {
        id: ctx.auth.userId,
        image: clerkUser.profileImageUrl,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        phoneNumber: clerkUser.primaryPhoneNumberId,
      },
    });

    if (!newAccount) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    ctx.mixPanel.track("Signed Up", {
      distinct_id: ctx.auth.userId,
      "Signup Type": "Referral",
    });
  }),
  /** Update a user role with the given id and role. */
  updateUserRoleById: AuthenticatedProcedure.input(
    z.object({
      userId: z.string(),
      role: z.enum([Role.TENANT, Role.OWNER, Role.AGENCY]),
    }),
  ).mutation(async ({ ctx, input }) => {
    const userId = getId({ ctx: ctx, userId: input.userId });

    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    const updated = await ctx.prisma.user.update({
      where: { id: userId },
      data: { role: input.role },
    });

    if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    ctx.mixPanel.track("Update Role", {
      distinct_id: ctx.auth.userId,
      Items: "Referral",
      role: input.role,
    });
  }),
  updateUserById: protectedProcedure([
    Role.TENANT,
    Role.OWNER,
    Role.AGENCY,
    Role.ADMIN,
  ])
    .input(
      z.object({
        userId: z.string(),
        image: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        country: z.string().optional(),
        phoneNumber: z.string().optional(),
        description: z.string().optional(),
        birthDate: z.date().optional(),
        job: z.string().optional(),
        employmentContract: z.string().optional(),
        income: z.number().optional(),
        creditScore: z.number().optional(),
        maritalStatus: z
          .enum([
            MaritalStatus.SINGLE,
            MaritalStatus.MARRIED,
            MaritalStatus.ONE_CHILD,
            MaritalStatus.TWO_CHILD,
            MaritalStatus.OTHER,
          ])
          .optional(),
        isPremium: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = getId({ ctx: ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (input.phoneNumber && !isPossiblePhoneNumber(input.phoneNumber, "FR"))
        throw new TRPCError({ code: "BAD_REQUEST" });

      if (input.birthDate) {
        const birthDate = input.birthDate;
        const diff_ms = Date.now() - birthDate.getTime();
        const age_dt = new Date(diff_ms);
        const age = Math.abs(age_dt.getUTCFullYear() - 1970);
        if (age < 18) throw new TRPCError({ code: "BAD_REQUEST" });
        const updated = await ctx.prisma.user.update({
          where: { id: userId },
          data: {
            image: input.image,
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNumber: input.phoneNumber,
            description: input.description,
            birthDate,
            isPremium: input.isPremium,
            status: UserStatus.ACTIVE,
            country: input.country,
          },
        });
        if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      if (
        input.creditScore &&
        (input.creditScore < 0 || input.creditScore > 1000)
      )
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "credit score must be between 0 and 1000",
        });

      const updated = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          image: input.image,
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          description: input.description,
          job: input.job,
          employmentContract: input.employmentContract,
          income: input.income ?? null,
          creditScore: input.creditScore ?? null,
          maritalStatus: input.maritalStatus,
          isPremium: input.isPremium,
        },
      });

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await checkCertificationLevel({ ctx, userId });

      filterStrings({
        ctx,
        userId,
        check: [
          input.firstName,
          input.lastName,
          input.phoneNumber,
          input.description,
          input.job,
          input.employmentContract,
        ],
      });
    }),
  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          attribute: true,
        },
      });

      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return user;
    }),
  /** Delete one user with the given id. */
  deleteUserById: protectedProcedure([
    Role.TENANT,
    Role.OWNER,
    Role.AGENCY,
    Role.ADMIN,
  ])
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = getId({ ctx: ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const deleted = await ctx.prisma.user.delete({
        where: { id: userId },
      });

      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      ctx.clerkClient.users.deleteUser(userId);
    }),
});
