export type Step = "WELCOME" | "SELECT" | "PROFILE" | "ATTRIBUTES";

export type Role = "TENANT" | "OWNER" | "AGENCY";

export interface IStep {
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  userId: string;
}

export interface IRoleState {
  selectedRole: Role;
  setSelectedRole: React.Dispatch<React.SetStateAction<Role>>;
}
