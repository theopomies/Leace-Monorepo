import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Loader } from "../../components/shared/Loader";
import { DashboardPage } from "../../components/dashboard/DashboardPage";

export default function DashboardIndex() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) return <Loader />;

  return (
    <LoggedLayout title="Dashboard | Leace" roles={[Role.AGENCY, Role.OWNER]}>
      {!!session && <DashboardPage userId={session.userId} />}
    </LoggedLayout>
  );
}
