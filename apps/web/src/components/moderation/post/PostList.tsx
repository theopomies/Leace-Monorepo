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
      <div className="z-10 mb-2 grid max-h-48 grid-cols-3 gap-4 overflow-auto rounded-t-lg rounded-l-lg bg-[#c9c8cb40] p-5">
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
