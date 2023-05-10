import axios from "axios";
import { trpc } from "../../../utils/trpc";
import { Cross } from "../Icons";
import { Button } from "../../shared/button/Button";

export interface DeletePostImgProps {
  postId: string;
  id: string;
}

export const DeletePostImg = ({ postId, id }: DeletePostImgProps) => {
  const mut = trpc.moderation.image.deleteSignedPostUrl.useMutation();
  const onClickDelete = async () => {
    await mut.mutateAsync({ postId: postId, imageId: id }).then(async (url) => {
      await axios.delete(url);
    });
  };

  return (
    <Button
      theme="danger"
      onClick={onClickDelete}
      overrideStyles
      className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-md bg-red-500 p-1 text-white hover:bg-white hover:text-red-500"
    >
      <Cross />
    </Button>
  );
};
