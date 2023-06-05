/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { useMemo } from "react";
import { PostCard } from "../../shared/post/PostCard";
import { Document, Role } from "@prisma/client";

export interface PostProps {
  postId: string;
}

export const Post = ({ postId }: PostProps) => {
  const { data: session, isLoading: sessionLoading } =
    trpc.auth.getSession.useQuery();
  const { data: post, isLoading: postLoading } =
    trpc.moderation.post.getPost.useQuery({ postId });
  const { data: images, isLoading: imagesLoading } =
    trpc.moderation.image.getSignedPostUrl.useQuery(postId);
  const {
    data: documents,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = trpc.moderation.document.getSignedUrl.useQuery({ postId });

  const documentValidation =
    trpc.moderation.document.documentValidation.useMutation();

  const isLoading = useMemo(() => {
    return sessionLoading || postLoading || imagesLoading || documentsLoading;
  }, [sessionLoading, postLoading, imagesLoading, documentsLoading]);

  if (isLoading) return <Loader />;

  if (!session) return <div>Not logged in</div>;

  if (!post) return <p>Something went wrong</p>;

  const handleDocValidation = async (document: Document & { url: string }) => {
    if (document) {
      await documentValidation.mutateAsync({
        id: document.id,
        valid: !document.valid,
      });
      refetchDocuments();
    }
  };

  return (
    <PostCard
      post={post}
      images={images}
      documents={documents}
      OnDocValidation={handleDocValidation}
      updateLink={"/administration/posts/[postId]/update"}
      isAdmin={session.role === Role.ADMIN}
    />
  );
};
