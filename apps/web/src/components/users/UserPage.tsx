import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { useClerk } from "@clerk/nextjs";
import { useMemo } from "react";
import { UserCard } from "../shared/user/UserCard";

export interface UserPageProps {
  sessionUserId: string;
  userId: string;
}

export const UserPage = ({ sessionUserId, userId }: UserPageProps) => {
  const { signOut } = useClerk();
  const { data: isBanned, isLoading: isBannedLoading } =
    trpc.moderation.ban.getIsBan.useQuery({ userId });
  const { data: user, isLoading: userLoading } = trpc.user.getUserById.useQuery(
    { userId },
  );
  const { data: documents, isLoading: documentsLoading } =
    trpc.document.getSignedUrl.useQuery({ userId }, { retry: false });

  const deleteUser = trpc.user.deleteUserById.useMutation();

  const isLoading = useMemo(() => {
    return isBannedLoading || userLoading || documentsLoading;
  }, [isBannedLoading, userLoading, documentsLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <div>Not found</div>;
  }

  const handleDeleteUser = async () => {
    await deleteUser.mutateAsync({ userId });
    signOut();
  };

  return (
    <UserCard
      user={user}
      isBanned={isBanned}
      onUserDelete={handleDeleteUser}
      documents={documents}
      updateLink={`/users/[userId]/update`}
      isLoggedUser={userId === sessionUserId}
    />
  );
};
