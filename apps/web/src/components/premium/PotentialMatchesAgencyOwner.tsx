import { trpc } from "../../utils/trpc";
import { UserBar } from "../shared/user/UserBar";
import { Loader } from "../shared/Loader";
import { useMemo } from "react";

export interface TenantListProps {
  userId: string;
}

export const PotentialMatchesAgencyOwner = ({ userId }: TenantListProps) => {
  const {
    data: relationships,
    isLoading: likesForOwnerLoading,
    refetch: refetchLikesForOwner,
  } = trpc.relationship.getLikesForOwner.useQuery({ userId });
  const { data: currentUser, isLoading: userLoading } =
    trpc.user.getUserById.useQuery({ userId });

  const likeTenantForPost = trpc.relationship.likeTenantForPost.useMutation({
    onSuccess: () => refetchLikesForOwner(),
  });
  const deleteMatchMutation =
    trpc.relationship.deleteRelationForOwner.useMutation({
      onSuccess: () => refetchLikesForOwner(),
    });

  const isLoading = useMemo(() => {
    return likesForOwnerLoading || userLoading;
  }, [likesForOwnerLoading, userLoading]);

  if (isLoading) {
    return <Loader />;
  }

  const OnDeleteMatch = async (relationshipId: string) => {
    await deleteMatchMutation.mutateAsync({ userId, relationshipId });
  };
  const OnLikeMatch = async (matchedUserId: string, postId: string) => {
    await likeTenantForPost.mutateAsync({ userId: matchedUserId, postId });
  };

  if (
    relationships &&
    relationships.relationship &&
    relationships.relationship.length > 0 &&
    currentUser
  ) {
    return (
      <div className="flex flex-row gap-4">
        {relationships.relationship.map(({ user, relationType, id, post }) => (
          <UserBar
            key={user.id}
            matchedUser={user}
            matchedUserLink="/users/[userId]"
            post={post}
            relationType={relationType}
            relationshipId={id}
            user={currentUser}
            OnDeleteMatch={OnDeleteMatch}
            OnLikeMatch={OnLikeMatch}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-700">
        No client has liked your post yet :(
      </h1>
      <div className="mt-4 flex flex-col items-center justify-center">
        <p className="text-gray-500">Wait, clients are coming to you !</p>
      </div>
    </div>
  );
};
