import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Loader } from "../../components/shared/Loader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import mixpanel from "../../utils/mixpanel";
import { DashboardPage } from "../../components/dashboard/DashboardPage";

export default function DashboardIndex() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  useEffect(() => {
    mixpanel.track("Page View", {
      path: router.asPath,
      title: "Dashboard Page",
      userId: session?.userId,
    });
  }, [router.asPath, session?.userId]);

  if (isLoading) return <Loader />;

  return (
    <LoggedLayout title="Dashboard | Leace" roles={[Role.AGENCY, Role.OWNER]}>
      {!!session && <DashboardPage userId={session.userId} />}
    </LoggedLayout>
  );
}
