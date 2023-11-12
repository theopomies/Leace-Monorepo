import { LoggedLayout } from "../components/layout/LoggedLayout";
import { Home } from "../components/home/Home";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import mixpanel from "../utils/mixpanel";
import { Loader } from "../components/shared/Loader";

const Index = () => {
  const { data: session, isLoading: sessionIsLoading } =
    trpc.auth.getSession.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (session && !sessionIsLoading) {
      mixpanel.track("Page View", {
        path: router.asPath,
        title: "Home Page",
        userId: session.userId,
      });
    }
  }, [router.asPath, session, sessionIsLoading]);

  if (sessionIsLoading) return <Loader />;

  return (
    <LoggedLayout title="Home | Leace">
      {session && <Home session={session} />}
    </LoggedLayout>
  );
};

export default Index;
