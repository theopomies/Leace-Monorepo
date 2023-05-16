import React from "react";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "@clerk/nextjs";
import { Button } from "../../shared/button/Button";

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
    router.push(`/users/${session?.session?.user.id ?? "/"}`);
  };

  return (
    <Button theme="danger" onClick={onDelete}>
      Delete
    </Button>
  );
}
