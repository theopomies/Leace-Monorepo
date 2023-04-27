import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";

export interface UnBanProps {
  userId: string;
}

export const UnBan = ({ userId }: UnBanProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.moderation.unBanUser.useMutation({
    onSuccess() {
      utils.moderation.getUser.invalidate();
      utils.moderation.getIsBan.invalidate();
    },
  });
  const handleClick = () => {
    mutation.mutate({ userId });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Button onClick={handleClick}>UnBan</Button>
    </div>
  );
};
