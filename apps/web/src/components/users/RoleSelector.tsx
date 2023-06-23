import { MouseEventHandler } from "react";
import { trpc } from "../../utils/trpc";
import { Role } from "@prisma/client";
import { Button } from "../shared/button/Button";
import { Header } from "../shared/Header";

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
    <div className="h-full w-full bg-slate-100">
      <Header heading="Welcome" />
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="text-xl font-medium">Choose your role</p>
        <div className="flex justify-center gap-4 py-4">
          <Button onClick={handleClick(Role.TENANT)}>Tenant</Button>
          <Button onClick={handleClick(Role.OWNER)}>Owner</Button>
          <Button onClick={handleClick(Role.AGENCY)}>Agency</Button>
        </div>
      </div>
    </div>
  );
};
