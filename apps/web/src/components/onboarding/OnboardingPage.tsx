import { OnboardingStatus } from "@leace/api/src/utils/types";
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { RoleSelection } from "./RoleSelection";

export function OnboardingPage() {
  const router = useRouter();
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: onboardingStatus, isLoading: onboardingStatusIsLoading } =
    trpc.onboarding.getUserOnboardingStatus.useQuery(
      {
        userId: session?.userId ?? "",
      },
      {
        enabled: !!session?.userId,
      },
    );
  const children = useMemo(() => {
    if (!session) return null;

    switch (onboardingStatus) {
      case OnboardingStatus.ROLE_SELECTION: {
        return <RoleSelection userId={session.userId} />;
      }
      case OnboardingStatus.IDENTITY_COMPLETION: {
        return <p>Identity Completion</p>;
      }
      case OnboardingStatus.PREFERENCES_COMPLETION: {
        return <p>Preferences Completion</p>;
      }
      default:
        return null;
    }
  }, [onboardingStatus, session]);

  if (isLoading) return <Loader />;

  if (!session) {
    throw new Error(
      "Cannot onboard a user without session in components/onboarding/OnboardingPage.tsx",
    );
  }

  if (onboardingStatusIsLoading) return <Loader />;

  if (onboardingStatus === OnboardingStatus.COMPLETE) {
    router.push("/");
    return <Loader />;
  }

  return (
    <main className="flex w-full flex-grow flex-col">
      <div className="flex flex-grow flex-col">{children}</div>
    </main>
  );
}
