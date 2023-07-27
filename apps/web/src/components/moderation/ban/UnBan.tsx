import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";

export interface UnBanProps {
  userId: string;
}

export const UnBan = ({ userId }: UnBanProps) => {
  const utils = trpc.useContext();
  const unBan = trpc.moderation.ban.unBanUser.useMutation({
    onSuccess() {
      utils.moderation.user.getUser.invalidate();
      utils.moderation.ban.getIsBan.invalidate();
    },
  });
  const handleClick = () => {
    unBan.mutate({ userId });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Button onClick={handleClick}>UnBan user</Button>
    </div>
  );
};
