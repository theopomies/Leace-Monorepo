/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { PostBar } from "../../shared/post/PostBar";

export interface PostListProps {
  userId: string;
  postLink: string;
}

export const PostList = ({ userId, postLink }: PostListProps) => {
  const { data: posts } = trpc.moderation.post.getPosts.useQuery({ userId });

  if (posts) {
    return (
      <div>
        {posts.map((post) => (
          <PostBar key={post.id} post={post} postLink={postLink} />
        ))}
      </div>
    );
  }
  return <></>;
};
