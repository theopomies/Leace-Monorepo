import { trpc } from "../../utils/trpc";
import { PostBar } from "../shared/post/PostBar";
import { Header } from "../shared/Header";

export interface UserPostListProps {
  userId: string;
}

export function UserPostList({ userId }: UserPostListProps) {
  const { data: posts } = trpc.post.getPostsByUserId.useQuery({ userId });

  return (
    <div className="w-full">
      <Header heading={"Post"} />
      {posts &&
        posts.map((post) => (
          <PostBar key={post.id} post={post} postLink="/posts/[postId]" />
        ))}
    </div>
  );
}
