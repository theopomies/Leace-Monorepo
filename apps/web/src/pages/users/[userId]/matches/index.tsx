import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { MatchesPage } from "../../../../components/matches/MatchesPage";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import { useEffect } from "react";
import mixpanel from "../../../../utils/mixpanel";

const Matches = () => {
  const router = useRouter();

  const { data: session } = trpc.auth.getSession.useQuery();

  useEffect(() => {
    mixpanel.track("Page View", {
      path: router.asPath,
      title: "Matches Page",
      userId: session?.userId,
    });
  }, [router.asPath, session?.userId]);

  const { userId } = router.query;

  if (typeof userId != "string" || !userId) {
    return <div>UserId is required</div>;
  }

  return (
    <LoggedLayout title="Mes Matchs">
      <MatchesPage userId={userId} />
    </LoggedLayout>
  );
};

export default Matches;
