import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { UserRoles } from "../utils/enum";

import { Tenant, Provider } from "../components/Navigation";
import { Loading } from "../components/Loading";
import { trpc } from "../../../web/src/utils/trpc";

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
  Portal: {
    leaseId?: string;
    relationshipId?: string;
    firstName?: string | null;
    lastName?: string | null;
  };

  Lease: { relationshipId: string };
  UpdateLease: { relationshipId: string; leaseId: string };

  Offer: undefined;
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
    return <Loading />;
  }

  if (role === UserRoles.TENANT) {
    return <Tenant role={role} />;
  }
  return <Provider role={role} userId={session?.userId as string} />;
};

export default TabNavigator;
