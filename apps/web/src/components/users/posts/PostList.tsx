/* eslint-disable @next/next/no-img-element */
import { PostType } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { PostBar } from "./PostBar";

export interface PostListProps {
  userId: string;
}

export const PostList = ({ userId }: PostListProps) => {
  const { data: relationships, status } =
    trpc.relationship.getMatchesForTenant.useQuery({ userId });
  const { data: user } = trpc.user.getUserById.useQuery({
    userId: userId ?? "",
  });

  return (
    <>
      {(status == "success" && relationships.length) ? (
        relationships.map(({ post, id, relationType, conversation }) => (
          <PostBar
            key={id}
            postId={post.id}
            title={post.title ?? "Title"}
            desc={post.desc ?? "Description"}
            relationType={relationType}
            type={post.type ?? PostType.TO_BE_RENTED}
            userId={userId}
            relationshipId={id}
            conversationId={conversation?.id}
            user={user}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center mt-8">
          <h1 className="text-2xl font-bold text-gray-700">No matches yet :(</h1>

          <div className="mt-4 flex flex-col items-center justify-center">
            <p className="text-gray-500">Go swipe to find your dream apartment !</p>
          </div>
        </div>
      )}
    </>
  );
};
