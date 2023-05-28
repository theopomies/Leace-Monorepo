/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { useMemo } from "react";
import { UserCard } from "./UserCard";
import { Document } from "@prisma/client";

export interface UserProps {
  userId: string;
}

export const User = ({ userId }: UserProps) => {
  const { data: user, isLoading: userLoading } =
    trpc.moderation.user.getUser.useQuery({ userId });
  const { data: isBan, isLoading: isBanLoading } =
    trpc.moderation.ban.getIsBan.useQuery({ userId });
  const {
    data: documents,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = trpc.moderation.document.getSignedUrl.useQuery({ userId });

  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();
  const documentValidation =
    trpc.moderation.document.documentValidation.useMutation();

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

  const isLoading = useMemo(() => {
    return userLoading || isBanLoading || documentsLoading;
  }, [userLoading, isBanLoading, documentsLoading]);

  if (isLoading) return <Loader />;

  if (!user) return <p>Something went wrong</p>;

  return (
    <UserCard
      user={user}
      isBan={isBan}
      documents={documents}
      OnDocDelete={handleDeleteDoc}
      OnDocValidation={handleDocValidation}
    />
  );
};
