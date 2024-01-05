import { OnboardingStatus } from "@leace/api/src/utils/types";

/*export type Step =
  | "WELCOME"
  | "SELECT"
  | "PROFILE"
  | "ATTRIBUTES"
  | "DOCUMENTS";*/

export type Role = "TENANT" | "OWNER" | "AGENCY";

export interface IStep {
  setStep: React.Dispatch<React.SetStateAction<OnboardingStatus | "WELCOME">>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  userId: string;
}

export interface IRoleState {
  selectedRole: Role;
  setSelectedRole: React.Dispatch<React.SetStateAction<Role>>;
}
