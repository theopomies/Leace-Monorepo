import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ConnexionScreen } from "../screens/ConnexionScreen/ConnexionScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import { useNavigation } from "@react-navigation/native";

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
    </Tab.Navigator>
  );
};

export default TabNavigator;
