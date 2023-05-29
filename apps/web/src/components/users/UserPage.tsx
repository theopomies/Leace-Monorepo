/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { useClerk } from "@clerk/nextjs";
import { UserCard } from "../shared/user/UserCard";

export interface UserPageProps {
  userId: string;
}

export const UserPage = ({ userId }: UserPageProps) => {
  const { signOut } = useClerk();
  const { data: session } = trpc.auth.getSession.useQuery();
  const { data: user, isLoading } = trpc.user.getUserById.useQuery({ userId });
  const { data: documents, refetch: refetchDocuments } =
    trpc.document.getSignedUserUrl.useQuery(userId);

  const deleteUser = trpc.user.deleteUserById.useMutation();
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();

  if (!session) {
    return <div>Not logged in</div>;
  }

  if (isLoading) {
    return <Loader />;
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
        session={session}
        user={user}
        OnUserDelete={handleDeleteUser}
        documents={documents}
        OnDocDelete={handleDeleteDoc}
        updateLink="/users/[userId]/update"
      />
    </div>
  );
};
