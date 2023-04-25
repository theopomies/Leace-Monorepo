import { PremiumPage as PremiumPageRaw } from "../components/premium/PremiumPage";
import { Loader } from "../components/shared/Loader";
import { LoggedLayout } from "../components/layout/LoggedLayout";
import { trpc } from "../utils/trpc";

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

  if (isLoading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  return <PremiumPageRaw userId={session.userId} />;
};
