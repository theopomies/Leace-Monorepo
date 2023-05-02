import { Role } from "@prisma/client";
import { Button } from "../button/Button";
import { trpc } from "../../../utils/trpc";

export interface SupportButtonProps {
  userId: string;
  role: Role;
  setConversationId: React.Dispatch<React.SetStateAction<string>>;
}

export const SupportButton = ({
  userId,
  role,
  setConversationId,
}: SupportButtonProps) => {
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.support.createRelationship.useMutation({
    onSuccess() {
      utils.support.getRelationshipsForOwner.invalidate();
      utils.support.getRelationshipsForTenant.invalidate();
    },
  });

  if (role === Role.AGENCY || role === Role.OWNER || role === Role.TENANT)
    return (
      <Button
        onClick={() => {
          mutateAsync({ userId }).then(setConversationId);
        }}
        className="mt-auto"
      >
        Support
      </Button>
    );
  return null;
};
