import { Role } from "@prisma/client";
import { Button } from "../button/Button";
import { trpc } from "../../../utils/trpc";

export interface SupportButtonProps {
  userId: string;
  role: Role;
}

export const SupportButton = ({ userId, role }: SupportButtonProps) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.support.createRelationship.useMutation({
    onSuccess() {
      utils.support.getRelationshipsForOwner.invalidate({ userId });
      utils.support.getRelationshipsForTenant.invalidate({ userId });
    },
  });

  if (role === Role.AGENCY || role === Role.OWNER || role === Role.TENANT)
    return (
      <Button onClick={() => mutate({ userId })} className="mt-auto">
        Support
      </Button>
    );
  return null;
};
