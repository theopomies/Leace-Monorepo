import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";
import { Cross } from "../Icons";

export interface DeleteUserImgProps {
  userId: string;
}

export const DeleteUserImg = ({ userId }: DeleteUserImgProps) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.moderation.image.deleteUserImage.useMutation({
    onSuccess() {
      utils.moderation.user.getUser.invalidate();
    },
  });

  return (
    <Button
      theme="danger"
      onClick={() => mutate({ userId: userId })}
      overrideStyles
      className="absolute right-0 top-0 inline-flex items-center justify-center rounded-md bg-red-500 p-1 text-white hover:bg-white hover:text-red-500"
    >
      <Cross />
    </Button>
  );
};
