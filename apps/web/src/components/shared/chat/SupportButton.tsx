import { Role } from "@prisma/client";
import { Button } from "../button/Button";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { MdOutlineSupportAgent } from "react-icons/md";

export interface SupportButtonProps {
  userId: string;
  role: Role;
  conversationLink: string;
}

export const SupportButton = ({
  userId,
  role,
  conversationLink,
}: SupportButtonProps) => {
  const router = useRouter();
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
            mutateAsync({ userId }).then((conversationId) =>
              router.push(
                conversationLink
                  .replace("[userId]", userId)
                  .replace("[conversationId]", conversationId),
              ),
            );
          }}
          overrideStyles
          className="flex flex-grow items-center gap-2 rounded-bl-lg bg-indigo-500 px-4 py-2 font-medium text-white"
        >
          <MdOutlineSupportAgent size={30} />
          Need help ?
        </Button>
      </div>
    );
  return null;
};
