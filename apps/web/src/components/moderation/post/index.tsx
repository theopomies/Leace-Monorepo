/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import axios from "axios";
import { useMemo } from "react";
import { PostCard } from "../../shared/post/PostCard";
import { Document } from "@prisma/client";

export interface PostProps {
  postId: string;
}

export const Post = ({ postId }: PostProps) => {
  const utils = trpc.useContext();
  const { data: post, isLoading: postLoading } =
    trpc.moderation.post.getPost.useQuery({ postId });
  const {
    data: images,
    isLoading: imagesLoading,
    refetch: refetchImages,
  } = trpc.moderation.image.getSignedPostUrl.useQuery(postId);
  const {
    data: documents,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = trpc.moderation.document.getSignedUrl.useQuery({ postId });

  const deleteImage = trpc.moderation.image.deleteSignedPostUrl.useMutation({
    onSuccess: () => utils.image.getSignedPostUrl.invalidate(),
  });
  const deleteDocument = trpc.moderation.document.deleteSignedUrl.useMutation();
  const documentValidation =
    trpc.moderation.document.documentValidation.useMutation();

  const handleDeleteImg = async (imageId: string) => {
    await deleteImage.mutateAsync({ postId, imageId }).then(async (url) => {
      await axios.delete(url);
      refetchImages();
    });
  };

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync({ postId, documentId });
    refetchDocuments();
  };

  const handleDocValidation = async (document: Document & { url: string }) => {
    if (document) {
      await documentValidation.mutateAsync({
        id: document.id,
        valid: !document.valid,
      });
      refetchDocuments();
    }
  };

  const isLoading = useMemo(() => {
    return postLoading || imagesLoading || documentsLoading;
  }, [postLoading, imagesLoading, documentsLoading]);

  if (isLoading) return <Loader />;

  if (!post) return <p>Something went wrong</p>;

  return (
    <PostCard
      post={post}
      images={images}
      OnImgDelete={handleDeleteImg}
      documents={documents}
      OnDocDelete={handleDeleteDoc}
      OnDocValidation={handleDocValidation}
      isAdmin
    />
  );
};
