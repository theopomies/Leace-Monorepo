import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Dashboard } from "../../components/dashboard/Main";
import { Loader } from "../../components/shared/Loader";

export default function DashboardPage() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: user } = trpc.user.getUserById.useQuery({
    userId: session?.userId ?? "",
  });
  if (isLoading) return <Loader />;

  return (
    <LoggedLayout title="Dashboard | Leace" roles={[Role.AGENCY]}>
      {!!session && <Dashboard user={user} />}
    </LoggedLayout>
  );
}
