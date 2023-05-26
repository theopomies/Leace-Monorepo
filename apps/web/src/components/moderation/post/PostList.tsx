/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { PostBar } from "../../shared/post/PostBar";

export interface PostListProps {
  userId: string;
}

export const PostList = ({ userId }: PostListProps) => {
  const { data: posts } = trpc.moderation.post.getPosts.useQuery({ userId });

  if (posts) {
    return (
      <div>
        {posts.map((post) => (
          <PostBar
            key={post.id}
            post={post}
            postLink="/administration/posts/[postId]"
          />
        ))}
      </div>
    );
  }
  return <></>;
};
