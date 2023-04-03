import { trpc } from "../../../utils/trpc";

export interface UnBanProps {
  userId: string;
}

export const UnBan = ({ userId }: UnBanProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.moderation.unBanUser.useMutation({
    onSuccess() {
      utils.moderation.getUser.invalidate();
      utils.moderation.getBan.invalidate();
    },
  });
  const handleClick = () => {
    mutation.mutate({ userId });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <button
        className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
        onClick={handleClick}
      >
        UnBan
      </button>
    </div>
  );
};
