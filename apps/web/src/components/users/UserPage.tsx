import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { useClerk } from "@clerk/nextjs";
import { useMemo } from "react";
import { UserCard } from "../shared/user/UserCard";

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
  const { data: documents, isLoading: documentsLoading } =
    trpc.document.getSignedUrl.useQuery({ userId });

  const deleteUser = trpc.user.deleteUserById.useMutation();

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

  const handleDeleteUser = async () => {
    await deleteUser.mutateAsync({ userId });
    signOut();
  };

  return (
    <div className="flex w-full flex-grow flex-col overflow-hidden p-20">
      <UserCard
        user={user}
        isBanned={isBanned}
        onUserDelete={handleDeleteUser}
        documents={documents}
        updateLink={`/users/[userId]/update`}
        isLoggedUser={userId === session.userId}
      />
    </div>
  );
};
