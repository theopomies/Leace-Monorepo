import { z } from "zod";
import { AuthenticatedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Role } from "@prisma/client";
import { OnboardingStatus } from "../utils/types";

export const onboardingRouter = router({
  getUserOnboardingStatus: AuthenticatedProcedure.input(
    z.object({
      userId: z.string(),
    }),
  ).query(async ({ input, ctx }) => {
    const userId = input.userId;

    if (
      userId !== ctx.auth.userId &&
      ctx.role !== Role.ADMIN &&
      ctx.role !== Role.MODERATOR
    ) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        attribute: true,
      },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    if (!user.role) {
      return OnboardingStatus.ROLE_SELECTION as OnboardingStatus;
    }

    return OnboardingStatus.IDENTITY_COMPLETION as OnboardingStatus;
  }),
});
