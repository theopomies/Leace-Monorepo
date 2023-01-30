import axios from "axios";
import { trpc } from "../utils/trpc";

export const DeleteImgButton = (props: { userId: string; id: string }) => {
  const utils = trpc.useContext();
  const mut = trpc.moderation.deleteImage.useMutation();
  const onClickDelete = async () => {
    await mut
      .mutateAsync({ userId: props.userId, id: props.id })
      .then(async (url) => {
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
      <svg
        className="w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};
