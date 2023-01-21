import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../utils/trpc";

export const DeleteImgButton = (props: { id: string }) => {
  const path = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.moderation.deleteImage.useMutation({
    onSuccess() {
      path.pathname === "/moderation/moderation"
        ? utils.moderation.getReport.invalidate()
        : utils.moderation.getById.invalidate(props.id);
    },
  });

  const handleClick = async () => {
    await mutation.mutateAsync({ id: props.id });
  };

  return (
    <button
      type="button"
      className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-red-500 p-1 text-white hover:bg-white hover:text-red-500"
      onClick={handleClick}
    >
      <svg
        className="w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export const DeleteAllImgButton = (props: { userId: string }) => {
  const path = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.moderation.deleteImages.useMutation({
    onSuccess() {
      path.pathname === "/moderation/moderation"
        ? utils.moderation.getReport.invalidate()
        : utils.moderation.getById.invalidate(props.userId);
    },
  });

  const handleClick = async () => {
    await mutation.mutateAsync({ id: props.userId });
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
