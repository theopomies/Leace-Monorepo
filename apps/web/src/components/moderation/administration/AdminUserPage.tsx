import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Search } from "../Search";
import { Ban } from "../ban";
import { Button } from "../../shared/button/Button";
import Link from "next/link";
import { UserCard } from "../user/UserCard";

export function AdminUserPage({ userId }: { userId: string }) {
  const user = trpc.moderation.user.getUserById.useQuery(userId, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (user.isLoading) return <Loader />;
  if (user && user.data && !user.error) {
    return (
      <div className="w-full">
        <Search />
        {user.data.posts[0] && (
          <Link href={`/administration/posts/${user.data.posts[0].id}`}>
            <Button className="w-full">View posts</Button>
          </Link>
        )}
        <div className="flex py-5">
          <div className="flex w-5/6">
            {user.data && <UserCard userId={userId} />}
          </div>
          <div className="my-auto h-screen w-1/6">
            {user.data && <Ban userId={userId} />}
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
          User not found
        </p>
      </div>
    </div>
  );
}
