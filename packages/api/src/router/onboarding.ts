import { z } from "zod";
import { AuthenticatedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Role } from "@prisma/client";
import {
  OnboardingStatus,
  administrativeDocumentTypes,
  identityDocumentTypes,
} from "../utils/types";
import { Document } from "@prisma/client";

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
        documents: true,
      },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    if (!user.role) {
      return OnboardingStatus.ROLE_SELECTION as OnboardingStatus;
    }

    if (
      !user.image ||
      !user.firstName ||
      !user.lastName ||
      !user.birthDate ||
      !user.description
    ) {
      return OnboardingStatus.IDENTITY_COMPLETION as OnboardingStatus;
    }
    const hasDocuments = hasMinimumDocuments(user.documents, user.role);

    if (user.role !== Role.TENANT) {
      if (!hasDocuments) {
        return OnboardingStatus.DOCUMENTS_COMPLETION as OnboardingStatus;
      }
      return OnboardingStatus.COMPLETE as OnboardingStatus;
    }

    if (!user.attribute) {
      return OnboardingStatus.PREFERENCES_COMPLETION as OnboardingStatus;
    }

    if (!hasDocuments) {
      return OnboardingStatus.DOCUMENTS_COMPLETION as OnboardingStatus;
    }

    return OnboardingStatus.COMPLETE as OnboardingStatus;
  }),
});

function hasMinimumDocuments(documents: Document[], role?: Role): boolean {
  const hasIdentityDocument = identityDocumentTypes.some((type) =>
    documents.some((document) => document.type === type),
  );

  if (role === Role.TENANT || role === Role.OWNER) {
    return hasIdentityDocument;
  }
  if (role === Role.AGENCY) {
    return administrativeDocumentTypes.some((type) =>
      documents.some((document) => document.type === type),
    );
  }

  return true;
}
