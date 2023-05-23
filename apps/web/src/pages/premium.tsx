import { PremiumPage as PremiumPageRaw } from "../components/premium/PremiumPage";
import { Loader } from "../components/shared/Loader";
import { LoggedLayout } from "../components/layout/LoggedLayout";
import { trpc } from "../utils/trpc";
import { PotentialMatchesAgencyOwner } from "../components/premium/PotentialMatchesAgencyOwner";
import { PotentialMatchesTenant } from "../components/premium/PotentialMatchesTenant";
import { Role } from "@prisma/client";

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
  const role = session?.role;
  if (isLoading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  if (!me?.isPremium) {
    return <PremiumPageRaw userId={session.userId} />;
  }
  if (role == Role.OWNER || role == Role.AGENCY) {
    return <PotentialMatchesAgencyOwner userId={session.userId} />;
  }
  return <PotentialMatchesTenant userId={session.userId} />;
};
