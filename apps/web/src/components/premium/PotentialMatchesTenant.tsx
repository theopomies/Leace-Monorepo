import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { Header } from "../shared/Header";
import { PostBar } from "../shared/post/PostBar";

export interface PostListProps {
  userId: string;
}

export const PotentialMatchesTenant = ({ userId }: PostListProps) => {
  const { data: relationships, refetch: refetchLikesForTenant } =
    trpc.relationship.getLikesForTenant.useQuery({ userId });
  const { data: user } = trpc.user.getUserById.useQuery({ userId });

  const likePostForTenant = trpc.relationship.likePostForTenant.useMutation({
    onSuccess: () => {
      refetchLikesForTenant();
    },
  });
  const deleteMatchMutation =
    trpc.relationship.deleteRelationForTenant.useMutation({
      onSuccess: () => {
        refetchLikesForTenant();
      },
    });

  const OnDeleteMatch = async (relationshipId: string) => {
    await deleteMatchMutation.mutateAsync({ userId, relationshipId });
  };
  const OnLikeMatch = async (postId: string) => {
    await likePostForTenant.mutateAsync({
      userId: userId,
      postId: postId,
    });
  };

  if (relationships && relationships.relationship && user) {
    return (
      <div className="container mx-auto p-4">
        <Header heading={"Potential Matches"} />
        <>
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
        </>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto p-4">
        <div className="bottom-80 left-0 right-0 top-80 items-center justify-center">
          <div className="items-center justify-center text-center text-3xl font-bold">
            No client has liked your post yet!
          </div>
        </div>
        <Link
          className="bottom-0 left-0 right-0 flex items-center justify-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          href={`/`}
        >
          Return
        </Link>
      </div>
    );
  }
};
