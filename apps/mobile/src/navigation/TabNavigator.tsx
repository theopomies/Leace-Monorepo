import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { UserRoles } from "../utils/enum";

import { trpc } from "../utils/trpc";
import { Tenant, Provider } from "../components/Navigation";
import { View, ActivityIndicator } from "react-native";
import { Button } from "../components/Button";
import { useAuth } from "@clerk/clerk-expo";

const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
        color={"custom"}
      />
    </View>
  );
};

export type TabStackParamList = {
  Role: undefined;
  Profile: { userId: string };
  Stack: { userId: string };
  Match: undefined;
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
};

const TabNavigator = () => {
  const navigation = useNavigation();

  const [role, setRole] = useState<keyof typeof UserRoles | null>(null);

  const { data: session } = trpc.auth.getSession.useQuery();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const getSession = async () => {
      if (session) {
        setRole(session.role as keyof typeof UserRoles);
      }
    };

    getSession();
  }, [session]);

  if (!session && !role) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={"#002642"} />

        <SignOut />
      </View>
    );
  }

  if (role === UserRoles.TENANT) {
    return <Tenant role={role} userId={session?.userId as string} />;
  }
  return <Provider role={role} userId={session?.userId as string} />;
};

export default TabNavigator;
