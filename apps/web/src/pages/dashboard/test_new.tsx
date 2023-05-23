import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { TestNew } from "../../components/dashboard/TestNew";
import { Loader } from "../../components/shared/Loader";

export default function TestNewDashboard() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) return <Loader />;
  return (
    <LoggedLayout title="New Dashboard | Leace" roles={[Role.AGENCY]}>
      {!!session && <TestNew userId={session.userId} />}
    </LoggedLayout>
  );
}
