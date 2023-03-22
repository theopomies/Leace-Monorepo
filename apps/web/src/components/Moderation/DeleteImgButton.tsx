import axios from "axios";
import { trpc } from "../../utils/trpc";
import { Cross } from "./Icons";

export interface DeleteImgButtonProps {
  postId: string;
  id: string;
}

export const DeleteImgButton = ({ postId, id }: DeleteImgButtonProps) => {
  const utils = trpc.useContext();
  const mut = trpc.moderation.deletePostImage.useMutation();
  const onClickDelete = async () => {
    await mut.mutateAsync({ postId: postId, id: id }).then(async (url) => {
      await axios.delete(url);
      utils.image.GetSignedUserUrl.refetch();
    });
  };

  return (
    <button
      type="button"
      className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-red-500 p-1 text-white hover:bg-white hover:text-red-500"
      onClick={onClickDelete}
    >
      <Cross />
    </button>
  );
};
