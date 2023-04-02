import { router, protectedProcedure, AuthenticatedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Role, UserStatus } from "@prisma/client";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import { getId } from "../utils/getId";

export const userRouter = router({
  /** Create a new user only for yourself,
      Invalid if:
        - You have followed a ambiguous signUp/signIn flow.
        - Your user doesn't exist on clerk authentication database.
  */
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
  }),
  /** Update one user's data with the given id
      Also check for:
        - a valid phone number
        - a valid birthdate
      An account turn active after the first update.
  */
  updateUserById: protectedProcedure([Role.TENANT, Role.OWNER, Role.AGENCY])
    .input(
      z.object({
        userId: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional(),
        description: z.string().optional(),
        birthDate: z.string().optional(),
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
        const birthDate = new Date(input.birthDate);
        const diff_ms = Date.now() - birthDate.getTime();
        const age_dt = new Date(diff_ms);
        const age = Math.abs(age_dt.getUTCFullYear() - 1970);
        if (age < 18) throw new TRPCError({ code: "BAD_REQUEST" });
        const updated = await ctx.prisma.user.update({
          where: { id: userId },
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNumber: input.phoneNumber,
            description: input.description,
            birthDate,
            status: UserStatus.ACTIVE,
          },
        });
        if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const updated = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          description: input.description,
        },
      });

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
  /**  Retrieve one user's data with the given id, based on your authorizations. */
  getUserById: protectedProcedure([Role.TENANT, Role.OWNER, Role.AGENCY])
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          attribute: true,
        },
      });

      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return user;
    }),
  /** Delete one user with the given id. */
  deleteUserById: protectedProcedure([Role.TENANT, Role.OWNER, Role.AGENCY])
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = getId({ ctx: ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const deleted = await ctx.prisma.user.delete({
        where: { id: userId },
      });

      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
});
