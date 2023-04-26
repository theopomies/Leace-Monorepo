import { useState } from "react";
import { Loader } from "./Loader";
import { Search } from "./Search";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { User } from "./User";
import { Post } from "./Post";
import { Ban } from "./Ban";
import { BanPostAuthor } from "./Ban/BanPostAuthor";

export const Administration = () => {
  const router = useRouter();
  const [uid, setUid] = useState((router.query.id as string) || "");

  const user = trpc.moderation.getUserById.useQuery(uid.toString(), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const post = trpc.moderation.getPostById.useQuery(uid.toString(), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (!uid)
    return (
      <div className="flex w-full justify-center">
        <div className="w-3/5">
          <Search setUid={setUid} />
        </div>
      </div>
    );
  if (user.isLoading || post.isLoading) return <Loader />;
  if (
    (user && user.data && !user.error) ||
    (post && post.data && !post.error)
  ) {
    return (
      <div className="flex w-full">
        <div className="flex w-1/5 items-center justify-center"></div>
        <div className="w-3/5 py-5">
          <Search setUid={setUid} />
          {user.data && <User userId={user.data.id} />}
          {post.data && <Post postId={post.data.id} />}
        </div>
        <div className="flex h-screen w-1/5 flex-col items-center justify-center gap-5 px-10">
          {user.data && <Ban userId={user.data.id} />}
          {post.data && <BanPostAuthor postId={post.data.id} />}
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center">
      <div className="w-3/5">
        <Search setUid={setUid} />
        <p className="flex w-full items-center justify-center">
          User not found
        </p>
      </div>
    </div>
  );
};
