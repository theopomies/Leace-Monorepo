import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Dashboard } from "../../components/dashboard/Dashboard";
import { Loader } from "../../components/shared/Loader";

export default function TestNewDashboard() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) return <Loader />;
  return (
    <LoggedLayout title="Dashboard | Leace" roles={[Role.AGENCY]}>
      {!!session && <Dashboard userId={session.userId} />}
    </LoggedLayout>
  );
}
