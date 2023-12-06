import { Context } from "../context";
import { DocType } from "@prisma/client";

export const identityDocumentTypes = [
  DocType.IDENTITY_CARD,
  DocType.PASSPORT,
  DocType.DRIVER_LICENSE,
  DocType.RESIDENCE_PERMIT,
];

export const residenceDocumentTypes = [
  DocType.RENT_RECEIPT,
  DocType.SWORN_STATEMENT,
  DocType.DOMICILE_ACCEPTANCE,
  DocType.TAX_ASSESSMENT,
];

export const professionalDocumentTypes = [
  DocType.EMPLOYMENT_CONTRACT,
  DocType.STUDENT_CARD,
  DocType.BUSINESS_CARD,
  DocType.INSEE_CERTIFICATE,
];

export const administrativeDocumentTypes = [
  DocType.D1_EXTRAIT,
  DocType.K_EXTRAIT,
  DocType.OTHERS,
];

export const financialDocumentTypes = [
  DocType.SALARY_PROOF,
  DocType.COMPENSATION,
  DocType.ACCOUNTING_BALANCE,
  DocType.PROPERTY_TITLE,
  DocType.SCHOLARSHIP,
  DocType.FINANCIAL_CONTRIBUTION,
  DocType.TAX_NOTICES,
];

export interface CertificationProps {
  ctx: Context;
  userId: string;
}

export const checkCertificationLevel = async ({
  ctx,
  userId,
}: CertificationProps) => {
  const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

  if (!user) return;

  if (!(await hasRequiredDocuments(ctx, user.id))) return;
  if (!user.email) return; //&& !user.emailVerified) return; // VERIFY YOUR EMAIL (implement mail verification in front)
  if (!user.image) return; // VERIFY YOUR FACE
  if (!user.firstName && !user.lastName && !user.birthDate) return; // UPDATE YOUR PERSONNAL INFORMATIONS
  //if (!user.phoneNumber) return; // VERIFY YOUR PHONE NUMBER (implement phonenumber in front)
  if (!user.country) return; // VERIFY YOUR LOCATION

  // IF ALL CONDITIONS ARE OK THEN CERTIFY THE USER
  return await ctx.prisma.user.update({
    where: { id: userId },
    data: { certified: true },
  });
};

async function hasRequiredDocuments(ctx: Context, userId: string) {
  const userDocuments = await ctx.prisma.document.findMany({
    where: { userId },
  });

  const existingDocumentTypes = new Set();

  for (const document of userDocuments) {
    existingDocumentTypes.add(document.type);
  }

  if (
    identityDocumentTypes.some((type) => existingDocumentTypes.has(type)) &&
    residenceDocumentTypes.some((type) => existingDocumentTypes.has(type)) &&
    professionalDocumentTypes.some((type) => existingDocumentTypes.has(type)) &&
    administrativeDocumentTypes.some((type) =>
      existingDocumentTypes.has(type),
    ) &&
    financialDocumentTypes.some((type) => existingDocumentTypes.has(type))
  ) {
    return true;
  } else {
    return false;
  }
}
