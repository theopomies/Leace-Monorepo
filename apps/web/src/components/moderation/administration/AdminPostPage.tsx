import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Button } from "../../shared/button/Button";
import { Search } from "./Search";
import { PostList } from "../posts/PostList";
import { Post } from "../posts";
import { ActionButtons } from "../ActionButtons";

export function AdminPostPage({ postId }: { postId: string }) {
  const post = trpc.moderation.post.getPostById.useQuery(postId);

  if (post.isLoading) return <Loader />;
  if (post && post.data && !post.error) {
    return (
      <div className="flex w-full flex-grow pl-10">
        <div className="flex w-5/6 flex-grow flex-col gap-5 py-5">
          <Search />
          <Link href={`/administration/users/${post.data.createdById}`}>
            <Button className="w-full">View profile</Button>
          </Link>
          <div className="flex flex-grow gap-5 overflow-hidden">
            <div className="w-1/4 overflow-auto">
              <PostList
                userId={post.data.createdById}
                postId={postId}
                postLink="/administration/posts/[postId]"
              />
            </div>
            <Post postId={postId} />
          </div>
        </div>
        <div className="flex w-1/6 flex-grow justify-center">
          <div className="fixed flex h-screen items-center">
            <ActionButtons
              userId={post.data.createdById}
              isCertified={post.data.certified}
              postId={postId}
              conversationLink={`/administration/users/${post.data.createdById}/conversations`}
            />
          </div>
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
