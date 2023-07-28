import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { UserPage } from "../../../components/users/UserPage";
import { trpc } from "../../../utils/trpc";
import { useEffect } from "react";
import mixpanel from "../../../utils/mixpanel";

const Index = () => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  useEffect(() => {
    mixpanel.track("pageview", {
      path: router.asPath,
      title: "Profile Page",
      userId: session?.userId,
    });
  }, [router.asPath, session?.userId]);

  const { userId } = router.query;

  if (typeof userId == "object") return <div>Multiple ids are invalid.</div>;

  if (!userId) return <div>UserId is necessary</div>;

  return (
    <LoggedLayout title="Profile Page | Leace">
      <UserPage userId={userId} />
    </LoggedLayout>
  );
};

export default Index;
