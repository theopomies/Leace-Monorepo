import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AuthScreen from "../screens/auth";
import { ClerkLoaded, useUser } from "@clerk/clerk-expo"

export type RootStackParamList = {
  Main: undefined;
  Model: undefined;
};

const RootStack = createNativeStackNavigator();

const StackNav = () => {
  const { isSignedIn: signedIn } = useUser();

  return (
    <RootStack.Navigator>
      {signedIn ? (
        <RootStack.Screen name="App" component={TabNavigator} />
      ) : (
        <>
          <RootStack.Screen name="Welcome" component={AuthScreen} />
        </>
      )}
    </RootStack.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <ClerkLoaded>
        <StackNav />
      </ClerkLoaded>
    </NavigationContainer>
  );
};

export default RootNavigator;
