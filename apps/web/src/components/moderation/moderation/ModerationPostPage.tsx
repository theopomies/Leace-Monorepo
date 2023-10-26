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
      <div className="flex w-full flex-grow pl-10">
        <div className="flex w-5/6 flex-grow flex-col py-10">
          <Link
            href={`/moderation/reports/${reportId}/users/${post.data.createdById}`}
            className="pb-5"
          >
            <Button className="w-full">View profile</Button>
          </Link>
          <div className="flex flex-grow gap-5 overflow-hidden">
            <div className="w-1/4 overflow-auto">
              <PostList
                userId={post.data.createdById}
                postId={postId}
                postLink={`/moderation/reports/${reportId}/posts/[postId]`}
              />
            </div>
            <Post postId={postId} />
          </div>
        </div>
        <div className="h-full w-1/6">
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
