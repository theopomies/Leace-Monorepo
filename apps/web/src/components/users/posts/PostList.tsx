/* eslint-disable @next/next/no-img-element */
import { PostType } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { PostBar } from "./PostBar";

export interface PostListProps {
  userId: string;
}

export const PostList = ({ userId }: PostListProps) => {
  const { data: relationships } =
    trpc.relationship.getMatchesForTenant.useQuery({ userId });

  if (relationships && relationships.length > 0) {
    return (
      <>
        {relationships.map(({ post, id, isMatch, conversation }) => (
          <PostBar
            key={id}
            postId={post.id}
            title={post.title ?? "Title"}
            desc={post.desc ?? "Description"}
            isMatch={isMatch ?? false}
            type={post.type ?? PostType.TO_BE_RENTED}
            userId={userId}
            relationshipId={id}
            conversationId={conversation?.id}
          />
        ))}
      </>
    );
  }
  return <></>;
};
