import { useMemo } from "react";
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { UserBar } from "../shared/user/UserBar";

export interface UserListProps {
  userId: string;
}

export const UserList = ({ userId }: UserListProps) => {
  const {
    data: relationships,
    status,
    isLoading: matchesForOwnerLoading,
    refetch: refetchMatchesForOwner,
  } = trpc.relationship.getMatchesForOwner.useQuery({ userId });
  const { data: currentUser, isLoading: userLoading } =
    trpc.user.getUserById.useQuery({ userId });

  const likeTenantForPost = trpc.relationship.likeTenantForPost.useMutation({
    onSuccess: () => refetchMatchesForOwner(),
  });
  const deleteMatchMutation =
    trpc.relationship.deleteRelationForOwner.useMutation({
      onSuccess: () => refetchMatchesForOwner(),
    });

  const isLoading = useMemo(() => {
    return matchesForOwnerLoading || userLoading;
  }, [matchesForOwnerLoading, userLoading]);

  if (isLoading) {
    return <Loader />;
  }

  const OnDeleteMatch = async (relationshipId: string) => {
    await deleteMatchMutation.mutateAsync({ userId, relationshipId });
  };
  const OnLikeMatch = async (matchedUserId: string, postId: string) => {
    await likeTenantForPost.mutateAsync({ userId: matchedUserId, postId });
  };

  if (status == "success" && relationships.length && currentUser) {
    return (
      <div className="flex flex-row gap-4">
        {relationships.map(({ user, relationType, id, post, conversation }) => (
          <UserBar
            key={user.id}
            matchedUser={user}
            matchedUserLink="/users/[userId]"
            post={post}
            relationType={relationType}
            relationshipId={id}
            user={currentUser}
            conversationId={conversation?.id}
            OnDeleteMatch={OnDeleteMatch}
            OnLikeMatch={OnLikeMatch}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-700">No matches yet :(</h1>
      <div className="mt-4 flex flex-col items-center justify-center">
        <p className="text-gray-500">Go swipe to find your dream tenant !</p>
      </div>
    </div>
  );
};
