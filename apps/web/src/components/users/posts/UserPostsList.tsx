import { trpc } from "../../../utils/trpc";
import { Header } from "../Header";
import { PostBar } from "../PostBar";
import { PostType } from "@leace/db";

export interface UserPostsListProps {
  userId: string;
}

export function UserPostsList({ userId }: UserPostsListProps) {
  const { data: posts } = trpc.post.getPostsByUserId.useQuery({ userId });

  return (
    <div className="w-full">
      <Header heading={"Post"} />
      {posts &&
        posts.map((post) => (
          <PostBar
            key={post.id}
            postId={post.id}
            title={post.title ?? "Title"}
            desc={post.desc ?? "Description"}
            type={post.type ?? PostType.TO_BE_RENTED}
          />
        ))}
    </div>
  );
}
