import React from "react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "@clerk/nextjs";

export interface DeletePostButtonProps {
  postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const utils = trpc.useContext();
  const session = useSession();
  const router = useRouter();

  const delPost = trpc.post.deletePostById.useMutation({
    onSuccess() {
      utils.post.getPostById.invalidate({ postId });
    },
  });

  const onDelete = () => {
    delPost.mutate({ postId });
    router.push(`/${session?.session?.user.id ?? "/"}`);
  };

  return (
    <button
      className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
      onClick={onDelete}
    >
      Delete
    </button>
  );
}
