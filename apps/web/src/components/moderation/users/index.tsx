/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { useMemo } from "react";
import { UserCard } from "../../shared/user/UserCard";
import { Document, Role } from "@prisma/client";

export interface UserProps {
  userId: string;
}

export const User = ({ userId }: UserProps) => {
  const { data: session, isLoading: sessionLoading } =
    trpc.auth.getSession.useQuery();
  const { data: isBanned, isLoading: isBannedLoading } =
    trpc.moderation.ban.getIsBan.useQuery({ userId });
  const { data: user, isLoading: userLoading } =
    trpc.moderation.user.getUser.useQuery({ userId });
  const {
    data: documents,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = trpc.moderation.document.getSignedUrl.useQuery({ userId });

  const documentValidation =
    trpc.moderation.document.documentValidation.useMutation();

  const isLoading = useMemo(() => {
    return sessionLoading || isBannedLoading || userLoading || documentsLoading;
  }, [sessionLoading, isBannedLoading, userLoading, documentsLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  if (!user) return <p>Something went wrong</p>;

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
      user={user}
      isBanned={isBanned}
      documents={documents}
      OnDocValidation={handleDocValidation}
      updateLink={"/administration/users/[userId]/update"}
      isAdmin={session.role === Role.ADMIN}
    />
  );
};
