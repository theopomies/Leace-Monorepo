/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { useMemo } from "react";
import { UserCard } from "../../shared/user/UserCard";
import { Document } from "@prisma/client";

export interface UserProps {
  userId: string;
}

export const User = ({ userId }: UserProps) => {
  const { data: session, isLoading: sessionLoading } =
    trpc.auth.getSession.useQuery();
  const { data: isBanned } = trpc.moderation.ban.getIsBan.useQuery({ userId });
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
  } = trpc.moderation.user.getUser.useQuery({ userId });
  const {
    data: documents,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = trpc.moderation.document.getSignedUrl.useQuery({ userId });

  const deleteImage = trpc.moderation.image.deleteUserImage.useMutation();
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();
  const documentValidation =
    trpc.moderation.document.documentValidation.useMutation();

  const isLoading = useMemo(() => {
    return sessionLoading || userLoading || documentsLoading;
  }, [sessionLoading, userLoading, documentsLoading]);

  if (!session) {
    return <div>Not logged in</div>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!user) return <p>Something went wrong</p>;

  const handleDeleteImg = async () => {
    await deleteImage.mutateAsync({ userId });
    refetchUser();
  };

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync({ userId, documentId });
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

  return (
    <UserCard
      session={session}
      user={user}
      isBanned={isBanned}
      OnImgDelete={handleDeleteImg}
      documents={documents}
      OnDocDelete={handleDeleteDoc}
      OnDocValidation={handleDocValidation}
      updateLink="/moderation/reports" // TODO change this link
    />
  );
};
