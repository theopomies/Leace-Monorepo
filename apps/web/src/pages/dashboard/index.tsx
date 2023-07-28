import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Loader } from "../../components/shared/Loader";
import { Dashboard } from "../../components/dashboard/Dashboard";
import { useRouter } from "next/router";
import { useEffect } from "react";
import mixpanel from "../../utils/mixpanel";

export default function DashboardPage() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  useEffect(() => {
    mixpanel.track("pageview", {
      path: router.asPath,
      title: "Dashboard Page",
      userId: session?.userId,
    });
  }, [router.asPath, session?.userId]);

  if (isLoading) return <Loader />;

  return (
    <LoggedLayout title="Dashboard | Leace" roles={[Role.AGENCY, Role.OWNER]}>
      {!!session && <Dashboard userId={session.userId} />}
    </LoggedLayout>
  );
}
