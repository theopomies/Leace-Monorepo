import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Search } from "../Search";
import { BanPostAuthor } from "../ban/BanPostAuthor";
import { Post } from "../post";

export function AdminPostPage({ postId }: { postId: string }) {
  const user = trpc.moderation.post.getPostById.useQuery(postId, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (user.isLoading) return <Loader />;
  if (user && user.data && !user.error) {
    return (
      <div className="flex w-full">
        <div className="flex w-1/5 items-center justify-center"></div>
        <div className="w-3/5 py-5">
          <Search />
          {user.data && <Post postId={postId} />}
        </div>
        <div className="flex h-screen w-1/5 flex-col items-center justify-center gap-5 px-10">
          {user.data && <BanPostAuthor postId={postId} />}
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center">
      <div className="w-3/5">
        <Search />
        <p className="flex w-full items-center justify-center">
          User not found
        </p>
      </div>
    </div>
  );
}
