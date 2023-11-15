import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";

export function OnboardingPage() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: user } = trpc.user.getUserById.useQuery(
    {
      userId: session?.userId ?? "",
    },
    {
      enabled: !!session?.userId,
    },
  );

  if (isLoading) return <Loader />;

  if (!session) {
    throw new Error(
      "Cannot onboard a user without session in components/onboarding/OnboardingPage.tsx",
    );
  }

  if (!user) {
    return <Loader />;
  }

  return (
    <div>
      <h1>OnboardingPage</h1>
    </div>
  );
}
