export const OnboardingStatus = {
  ROLE_SELECTION: "ROLE_SELECTION",
  IDENTITY_COMPLETION: "IDENTITY_COMPLETION",
  PREFERENCES_COMPLETION: "PREFERENCES_COMPLETION",
  COMPLETE: "COMPLETE",
} as const;

export type OnboardingStatus =
  (typeof OnboardingStatus)[keyof typeof OnboardingStatus];
