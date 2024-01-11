import React from "react";
import { ClerkLoaded } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import { trpc } from "../utils/trpc";
import { Role, Lease } from "@leace/db";
import { Loading } from "../components/Loading";
import Toast from "react-native-toast-message";
import { OnBoarding } from "../screens/OnBoarding";
import TenantTabs from "./TenantTabs";
import OwnerTabs from "./OwnerTabs";

export type TabStackParamList = {
  Profile: { userId: string; editable?: boolean };
  ViewProfile: { userId: string; editable?: boolean };
  Stack: { userId: string };
  MatchTenant: { userId: string; role: "TENANT" | "OWNER" | "AGENCY" };

  CreatePost: { userId: string };

  Premium: { userId: string };

  Likes: {
    subscriptionId: string;
  };

  PaymentResults: {
    isValidPayment: boolean;
    amount: number;
    product: string;
    subscriptionId: string;
    userId: string;
  };

  EditProfile: {
    userId: string;
    data: string;
    showAttrs: boolean;
  };

  PostInfo: {
    userId: string;
    postId: string;
    editable: boolean;
  };

  MyPosts: {
    userId: string;
  };

  EditPost: {
    userId: string;
    data: string;
  };

  ChatTenant: {
    role: "TENANT" | "OWNER" | "AGENCY";
    tenantId: string;
    ownerId: string;
    conversationId: string;
    userId: string;
    lease: Lease | null;
    relationshipId: string;
  };

  Documents: { userId: string };
  Settings: undefined;
  PostReviews: undefined;
  UsersReviews: undefined;

  OwnerDashboard: {
    userId: string;
  };

  OwnerDashboardScreens: {
    userId: string;
    role: Role;
  };
  OwnerChatScreens: {
    userId: string;
    role: Role;
  };
  OwnerProfileScreens: {
    userId: string;
    role: Role;
  };
  OwnerStackScreens: { userId: string; role: Role };

  TenantStackScreens: { userId: string; role: Role };
  TenantPremiumScreens: { userId: string; role: Role };
};

const RootNavigator = () => {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: onboarding, isLoading: onboardingLoading } =
    trpc.onboarding.getUserOnboardingStatus.useQuery(
      { userId: session?.userId as string },
      { enabled: !!session?.userId },
    );
  if (isLoading) return <Loading />;
  if (!session) return <Loading signOut={true} />;
  if (onboardingLoading) return <Loading />;
  if (onboarding !== "COMPLETE")
    return <OnBoarding apiStep={onboarding} role={session.role} />;

  if (session.role === "TENANT") {
    return (
      <>
        <NavigationContainer>
          <ClerkLoaded>
            <TenantTabs userId={session.userId} role={session.role} />
          </ClerkLoaded>
        </NavigationContainer>
        <Toast />
      </>
    );
  }
  return (
    <>
      <NavigationContainer>
        <ClerkLoaded>
          <OwnerTabs userId={session.userId} role={session.role} />
        </ClerkLoaded>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default RootNavigator;
