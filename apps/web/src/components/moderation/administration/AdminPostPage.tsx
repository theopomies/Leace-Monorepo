import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Button } from "../../shared/button/Button";
import { Search } from "./Search";
import { PostList } from "../post/PostList";
import { Post } from "../post";
import { ActionButtons } from "../ActionButtons";

export function AdminPostPage({ postId }: { postId: string }) {
  const post = trpc.moderation.post.getPostById.useQuery(postId, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (post.isLoading) return <Loader />;
  if (post && post.data && !post.error) {
    return (
      <div className="flex w-full">
        <div className="flex w-5/6 flex-col">
          <Search />
          <Link href={`/administration/users/${post.data.createdById}`}>
            <Button className="w-full">View profile</Button>
          </Link>
          <div className="flex">
            <PostList
              userId={post.data.createdById}
              postLink="/administration/posts/[postId]"
            />
            <Post postId={postId} />
          </div>
        </div>
        <div className="h-screen w-1/6">
          <ActionButtons
            userId={post.data.createdById}
            conversationLink={`/administration/users/${post.data.createdById}/conversations`}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center">
      <div className="w-3/5">
        <Search />
        <p className="flex w-full items-center justify-center">
          Post not found
        </p>
      </div>
    </div>
  );
}
