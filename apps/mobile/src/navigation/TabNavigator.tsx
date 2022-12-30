import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import { ProfileScreen } from "../screens/ProfileScreen/ProfileScreen";
import { MatchScreen } from "../screens/MatchScreen/MatchScreen";
import { StackScreen } from "../screens/StackScreen/StackScreen";
import { DashboardScreen } from "../screens/DashboardScreen/DashboardScreen";

export type TabStackParamList = {
  Connexion: undefined;
  Profile: { userEmail: string };
  StackScreen: undefined;
  MatchScreen: undefined;
};

const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="StackScreen" component={StackScreen} />
      <Tab.Screen name="MatchScreen" component={MatchScreen} />
      <Tab.Screen name="DashboardScreen" component={DashboardScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
