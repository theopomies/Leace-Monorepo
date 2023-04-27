import axios from "axios";
import { trpc } from "../../utils/trpc";
import { Cross } from "./Icons";
import { Button } from "../shared/button/Button";

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
      utils.image.getSignedUserUrl.refetch();
    });
  };

  return (
    <Button
      theme="danger"
      onClick={onClickDelete}
      className="absolute -right-1 -top-1 inline-flex w-5"
    >
      <Cross />
    </Button>
  );
};
