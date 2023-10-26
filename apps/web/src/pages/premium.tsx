import { PremiumPage as PremiumPageRaw } from "../components/premium/PremiumPage";
import { Loader } from "../components/shared/Loader";
import { LoggedLayout } from "../components/layout/LoggedLayout";
import { RouterOutputs, trpc } from "../utils/trpc";
import { PotentialMatchesTenant } from "../components/premium/PotentialMatchesTenant";
import { Role } from "@prisma/client";
import { PremiumBanner } from "../components/premium/PremiumBanner";
import { useEffect } from "react";
import { useRouter } from "next/router";
import mixpanel from "../utils/mixpanel";

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

export interface PremiumPageProps {
  session: RouterOutputs["auth"]["getSession"];
}

const PremiumPage = ({ session }: PremiumPageProps) => {
  const { data: user, isLoading: userIsLoading } =
    trpc.user.getUserById.useQuery({ userId: session.userId });

  if (userIsLoading) return <Loader />;

  if (!user) return <div>User not found</div>;

  if (!user.isPremium) {
    return <PremiumPageRaw userId={session.userId} />;
  }

  return (
    <div className="flex h-screen w-full flex-grow flex-col">
      <PremiumBanner user={user} />
      {session.role == Role.TENANT && (
        <PotentialMatchesTenant userId={session.userId} />
      )}
    </div>
  );
};
