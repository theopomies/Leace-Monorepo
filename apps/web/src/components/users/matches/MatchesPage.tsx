import { Role } from "@prisma/client";
import { Header } from "../Header";
import { TenantList } from "../TenantList";
import { PostList } from "../PostList";
import { trpc } from "../../../utils/trpc";

export interface MatchesPageProps {
  userId: string;
}

export function MatchesPage({ userId }: MatchesPageProps) {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  const role = session.role;

  return (
    <div className="w-full">
      <Header heading="My Matches" />
      {role == Role.TENANT && <TenantList userId={userId} />}
      {(role == Role.OWNER || role == Role.AGENCY) && (
        <PostList userId={userId} />
      )}
    </div>
  );
}
