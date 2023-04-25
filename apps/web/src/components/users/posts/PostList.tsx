/* eslint-disable @next/next/no-img-element */
import { PostType } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { PostBar } from "./PostBar";

export interface PostListProps {
  userId: string;
}

export const PostList = ({ userId }: PostListProps) => {
  const { data: relationships } = trpc.relationship.getMatchesForOwner.useQuery(
    { userId },
  );
  if (relationships) {
    return (
      <>
        {relationships.map(({ post: { id, title, desc, type } }) => (
          <PostBar
            key={id}
            postId={id}
            title={title ?? "Title"}
            desc={desc ?? "Description"}
            type={type ?? PostType.TO_BE_RENTED}
          />
        ))}
      </>
    );
  }
  return <></>;
};
