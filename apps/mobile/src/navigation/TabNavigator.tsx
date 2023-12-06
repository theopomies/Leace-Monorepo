import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserRoles } from "../utils/enum";
import { trpc } from "../utils/trpc";
//import { Tenant, Provider } from "../components/Navigation";
import { View, Platform, StatusBar } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Lease } from "@leace/db";
import Role from "../screens/Role";
import { Loading } from "../components/Loading";
import { Btn } from "../components/Btn";

export type TabStackParamList = {
  Profile: { userId: string };
  Stack: { userId: string };
  MatchTenant: { userId: string; role: "TENANT" | "OWNER" | "AGENCY" };

  CreatePost: { userId: string };

  Premium: undefined;
  Likes: undefined;
  PaymentDetails: { selectedProduct: any; makePayment: boolean };

  PaymentResults: {
    loading: boolean;
    paymentStatus: boolean;
    response: any;
    selectedProduct: any;
  };

  EditProfile: {
    userId: string;
    data: string;
    showAttrs: boolean;
  };
  
  EditProfileRefacto: {
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
};

const TabNavigator = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [role, setRole] = useState<keyof typeof UserRoles | null>(null);
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: user } = trpc.user.getUserById.useQuery(
    {
      userId: session?.userId as string,
    },
    { enabled: !!session?.userId },
  );

  const isPremium = user?.isPremium as boolean;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    const getSession = async () => {
      if (session) setRole(session.role as keyof typeof UserRoles);
    };
    getSession();
  }, [session, isPremium]);

  if (isLoading) return <Loading />;

  if (!session) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <Btn
          title="Sign Out"
          onPress={() => signOut()}
          iconName="arrow-back-ios"
          iconType="material-icons"
        />
      </View>
    );
  }

  /* if (role === UserRoles.TENANT)
    return <Tenant userId={session.userId} isPremium={isPremium} />;
  else if (role === UserRoles.OWNER)
    return <Provider userId={session.userId} isPremium={isPremium} />;
  return <Role />; */
};

export default TabNavigator;
