import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { Header } from "../users/Header";
import { PostBar } from "../users/posts/PostBar";
import { PostType } from "@prisma/client";

export interface PostListProps {
  userId: string;
}

export const PotentialMatchesTenant = ({ userId }: PostListProps) => {
  const { data: relationships } = trpc.relationship.getLikesForTenant.useQuery({
    userId,
  });
  const { data: user } = trpc.user.getUserById.useQuery({
    userId: userId ?? "",
  });
  if (relationships && relationships.relationship) {
    return (
      <div className="container mx-auto p-4">
        <Header heading={"Potential Matches"} />
        <>
          {relationships.relationship.map(({ post, id, relationType }) => (
            <PostBar
              key={id}
              postId={post.id}
              title={post.title ?? "Title"}
              desc={post.desc ?? "Description"}
              relationType={relationType}
              type={post.type ?? PostType.TO_BE_RENTED}
              userId={userId}
              relationshipId={id}
              user={user}
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
