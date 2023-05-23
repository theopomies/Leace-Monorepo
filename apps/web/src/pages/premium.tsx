import { PremiumPage as PremiumPageRaw } from "../components/premium/PremiumPage";
import { Loader } from "../components/shared/Loader";
import { LoggedLayout } from "../components/layout/LoggedLayout";
import { trpc } from "../utils/trpc";
import { PotentialMatches } from "../components/premium/PotentialMatches";

const Premium = () => {
  return (
    <LoggedLayout title="Premium | Leace">
      <PremiumPage />
    </LoggedLayout>
  );
};

export default Premium;

const PremiumPage = () => {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: me } = trpc.user.getUserById.useQuery({
    userId: session?.userId ?? "",
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  if (!me?.isPremium) {
    return <PremiumPageRaw userId={session.userId} />;
  }

  return <PotentialMatches userId={session.userId} />;
};
