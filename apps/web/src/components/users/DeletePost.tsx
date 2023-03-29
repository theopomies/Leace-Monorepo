import React from "react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

function DeletePost(props: { post: string }) {
  const utils = trpc.useContext();
  const router = useRouter();
  const delPost = trpc.post.deletePost.useMutation({
    onSuccess() {
      utils.post.getPost.invalidate(props.post);
    },
  });
  const onClickDelete = () => {
    delPost.mutate(props.post);
    router.push("/users/me");
  };

  return (
    <button
      className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
      onClick={onClickDelete}
    >
      Delete
    </button>
  );
}

export default DeletePost;
