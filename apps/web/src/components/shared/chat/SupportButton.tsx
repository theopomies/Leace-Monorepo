import { Role } from "@prisma/client";
import { Button } from "../button/Button";
import { trpc } from "../../../utils/trpc";

// TODO

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
      <div className="mt-auto flex justify-center">
        <Button
          onClick={() => {
            mutateAsync({ userId }).then(setConversationId);
          }}
          className="my-2 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
          >
            <path d="M21,12.22C21,6.73,16.74,3,12,3c-4.69,0-9,3.65-9,9.28C2.4,12.62,2,13.26,2,14v2c0,1.1,0.9,2,2,2h1v-6.1 c0-3.87,3.13-7,7-7s7,3.13,7,7V19h-8v2h8c1.1,0,2-0.9,2-2v-1.22c0.59-0.31,1-0.92,1-1.64v-2.3C22,13.14,21.59,12.53,21,12.22z" />
            <circle cx="9" cy="13" r="1" />
            <circle cx="15" cy="13" r="1" />
            <path d="M18,11.03C17.52,8.18,15.04,6,12.05,6c-3.03,0-6.29,2.51-6.03,6.45c2.47-1.01,4.33-3.21,4.86-5.89 C12.19,9.19,14.88,11,18,11.03z" />
          </svg>
          Support
        </Button>
      </div>
    );
  return null;
};
