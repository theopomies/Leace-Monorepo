import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Loader } from "../../components/shared/Loader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import mixpanel from "../../utils/mixpanel";
import { DashboardPage } from "../../components/dashboard/DashboardPage";

export default function DashboardIndex() {
  const router = useRouter();
  const { data: session, isLoading: sessionIsLoading } =
    trpc.auth.getSession.useQuery();

  useEffect(() => {
    if (session && !sessionIsLoading) {
      mixpanel.track("Page View", {
        path: router.asPath,
        title: "Dashboard Page",
        userId: session?.userId,
      });
    }
  }, [router.asPath, session, sessionIsLoading]);

  if (sessionIsLoading) return <Loader />;

  if (!session) return <div>Not logged in</div>;

  return (
    <LoggedLayout title="Dashboard | Leace" roles={[Role.AGENCY, Role.OWNER]}>
      <DashboardPage userId={session.userId} />
    </LoggedLayout>
  );
}
