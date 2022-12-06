import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import { ProfileScreen } from "../screens/ProfileScreen/ProfileScreen";
import { MatchScreen } from "../screens/MatchScreen/MatchScreen";
import { StackScreen } from "../screens/StackScreen/StackScreen";

export type TabStackParamList = {
  Connexion: undefined;
  Profile: { userEmail: string };
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
    <Tab.Navigator >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="StackScrenn" component={StackScreen} />
      <Tab.Screen name="MatchScrenn" component={MatchScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
