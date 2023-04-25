import { UserStatus } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Button } from "../shared/button/Button";

export interface BanButtonProps {
  userId: string;
}

export const BanButton = ({ userId }: BanButtonProps) => {
  const { data: user } = trpc.moderation.getUser.useQuery({ userId: userId });
  const utils = trpc.useContext();
  const mutation = trpc.moderation.updateStatus.useMutation({
    onSuccess() {
      utils.moderation.getUser.invalidate({ userId: userId });
    },
  });

  const handleClick = () => {
    mutation.mutate({
      id: userId,
      status:
        user && user.status === UserStatus.BANNED
          ? UserStatus.ACTIVE
          : UserStatus.BANNED,
    });
  };

  return (
    <>
      {user && (
        <div className="flex w-full flex-col items-center justify-center">
          <Button
            theme={`${
              user.status === UserStatus.BANNED ? "primary" : "danger"
            }`}
            onClick={handleClick}
          >
            {user.status === UserStatus.BANNED ? "Unban" : "Ban"}
          </Button>
        </div>
      )}
    </>
  );
};
