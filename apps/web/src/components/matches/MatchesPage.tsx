import { Role } from "@prisma/client";
import { Header } from "../shared/Header";
import { UserList } from "../users/UserList";
import { PostList } from "../posts/PostList";
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";

export interface MatchesPageProps {
  userId: string;
}

export function MatchesPage({ userId }: MatchesPageProps) {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  const role = session.role;

  return (
    <div className="w-full">
      <Header heading="My Matches" />
      {role == Role.TENANT && <PostList userId={userId} />}
      {(role == Role.OWNER || role == Role.AGENCY) && (
        <UserList userId={userId} />
      )}
    </div>
  );
}
