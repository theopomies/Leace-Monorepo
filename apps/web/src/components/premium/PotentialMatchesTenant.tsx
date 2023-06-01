import { trpc } from "../../utils/trpc";
import { PostBar } from "../shared/post/PostBar";
import { useMemo } from "react";
import { Loader } from "../shared/Loader";

export interface PostListProps {
  userId: string;
}

export const PotentialMatchesTenant = ({ userId }: PostListProps) => {
  const {
    data: relationships,
    isLoading: likesForTenantLoading,
    refetch: refetchLikesForTenant,
  } = trpc.relationship.getLikesForTenant.useQuery({ userId });
  const { data: user, isLoading: userLoading } = trpc.user.getUserById.useQuery(
    { userId },
  );

  const likePostForTenant = trpc.relationship.likePostForTenant.useMutation({
    onSuccess: () => refetchLikesForTenant(),
  });
  const deleteMatchMutation =
    trpc.relationship.deleteRelationForTenant.useMutation({
      onSuccess: () => refetchLikesForTenant(),
    });

  const isLoading = useMemo(() => {
    return likesForTenantLoading || userLoading;
  }, [likesForTenantLoading, userLoading]);

  if (isLoading) {
    return <Loader />;
  }

  const OnDeleteMatch = async (relationshipId: string) => {
    await deleteMatchMutation.mutateAsync({ userId, relationshipId });
  };
  const OnLikeMatch = async (postId: string) => {
    await likePostForTenant.mutateAsync({ userId, postId });
  };

  if (
    relationships &&
    relationships.relationship &&
    relationships.relationship.length > 0 &&
    user
  ) {
    return (
      <div className="flex flex-row gap-4">
        {relationships.relationship.map(({ post, id, relationType }) => (
          <PostBar
            key={post.id}
            post={post}
            postLink="/posts/[postId]"
            relationType={relationType}
            relationshipId={id}
            user={user}
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
