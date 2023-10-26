import React from "react";
import { Auth } from "../screens/Auth";
import TabNavigator from "./TabNavigator";
import { ClerkLoaded, useUser } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const RootStack = createNativeStackNavigator();

const StackNav = () => {
  const { isSignedIn } = useUser();

  return (
    <RootStack.Navigator>
      {isSignedIn ? (
        <RootStack.Screen name="App" component={TabNavigator} />
      ) : (
        <>
          <RootStack.Screen name="Welcome" component={Auth} />
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
