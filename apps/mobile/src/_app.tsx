import React from "react";
import { Logs } from "expo";
import { Auth } from "./screens/Auth";
import Constants from "expo-constants";
import { StatusBar } from "react-native";
import { tokenCache } from "./utils/cache";
import { TRPCProvider } from "./utils/trpc";
import { RootNavigator } from "./navigation";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";

import { SafeAreaProvider } from "react-native-safe-area-context";

Logs.disableExpoCliLogging();

export const App = () => {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SignedIn>
        <TRPCProvider>
          <SafeAreaProvider>
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
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
