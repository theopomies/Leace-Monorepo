import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Button } from "../../shared/button/Button";
import Link from "next/link";
import { User } from "../users";
import { ActionButtons } from "../ActionButtons";

export function ModerationUserPage({
  reportId,
  userId,
}: {
  reportId: string;
  userId: string;
}) {
  const user = trpc.moderation.user.getUserById.useQuery(userId);

  if (user.isLoading) return <Loader />;
  if (user && user.data && !user.error) {
    return (
      <div className="flex w-full flex-grow overflow-auto pl-10">
        <div className="flex w-5/6 flex-grow flex-col py-10">
          {user.data.posts[0] && (
            <Link
              href={`/moderation/reports/${reportId}/posts/${user.data.posts[0].id}`}
              className="pb-5"
            >
              <Button className="w-full">View posts</Button>
            </Link>
          )}
          <User userId={userId} />
        </div>
        <div className="flex w-1/6 flex-grow justify-center">
          <div className="fixed flex h-screen items-center">
            <ActionButtons
              reportId={reportId}
              userId={userId}
              conversationLink={`/moderation/reports/${reportId}/users/${userId}/conversations`}
            />
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
