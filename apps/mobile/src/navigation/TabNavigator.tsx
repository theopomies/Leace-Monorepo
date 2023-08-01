import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserRoles } from "../utils/enum";
import { trpc } from "../utils/trpc";
import { Tenant, Provider } from "../components/Navigation";
import { View, Platform, StatusBar } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Btn } from "../components/Btn";
import Loading from "../components/Loading";
import Role from "../screens/Role";

export type TabStackParamList = {
  Role: undefined;
  Profile: { userId: string };
  Stack: { userId: string };
  MatchTenant: { userId: string; role: "TENANT" | "OWNER" | "AGENCY" };
  MatchOwner: { userId: string; role: "TENANT" | "OWNER" | "AGENCY" };
  Dashboard: { userId: string };

  Notifications: undefined;

  MatchChat: { id: string };

  CreatePost: { userId: string };
  CreatePostAttributes: { postId: string; userId: string };
  ViewPost: { userId: string };
  PostDetails: { postId: string; userId: string };

  Expenses: { userId: string };
  Income: { userId: string };
  Clients: { userId: string };
  Occupied: { userId: string };
  Available: { userId: string };
  Chat: { userId: string };
  Portal: { userId: string; relationshipId: string; leaseId: string };

  Lease: { userId: string; relationshipId: string };
  UpdateLease: { userId: string; relationshipId: string; leaseId: string };

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
  };
};

const TabNavigator = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [role, setRole] = useState<keyof typeof UserRoles | null>(null);
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    const getSession = async () => {
      if (session) setRole(session.role as keyof typeof UserRoles);
    };
    getSession();
  }, [session]);

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <Loading />
      </View>
    );
  }

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

  if (!role) return <Role />;
  if (role === UserRoles.TENANT) return <Tenant userId={session.userId} />;
  return <Provider userId={session.userId} />;
};

export default TabNavigator;
