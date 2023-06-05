import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { PostCard } from "../shared/post/PostCard";

export interface PostPageProps {
  postId: string;
}

export const PostPage = ({ postId }: PostPageProps) => {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } =
    trpc.auth.getSession.useQuery();
  const { data: post, isLoading: postLoading } = trpc.post.getPostById.useQuery(
    { postId },
  );
  const { data: images, isLoading: imagesLoading } =
    trpc.image.getSignedPostUrl.useQuery(postId);
  const { data: documents, isLoading: documentLoading } =
    trpc.document.getSignedUrl.useQuery({ postId });

  const deletePost = trpc.post.deletePostById.useMutation();

  const isLoading = useMemo(() => {
    return sessionLoading || postLoading || imagesLoading || documentLoading;
  }, [sessionLoading, postLoading, imagesLoading, documentLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  if (!post) return <p>Something went wrong</p>;

  const handleDeletePost = async () => {
    await deletePost.mutateAsync({ postId });
    router.push(`/users/${session.userId ?? "/"}`);
  };

  return (
    <div className="m-auto w-1/2 py-5">
      <PostCard
        post={post}
        OnPostDelete={handleDeletePost}
        images={images}
        documents={documents}
        updateLink="/posts/[postId]/update"
        isLoggedIn={post.createdById === session.userId}
      />
    </div>
  );
};
