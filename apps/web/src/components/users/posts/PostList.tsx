/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { PostBar } from "../../shared/post/PostBar";

export interface PostListProps {
  userId: string;
}

export const PostList = ({ userId }: PostListProps) => {
  const { data: relationships, refetch: refetchMatchesForTenant } =
    trpc.relationship.getMatchesForTenant.useQuery({ userId });

  const { data: user } = trpc.user.getUserById.useQuery({ userId });

  const deleteMatchMutation =
    trpc.relationship.deleteRelationForTenant.useMutation({
      onSuccess: () => {
        refetchMatchesForTenant();
      },
    });

  const OnDeleteMatch = async (relationshipId: string) => {
    await deleteMatchMutation.mutateAsync({ userId, relationshipId });
  };

  if (relationships && relationships.length > 0) {
    return (
      <>
        {relationships.map(({ post, id, relationType, conversation }) => (
          <PostBar
            key={post.id}
            post={post}
            postLink="/posts/[postId]"
            relationType={relationType}
            relationshipId={id}
            conversationId={conversation?.id}
            user={user}
            OnDeleteMatch={OnDeleteMatch}
          />
        ))}
      </>
    );
  }
  return <></>;
};
