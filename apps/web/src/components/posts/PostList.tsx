/* eslint-disable @next/next/no-img-element */
import { useMemo } from "react";
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { PostBar } from "../shared/post/PostBar";

export interface PostListProps {
  userId: string;
}

export const PostList = ({ userId }: PostListProps) => {
  const {
    data: relationships,
    status,
    isLoading: matchesForTenantLoading,
    refetch: refetchMatchesForTenant,
  } = trpc.relationship.getMatchesForTenant.useQuery({ userId });
  const { data: user, isLoading: userLoading } = trpc.user.getUserById.useQuery(
    { userId },
  );

  const deleteMatchMutation =
    trpc.relationship.deleteRelationForTenant.useMutation({
      onSuccess: () => {
        refetchMatchesForTenant();
      },
    });

  const isLoading = useMemo(() => {
    return matchesForTenantLoading || userLoading;
  }, [matchesForTenantLoading, userLoading]);

  if (isLoading) {
    return <Loader />;
  }

  const onDeleteMatch = async (relationshipId: string) => {
    await deleteMatchMutation.mutateAsync({ userId, relationshipId });
  };

  if (status == "success" && relationships.length) {
    return (
      <div>
        {relationships.map(({ post, id, relationType, conversation }) => (
          <PostBar
            key={post.id}
            post={post}
            postLink="/posts/[postId]"
            relationType={relationType}
            relationshipId={id}
            conversationId={conversation?.id}
            user={user}
            onDeleteMatch={onDeleteMatch}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-700">No matches yet :(</h1>
      <div className="mt-4 flex flex-col items-center justify-center">
        <p className="text-gray-500">Go swipe to find your dream apartment !</p>
      </div>
    </div>
  );
};