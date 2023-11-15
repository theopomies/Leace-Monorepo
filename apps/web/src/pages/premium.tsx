import { Loader } from "../components/shared/Loader";
import { LoggedLayout } from "../components/layout/LoggedLayout";
import { trpc } from "../utils/trpc";
import { useEffect } from "react";
import { useRouter } from "next/router";
import mixpanel from "../utils/mixpanel";
import { PremiumPage } from "../components/premium/PremiumPage";

const Premium = () => {
  const router = useRouter();
  const { data: session, isLoading: sessionIsLoading } =
    trpc.auth.getSession.useQuery();

  useEffect(() => {
    if (session && !sessionIsLoading) {
      mixpanel.track("Page View", {
        path: router.asPath,
        title: "Premium Page",
        userId: session?.userId,
      });
    }
  }, [router.asPath, session, sessionIsLoading]);

  if (sessionIsLoading) return <Loader />;

  if (!session) return <div>Not logged in</div>;

  return (
    <LoggedLayout title="Premium | Leace">
      <PremiumPage session={session} />
    </LoggedLayout>
  );
};

export default Premium;
