import React from "react";
import { Logs } from "expo";
import { Auth } from "./screens/Auth";
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
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLIC_KEY || ""}
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
