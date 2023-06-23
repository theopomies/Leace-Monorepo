import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { MatchesPage } from "../../../../components/matches/MatchesPage";
import { useRouter } from "next/router";

const Matches = () => {
  const router = useRouter();
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
