import { UserStatus } from "@prisma/client";
import { trpc } from "../../utils/trpc";

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
          <button
            className={`${
              user.status === UserStatus.BANNED
                ? "bg-blue-500 hover:bg-blue-700"
                : "bg-red-500 hover:bg-red-700"
            } rounded-full py-2 px-4 font-bold text-white`}
            onClick={handleClick}
          >
            {user.status === UserStatus.BANNED ? "Débannir" : "Bannir"}
          </button>
        </div>
      )}
    </>
  );
};
