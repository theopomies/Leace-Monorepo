import { PremiumPage as PremiumPageRaw } from "../components/premium/PremiumPage";
import { Loader } from "../components/shared/Loader";
import { LoggedLayout } from "../components/layout/LoggedLayout";
import { trpc } from "../utils/trpc";
import { PotentialMatchesAgencyOwner } from "../components/premium/PotentialMatchesAgencyOwner";
import { PotentialMatchesTenant } from "../components/premium/PotentialMatchesTenant";
import { Role } from "@prisma/client";
import { Header } from "../components/shared/Header";
import { PremiumBanner } from "../components/premium/PremiumBanner";
import { useEffect } from "react";
import { useRouter } from "next/router";
import mixpanel from "../utils/mixpanel";

const Premium = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const router = useRouter();

  useEffect(() => {
    mixpanel.track("Page View", {
      path: router.asPath,
      title: "Premium Page",
      userId: session?.userId,
    });
  }, [router.asPath, session?.userId]);

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

  return (
    <div className="w-full">
      <PremiumBanner user={me} />
      <Header heading="Potential Matches" />
      {role == Role.TENANT && (
        <PotentialMatchesTenant userId={session.userId} />
      )}
      {(role == Role.OWNER || role == Role.AGENCY) && (
        <PotentialMatchesAgencyOwner userId={session.userId} />
      )}
    </div>
  );
};
