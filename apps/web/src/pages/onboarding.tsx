import { LoggedLayout } from "../components/layout/LoggedLayout";
import { OnboardingPage } from "../components/onboarding/OnboardingPage";

export default function Page() {
  return (
    <LoggedLayout title="Onboarding" navbar={false}>
      <OnboardingPage />
    </LoggedLayout>
  );
}
