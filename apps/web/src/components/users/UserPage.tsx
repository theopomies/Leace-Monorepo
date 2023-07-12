/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { useClerk } from "@clerk/nextjs";
import { useMemo } from "react";
import { UserCard } from "./UserCard";

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
  const { data: image, isLoading: imageLoading } =
    trpc.image.getSignedUserUrl.useQuery({ userId });
  const { data: documents, isLoading: documentsLoading } =
    trpc.document.getSignedUrl.useQuery({ userId });

  const deleteUser = trpc.user.deleteUserById.useMutation();

  const isLoading = useMemo(() => {
    return (
      sessionLoading ||
      isBannedLoading ||
      userLoading ||
      imageLoading ||
      documentsLoading
    );
  }, [
    sessionLoading,
    isBannedLoading,
    userLoading,
    imageLoading,
    documentsLoading,
  ]);

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
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <UserCard
        user={user}
        isBanned={isBanned}
        onDelete={handleDeleteUser}
        image={image}
        documents={documents}
        isLoggedUser={userId === session.userId}
      />
    </div>
  );
};
