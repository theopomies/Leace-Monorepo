import { UserStatus } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { Button } from "./Button";

export interface BanButtonAdminProps {
  userId: string;
  isBanned: boolean;
}

export const BanButtonAdmin = ({ userId, isBanned }: BanButtonAdminProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.moderation.banUser.useMutation({
    onSuccess() {
      utils.moderation.getById.invalidate(userId);
    },
  });

  const handleClick = () => {
    mutation.mutate({
      id: userId,
      status: isBanned ? UserStatus.ACTIVE : UserStatus.BANNED,
    });
  };

  return <Button handleClick={handleClick} isBanned={isBanned} />;
};
