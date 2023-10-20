import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Post } from "../posts";
import { ActionButtons } from "../ActionButtons";

export function CertificationPostPage({ postId }: { postId: string }) {
  const post = trpc.moderation.post.getPostById.useQuery(postId);

  if (post.isLoading) return <Loader />;
  if (post && post.data && !post.error) {
    return (
      <div className="flex w-full flex-grow pl-10">
        <div className="flex w-5/6 flex-grow py-10">
          <Post postId={postId} />
        </div>
        <div className="h-full w-1/6">
          <ActionButtons userId={post.data.createdById} postId={postId} />
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
