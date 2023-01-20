import { UserStatus } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../utils/trpc";

export const BanButton = (props: { userId: string }) => {
  const path = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.moderation.banUser.useMutation({
    onSuccess() {
      path.pathname === "/moderation/moderation"
        ? utils.moderation.getReport.invalidate()
        : utils.moderation.getById.invalidate(props.userId);
    },
  });

  const handleClick = async () => {
    await mutation.mutateAsync({
      id: props.userId,
      status: UserStatus.BANNED,
    });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center px-10">
      <button
        className="mt-5 rounded-full bg-red-500  py-2 px-4 font-bold text-white hover:bg-red-700"
        onClick={handleClick}
      >
        Bannir
      </button>
    </div>
  );
};

export const UnBanButton = (props: { userId: string }) => {
  const path = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.moderation.banUser.useMutation({
    onSuccess() {
      path.pathname === "/moderation/moderation"
        ? utils.moderation.getReport.invalidate()
        : utils.moderation.getById.invalidate(props.userId);
    },
  });

  const handleClick = async () => {
    await mutation.mutateAsync({
      id: props.userId,
      status: UserStatus.ACTIVE,
    });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center px-10">
      <button
        className="mt-5 rounded-full bg-blue-500  py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={handleClick}
      >
        Débannir
      </button>
    </div>
  );
};
