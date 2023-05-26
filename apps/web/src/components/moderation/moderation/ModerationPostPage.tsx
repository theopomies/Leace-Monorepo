import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Button } from "../../shared/button/Button";
import { PostList } from "../post/PostList";
import { PostCard } from "../post/PostCard";
import { Report } from "../report";

export function ModeratioPostPage({
  reportId,
  postId,
}: {
  reportId: string;
  postId: string;
}) {
  const post = trpc.moderation.post.getPostById.useQuery(postId, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (post.isLoading) return <Loader />;
  if (post && post.data && !post.error) {
    return (
      <div className="flex w-full py-5">
        <div className="flex w-5/6 flex-col">
          <Link
            href={`/moderation/reports/${reportId}/users/${post.data.createdById}`}
          >
            <Button className="w-full">View profile</Button>
          </Link>
          <div className="flex">
            <PostList
              userId={post.data.createdById}
              postLink={`/moderation/reports/${reportId}/posts/[postId]`}
            />
            <PostCard postId={postId} />
          </div>
        </div>
        <div className="my-auto h-screen w-1/6">
          <Report reportId={reportId} postId={postId} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full items-center justify-center">
      <p>Post not found</p>
    </div>
  );
}
