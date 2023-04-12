import { MouseEventHandler } from "react";
import { trpc } from "../../utils/trpc";
import { Role } from "@prisma/client";
import { Button } from "../shared/button/Button";

export interface RoleSelectorProps {
  userId: string;
}

export const RoleSelector = ({ userId }: RoleSelectorProps) => {
  const utils = trpc.useContext();
  const userRole = trpc.user.updateUserRoleById.useMutation({
    onSuccess() {
      utils.auth.getSession.invalidate();
    },
  });

  const handleClick: (
    role: "TENANT" | "OWNER" | "AGENCY",
  ) => MouseEventHandler<HTMLButtonElement> = (role) => (e) => {
    e.preventDefault();
    if (!(role in Role)) return;
    userRole.mutate({ role, userId });
  };

  return (
    <div className="h-full bg-slate-100">
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          Welcome
        </h1>
        <p className="text-xl font-medium">Choose your role</p>
        <div className="flex justify-center">
          <Button onClick={handleClick(Role.TENANT)}>Tenant</Button>
          <Button onClick={handleClick(Role.OWNER)}>Owner</Button>
          <Button onClick={handleClick(Role.AGENCY)}>Agency</Button>
        </div>
      </div>
    </div>
  );
};
