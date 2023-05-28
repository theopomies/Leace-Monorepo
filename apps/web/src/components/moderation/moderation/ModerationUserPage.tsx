import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Button } from "../../shared/button/Button";
import Link from "next/link";
import { UserCard } from "../user/UserCard";
import { Report } from "../report";

export function ModerationUserPage({
  reportId,
  userId,
}: {
  reportId: string;
  userId: string;
}) {
  const user = trpc.moderation.user.getUserById.useQuery(userId, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (user.isLoading) return <Loader />;
  if (user && user.data && !user.error) {
    return (
      <div className="flex w-full">
        <div className="flex w-5/6 flex-col">
          {user.data.posts[0] && (
            <Link
              href={`/moderation/reports/${reportId}/posts/${user.data.posts[0].id}`}
            >
              <Button className="w-full">View posts</Button>
            </Link>
          )}
          <UserCard userId={userId} />
        </div>
        <div className="h-screen w-1/6">
          <div className="flex h-full flex-col items-center justify-center gap-4 px-2">
            <Link
              href={`/moderation/reports/${reportId}/users/${userId}/conversations`}
            >
              <Button theme="primary">View conversations</Button>
            </Link>
            <div className="w-full border-b border-black" />
            <Report userId={userId} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full items-center justify-center">
      <p>User not found</p>
    </div>
  );
}
