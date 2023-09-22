import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { PostBar } from "../shared/post/PostBar";
import { Post } from "./Post";
import { setCacheId } from "../../utils/useCache";
import { useRouter } from "next/router";
import { Button } from "../shared/button/Button";
import Link from "next/link";

export interface MyPostsPageProps {
  userId: string;
  postId?: string;
}

export const MyPostsPage = ({ userId, postId }: MyPostsPageProps) => {
  const { data: posts, isLoading: postsLoading } =
    trpc.post.getPostsByUserId.useQuery({ userId });
  const router = useRouter();

  useEffect(() => {
    if (postId) setCacheId("lastSelectedPostId", postId);
  }, [postId]);

  useEffect(() => {
    if (!postsLoading && posts && posts.length > 0 && !postId) {
      router.push(`/users/${userId}/posts/${posts[0]?.id}`);
    }
  }, [posts, postId, router, postsLoading, userId]);

  if (postsLoading) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen w-full gap-5 overflow-hidden p-10">
      {posts && posts.length > 0 && (
        <div className="w-1/5">
          <Link href={`/users/${userId}/posts/create`}>
            <div
              className={
                "mx-auto mb-5 flex flex-grow cursor-pointer flex-col overflow-hidden rounded-xl bg-indigo-500 shadow-md md:max-w-2xl"
              }
            >
              <div className=" px-2 py-4 text-center font-semibold uppercase tracking-wide text-white">
                Create a new post
              </div>
            </div>
          </Link>
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
          {!posts ||
            (posts.length === 0 && (
              <Link href={`/users/${userId}/posts/create`}>
                <Button className="mt-5">Create a new post</Button>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};
