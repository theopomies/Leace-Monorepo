import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { UserPage } from "../../../components/users/UserPage";
import { trpc } from "../../../utils/trpc";
import { useEffect } from "react";
import mixpanel from "../../../utils/mixpanel";
import { Loader } from "../../../components/shared/Loader";

const Index = () => {
  const router = useRouter();
  const { data: session, isLoading: sessionIsLoading } =
    trpc.auth.getSession.useQuery();

  useEffect(() => {
    if (session && !sessionIsLoading) {
      mixpanel.track("Page View", {
        path: router.asPath,
        title: "Profile Page",
        userId: session.userId,
      });
    }
  }, [router.asPath, session, sessionIsLoading]);

  if (sessionIsLoading) return <Loader />;

  if (!session) return <div>Not logged in</div>;

  const { userId } = router.query;

  if (typeof userId == "object") return <div>Multiple ids are invalid.</div>;

  if (!userId) return <div>UserId is necessary</div>;

  return (
    <LoggedLayout title="Profile Page | Leace">
      <UserPage sessionUserId={session.userId} userId={userId} />
    </LoggedLayout>
  );
};

export default Index;
