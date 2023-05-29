import axios from "axios";
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
  const {
    data: images,
    isLoading: imagesLoading,
    refetch: refetchImages,
  } = trpc.image.getSignedPostUrl.useQuery(postId);
  const {
    data: documents,
    isLoading: documentLoading,
    refetch: refetchDocuments,
  } = trpc.document.getSignedUrl.useQuery({ postId });

  const deletePost = trpc.post.deletePostById.useMutation();
  const deleteImage = trpc.image.deleteSignedPostUrl.useMutation();
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();

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

  const handleDeleteImg = async (imageId: string) => {
    await deleteImage.mutateAsync({ postId, imageId }).then(async (url) => {
      await axios.delete(url);
    });
    refetchImages();
  };

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync({ postId, documentId });
    refetchDocuments();
  };

  return (
    <div className="m-auto w-1/2 py-5">
      <PostCard
        post={post}
        OnPostDelete={handleDeletePost}
        images={images}
        OnImgDelete={handleDeleteImg}
        documents={documents}
        OnDocDelete={handleDeleteDoc}
        updateLink="/posts/[postId]/update"
        isLoggedIn={post.createdById === session.userId}
      />
    </div>
  );
};
