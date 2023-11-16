import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Search } from "./Search";
import { Button } from "../../shared/button/Button";
import Link from "next/link";
import { User } from "../users";
import { ActionButtons } from "../ActionButtons";

export function AdminUserPage({ userId }: { userId: string }) {
  const user = trpc.moderation.user.getUserById.useQuery(userId);

  if (user.isLoading) return <Loader />;
  if (user && user.data && !user.error) {
    return (
      <div className="flex w-full flex-grow overflow-auto pl-10">
        <div className="flex w-5/6 flex-grow flex-col gap-5 py-5">
          <Search />
          {user.data.posts[0] && (
            <Link href={`/administration/posts/${user.data.posts[0].id}`}>
              <Button className="w-full">View posts</Button>
            </Link>
          )}
          <User userId={userId} />
        </div>
        <div className="flex w-1/6 flex-grow justify-center">
          <div className="fixed flex h-screen items-center">
            <ActionButtons
              userId={userId}
              conversationLink={`/administration/users/${userId}/conversations`}
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
          User not found
        </p>
      </div>
    </div>
  );
}
