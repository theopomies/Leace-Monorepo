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
  if (relationships) {
    return (
      <>
        {relationships.map(
          ({ post: { id: postId, title, desc, type }, id }) => (
            <div key={id}>
              <PostBar
                postId={postId}
                title={title ?? "Title"}
                desc={desc ?? "Description"}
                type={type ?? PostType.TO_BE_RENTED}
                userId={userId}
                relationShipId={id}
              />
            </div>
          ),
        )}
      </>
    );
  }
  return <></>;
};
