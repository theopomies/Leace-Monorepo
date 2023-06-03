/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { useClerk } from "@clerk/nextjs";
import { UserCard } from "../shared/user/UserCard";
import { useMemo } from "react";

export interface UserPageProps {
  userId: string;
}

export const UserPage = ({ userId }: UserPageProps) => {
  const { signOut } = useClerk();
  const { data: session, isLoading: sessionLoading } =
    trpc.auth.getSession.useQuery();
  const { data: isBanned, isLoading: isBannedLoading } =
    trpc.moderation.ban.getIsBan.useQuery({ userId });
  const { data: user, isLoading: userLoading } = trpc.user.getUserById.useQuery(
    { userId },
  );
  const {
    data: documents,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = trpc.document.getSignedUrl.useQuery({ userId });

  const deleteUser = trpc.user.deleteUserById.useMutation();
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();

  const isLoading = useMemo(() => {
    return sessionLoading || isBannedLoading || userLoading || documentsLoading;
  }, [sessionLoading, isBannedLoading, userLoading, documentsLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  if (!user) {
    return <div>Not found</div>;
  }

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync({ userId, documentId });
    refetchDocuments();
  };

  const handleDeleteUser = async () => {
    await deleteUser.mutateAsync({ userId });
    signOut();
  };

  return (
    <div className="m-auto w-1/2 py-5">
      <UserCard
        user={user}
        isBanned={isBanned}
        OnUserDelete={handleDeleteUser}
        documents={documents}
        OnDocDelete={handleDeleteDoc}
        updateLink="/users/[userId]/update"
        isLoggedIn={userId === session.userId}
      />
    </div>
  );
};
