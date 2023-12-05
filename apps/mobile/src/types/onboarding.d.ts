export type Step = "WELCOME" | "SELECT" | "PROFILE" | "ATTRIBUTES";

export interface IStep {
  step: Step;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  userId: string;
}
