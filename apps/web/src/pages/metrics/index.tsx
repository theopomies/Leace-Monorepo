import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Loader } from "../../components/shared/Loader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import mixpanel from "../../utils/mixpanel";
import { MetricsPage } from "../../components/metrics/MetricsPage";

export default function MetricsIndex() {
  const router = useRouter();
  const { data: session, isLoading: sessionIsLoading } =
    trpc.auth.getSession.useQuery();

  useEffect(() => {
    if (session && !sessionIsLoading) {
      mixpanel.track("Page View", {
        path: router.asPath,
        title: "Metrics Page",
        userId: session?.userId,
      });
    }
  }, [router.asPath, session, sessionIsLoading]);

  if (sessionIsLoading) return <Loader />;

  if (!session) return <div>Not logged in</div>;

  return (
    <LoggedLayout title="Metrics | Leace" roles={[Role.AGENCY, Role.OWNER]}>
      <MetricsPage userId={session.userId} />
    </LoggedLayout>
  );
}
