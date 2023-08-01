import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { useMemo } from "react";
import { PostCard } from "../shared/post/PostCard";
import { useRouter } from "next/router";
import { PostType } from "@prisma/client";

export interface PostProps {
  postId: string;
  authorId?: string;
  updateLink?: string;
}

export const Post = ({ postId, authorId, updateLink }: PostProps) => {
  const router = useRouter();

  const { data: post, isLoading: postLoading } = trpc.post.getPostById.useQuery(
    { postId },
  );
  const { data: images, isLoading: imagesLoading } =
    trpc.image.getSignedPostUrl.useQuery({ postId });
  const { data: documents, isLoading: documentLoading } =
    trpc.document.getSignedUrl.useQuery({ postId });

  const deletePost = trpc.post.deletePostById.useMutation();
  const utils = trpc.useContext();
  const updatePost = trpc.post.updatePostById.useMutation({
    async onSuccess() {
      await utils.post.getPostById.invalidate({ postId });
    },
  });

  const isLoading = useMemo(() => {
    return postLoading || imagesLoading || documentLoading;
  }, [postLoading, imagesLoading, documentLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (!post) return <p>Something went wrong</p>;

  const handleDeletePost = async () => {
    if (!authorId) {
      await deletePost.mutateAsync({ postId });
      router.push(`/users/${authorId}/posts`);
    }
  };

  const handlePause = async () => {
    await updatePost.mutateAsync({ postId, type: PostType.HIDE });
  };

  const handleUnpause = async () => {
    await updatePost.mutateAsync({ postId, type: PostType.TO_BE_RENTED });
  };

  return (
    <PostCard
      post={post}
      onPostDelete={handleDeletePost}
      images={images}
      documents={documents}
      updateLink={updateLink}
      isLoggedIn={post.createdById === authorId}
      onPauseButton={handlePause}
      onUnpauseButton={handleUnpause}
    />
  );
};
