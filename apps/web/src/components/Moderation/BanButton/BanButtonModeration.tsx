import { UserStatus } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { Button } from "./Button";

export interface BanButtonModerationProps {
  userId: string;
  isBanned: boolean;
}

export const BanButtonModeration = ({
  userId,
  isBanned,
}: BanButtonModerationProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.moderation.banUser.useMutation({
    onSuccess() {
      utils.moderation.getReport.invalidate();
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
