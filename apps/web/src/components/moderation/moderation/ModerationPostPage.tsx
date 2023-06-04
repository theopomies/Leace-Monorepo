import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Button } from "../../shared/button/Button";
import { PostList } from "../posts/PostList";
import { Post } from "../posts";
import { ActionButtons } from "../ActionButtons";

export function ModeratioPostPage({
  reportId,
  postId,
}: {
  reportId: string;
  postId: string;
}) {
  const post = trpc.moderation.post.getPostById.useQuery(postId);

  if (post.isLoading) return <Loader />;
  if (post && post.data && !post.error) {
    return (
      <div className="flex w-full">
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
            <Post postId={postId} />
          </div>
        </div>
        <div className="h-screen w-1/6">
          <ActionButtons
            reportId={reportId}
            userId={post.data.createdById}
            conversationLink={`/moderation/reports/${reportId}/users/${post.data.createdById}/conversations`}
          />
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
