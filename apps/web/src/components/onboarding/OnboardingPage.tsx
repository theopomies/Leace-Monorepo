import { trpc } from "../../utils/trpc";

export function OnboardingPage() {
  const { data: session } = trpc.auth.getSession.useQuery();

  if (!session) {
    throw new Error(
      "Cannot onboard a user without session in components/onboarding/OnboardingPage.tsx",
    );
  }

  return (
    <div>
      <h1>OnboardingPage</h1>
    </div>
  );
}
