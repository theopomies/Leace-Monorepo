import { DocType } from "@prisma/client";

export const OnboardingStatus = {
  ROLE_SELECTION: "ROLE_SELECTION",
  IDENTITY_COMPLETION: "IDENTITY_COMPLETION",
  PREFERENCES_COMPLETION: "PREFERENCES_COMPLETION",
  DOCUMENTS_COMPLETION: "DOCUMENTS_COMPLETION",
  COMPLETE: "COMPLETE",
} as const;

export type OnboardingStatus =
  (typeof OnboardingStatus)[keyof typeof OnboardingStatus];

export const documentTypes = {
  IDENTITY: "IDENTITY",
  RESIDENCE: "RESIDENCE",
  PROFESSIONAL: "PROFESSIONAL",
  ADMINISTRATIVE: "ADMINISTRATIVE",
  FINANCIAL: "FINANCIAL",
} as const;

export type DocumentType = (typeof documentTypes)[keyof typeof documentTypes];

export function getDocumentsOfType(documentType: DocumentType) {
  switch (documentType) {
    case documentTypes.IDENTITY:
      return identityDocumentTypes;
    case documentTypes.RESIDENCE:
      return residenceDocumentTypes;
    case documentTypes.PROFESSIONAL:
      return professionalDocumentTypes;
    case documentTypes.ADMINISTRATIVE:
      return administrativeDocumentTypes;
    case documentTypes.FINANCIAL:
      return financialDocumentTypes;
  }
}

export const identityDocumentTypes = [
  DocType.IDENTITY_CARD,
  DocType.PASSPORT,
  DocType.DRIVER_LICENSE,
  DocType.RESIDENCE_PERMIT,
] as const;

export const residenceDocumentTypes = [
  DocType.RENT_RECEIPT,
  DocType.SWORN_STATEMENT,
  DocType.DOMICILE_ACCEPTANCE,
  DocType.TAX_ASSESSMENT,
] as const;

export const professionalDocumentTypes = [
  DocType.EMPLOYMENT_CONTRACT,
  DocType.STUDENT_CARD,
  DocType.BUSINESS_CARD,
  DocType.INSEE_CERTIFICATE,
] as const;

export const administrativeDocumentTypes = [
  DocType.D1_EXTRAIT,
  DocType.K_EXTRAIT,
  DocType.OTHERS,
] as const;

export const financialDocumentTypes = [
  DocType.SALARY_PROOF,
  DocType.COMPENSATION,
  DocType.ACCOUNTING_BALANCE,
  DocType.PROPERTY_TITLE,
  DocType.SCHOLARSHIP,
  DocType.FINANCIAL_CONTRIBUTION,
  DocType.TAX_NOTICES,
] as const;
