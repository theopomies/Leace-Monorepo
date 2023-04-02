/* eslint-disable @next/next/no-img-element */
import { PostType } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { PostBar } from "./PostBar";

export const PostList = () => {
  const { data: relationships } =
    trpc.relationship.getMatchesForOwner.useQuery();
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
