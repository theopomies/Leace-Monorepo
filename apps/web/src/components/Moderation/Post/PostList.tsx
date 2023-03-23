/* eslint-disable @next/next/no-img-element */
import { PostType } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { PostBar } from "./PostBar";

export interface PostListProps {
  userId: string;
  setPostId: (postId: string) => void;
}

export const PostList = ({ userId, setPostId }: PostListProps) => {
  const { data: posts } = trpc.moderation.getPosts.useQuery({ userId: userId });

  if (posts) {
    return (
      <div className="z-10 mb-2 grid h-48 grid-cols-3 gap-4 overflow-auto rounded-t-lg rounded-l-lg bg-[#c9c8cb40] p-5">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => setPostId(post.id)}
            className="cursor-pointer"
          >
            <PostBar
              postId={post.id}
              title={post.title ?? "Title"}
              desc={post.desc ?? "Description"}
              type={post.type ?? PostType.TO_BE_RENTED}
            />
          </div>
        ))}
      </div>
    );
  }
  return <></>;
};
