import { OnboardingStatus } from "@leace/api/src/utils/types";
import { Role } from "@leace/db";

export interface IStep {
  setStep: React.Dispatch<React.SetStateAction<OnboardingStatus | "WELCOME">>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  userId: string;
}

interface IOnboardingAccount {
  role: Role;
  firstName: string;
  lastName: string;
  image: string;
  phoneNumber: string;
  description: string;
  birthDate: Date;
}

export interface IAccountState {
  account: IOnboardingAccount;
  setAccount: React.Dispatch<React.SetStateAction<IOnboardingAccount>>;
}
