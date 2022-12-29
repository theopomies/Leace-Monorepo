import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import { ProfileScreen } from "../screens/ProfileScreen/ProfileScreen";
import { MatchScreen } from "../screens/MatchScreen/MatchScreen";
import { StackScreen } from "../screens/StackScreen/StackScreen";
import { CreateAdScreen } from "../screens/AdScreen/CreateAdScreen";
import { ViewAdScreen } from "../screens/AdScreen/ViewAdScreen";
import { AdDetailsScreen } from "../screens/AdScreen/AdDetailsScreen";


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
      <Tab.Screen name="CreateAdScreen" component={CreateAdScreen} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="ViewAdScreen" component={ViewAdScreen} options={{ tabBarButton: () => null, headerShown: false }} />
      <Tab.Screen name="AdDetailsScreen" component={AdDetailsScreen} options={{ tabBarButton: () => null, headerShown: false }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
