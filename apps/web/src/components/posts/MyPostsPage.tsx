import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { PostBar } from "../shared/post/PostBar";
import { Post } from "./Post";
import { setCacheId } from "../../utils/useCache";

export interface MyPostsPageProps {
  userId: string;
  postId?: string;
}

export const MyPostsPage = ({ userId, postId }: MyPostsPageProps) => {
  const { data: posts, isLoading: postsLoading } =
    trpc.post.getPostsByUserId.useQuery({ userId });

  useEffect(() => {
    if (postId) setCacheId("lastSelectedPostId", postId);
  }, [postId]);

  if (postsLoading) {
    return <Loader />;
  }

  return (
    <div className="flex w-full gap-5 p-10">
      {posts && posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <PostBar
              key={post.id}
              post={post}
              postLink={`/users/${userId}/posts/[postId]`}
              selected={post.id === postId}
            />
          ))}
        </div>
      )}
      {postId ? (
        <Post
          postId={postId}
          authorId={userId}
          updateLink={`/users/${userId}/posts/[postId]/update`}
        />
      ) : (
        <div className="flex w-full flex-col items-center justify-center overflow-auto rounded-lg bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-gray-700">
            {!posts || posts.length === 0
              ? "You don't have any post yet"
              : "Please, select a post"}
          </h1>
        </div>
      )}
    </div>
  );
};
