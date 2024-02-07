import "react-native-gesture-handler";

import React from "react";
import { Logs } from "expo";
import { Auth } from "./screens/Auth";
import Constants from "expo-constants";
import { LogBox, StatusBar } from "react-native";
import { tokenCache } from "./utils/cache";
import { TRPCProvider } from "./utils/trpc";
import { RootNavigator } from "./navigation";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";

import { SafeAreaProvider } from "react-native-safe-area-context";

LogBox.ignoreAllLogs();

Logs.disableExpoCliLogging();

export const App = () => {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <SignedIn>
        <TRPCProvider>
          <SafeAreaProvider>
            <RootNavigator />
          </SafeAreaProvider>
        </TRPCProvider>
      </SignedIn>
      <SignedOut>
        <Auth />
      </SignedOut>
    </ClerkProvider>
  );
};
