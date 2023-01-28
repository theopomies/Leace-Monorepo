import axios from "axios";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

export const DeleteImgButton = (props: { userId: string; id: string }) => {
  const utils = trpc.useContext();
  const mut = trpc.image.DeleteSignedUserUrl.useMutation();
  const onClickDelete = async () => {
    await mut.mutateAsync(props.id).then(async (url) => {
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

export const DeleteAllImgButton = (props: { userId: string }) => {
  const path = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.moderation.deleteImage.useMutation({
    onSuccess() {
      path.pathname === "/moderation/moderation"
        ? utils.moderation.getReport.invalidate()
        : utils.moderation.getById.invalidate(props.userId);
    },
  });

  const handleClick = () => {
    mutation.mutate({ userId: props.userId });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center px-10">
      <button
        className="rounded-full bg-red-500  py-2 px-4 font-bold text-white hover:bg-red-700"
        onClick={handleClick}
      >
        Supprimer toutes les images
      </button>
    </div>
  );
};
