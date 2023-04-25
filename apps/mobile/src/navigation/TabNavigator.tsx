import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { UserRoles } from '../utils/enum';

import { trpc } from "../utils/trpc";
import { Tenant, Provider } from "../components/Navigation";
import { View, ActivityIndicator } from "react-native";

export type TabStackParamList = {
  Role: undefined;
  Profile: undefined;
  Stack: undefined;
  Match: undefined;
  Dashboard: undefined;

  Notifications: undefined;

  MatchChat: undefined;

  CreatePost: undefined;
  CreatePostAttributes: { postId: string };
  ViewPost: undefined;
  PostDetails: { postId: string };

  Expenses: undefined;
  Income: undefined;
  Clients: undefined;
  Occupied: undefined;
  Available: undefined;
  Chat: undefined;
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
      setRole(session?.role as keyof typeof UserRoles);

    };

    getSession();
  }, [session]);

  if (!session && !role) {
    return <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={"#002642"} />
    </View>;
  }

  if (role === UserRoles.TENANT) {
    return <Tenant role={role} />
  }

  return <Provider role={role} />
};

export default TabNavigator;
