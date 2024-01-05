import { OnboardingStatus } from "@leace/api/src/utils/types";
import { Role } from "@leace/db";

export interface IStep {
  setStep: React.Dispatch<React.SetStateAction<OnboardingStatus | "WELCOME">>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  userId: string;
}

export interface IRoleState {
  selectedRole: Role;
  setSelectedRole: React.Dispatch<React.SetStateAction<Role>>;
}
