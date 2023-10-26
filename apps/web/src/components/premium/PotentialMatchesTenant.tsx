import { trpc } from "../../utils/trpc";
import { PostBar } from "../shared/post/PostBar";
import { useMemo } from "react";
import { Loader } from "../shared/Loader";
import { Header } from "../shared/Header";

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

  const onDeleteMatch = async (relationshipId: string) => {
    await deleteMatchMutation.mutateAsync({ userId, relationshipId });
  };
  const onLikeMatch = async (postId: string) => {
    await likePostForTenant.mutateAsync({ userId, postId });
  };

  if (
    relationships &&
    relationships.relationship &&
    relationships.relationship.length > 0 &&
    user
  ) {
    return (
      <div>
        <Header heading="Potential Matches" />
        {relationships.relationship.map(({ post, id, relationType }) => (
          <PostBar
            key={post.id}
            post={post}
            postLink="/posts/[postId]"
            relationType={relationType}
            relationshipId={id}
            user={user}
            onDeleteMatch={onDeleteMatch}
            onLikeMatch={onLikeMatch}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-8 flex flex-grow flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-700">
        No landlord or agency has liked your profile yet :(
      </h1>
      <div className="mt-4 flex flex-col items-center justify-center">
        <p className="text-center text-gray-500">
          When this happens, they will show up right here!
          <br />
          In the meantime we invite you to make sure your profile is as complete
          as possible
        </p>
      </div>
    </div>
  );
};
