import { MouseEventHandler, useState } from "react";
import { Button } from "../shared/button/Button";
import { trpc } from "../../utils/trpc";
import { Role } from "@prisma/client";

export function RoleSelection({ userId }: { userId: string }) {
  const [step, setStep] = useState<"greetings" | "roleSelection">("greetings");
  const { mutate: updateUser } = trpc.user.updateUserRoleById.useMutation();
  const utils = trpc.useContext();
  const userRole = trpc.user.updateUserRoleById.useMutation({
    onSuccess() {
      utils.auth.getSession.invalidate();
      utils.onboarding.getUserOnboardingStatus.invalidate();
    },
  });

  const addRole: (
    role: "TENANT" | "OWNER" | "AGENCY",
  ) => MouseEventHandler<HTMLButtonElement> = (role) => (e) => {
    e.preventDefault();
    if (!(role in Role)) return;
    userRole.mutate({ role, userId });
  };

  if (step === "greetings") {
    return (
      <>
        <div className="h-2 w-[1%] bg-indigo-500" />
        <div className="mx-64 flex flex-grow flex-col justify-center gap-24 text-lg">
          <h1 className="text-center text-4xl">Welcome on Leace</h1>
          <p>
            To ensure the safest and most pleasant experience on Leace, we
            require each user to have a minimally complete profile.
          </p>
          <p>
            Before we can create your account you will have to go through a
            small bootstrapping process, don&apos;t worry, this won&apos;t take
            more that a few minutes, and you can leave and come back right where
            you left.
          </p>
          <div className="text-center">
            <Button onClick={() => setStep("roleSelection")}>
              Perfect let&apos;s create my account!
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={"h-2 w-[25%] bg-indigo-500"} />
      <div className="mx-64 flex flex-grow flex-col justify-center gap-24 text-lg">
        <h1 className="text-center text-4xl">Select what defines you best</h1>
        <div className="flex justify-center gap-12">
          <button
            onClick={addRole(Role.TENANT)}
            className="flex w-56 flex-col items-center gap-8 rounded border border-indigo-400 bg-indigo-300 p-12 py-8 hover:bg-indigo-600 hover:text-white"
          >
            <h2 className="text-2xl">Tenant</h2>
            <p>
              You are looking for a house or a flat to rent? Look no further,
              this is for you!
            </p>
          </button>
          <button
            onClick={addRole(Role.OWNER)}
            className="flex w-56 flex-col items-center gap-8 rounded border border-indigo-400 bg-indigo-300 p-12 py-8 hover:bg-indigo-600 hover:text-white"
          >
            <h2 className="text-2xl">Owner</h2>
            <p>
              You have a house or a flat to rent? Just a few clicks and you will
              be able to rent it!
            </p>
          </button>
          <button
            onClick={addRole(Role.AGENCY)}
            className="flex w-56 flex-col items-center gap-8 rounded border border-indigo-400 bg-indigo-300 p-12 py-8 hover:bg-indigo-600 hover:text-white"
          >
            <h2 className="text-2xl">Agency</h2>
            <p>
              You are a real estate agency? Perfect, we have a special plan for
              you too!
            </p>
          </button>
        </div>
      </div>
    </>
  );
}
