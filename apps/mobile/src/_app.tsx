import React from "react";
import { Logs } from "expo";
import { Auth } from "./screens/Auth";
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
      publishableKey={`pk_test_Y2VydGFpbi1jcmFiLTU0LmNsZXJrLmFjY291bnRzLmRldiQ`}
      tokenCache={tokenCache}
    >
      <SignedIn>
        <TRPCProvider>
          <SafeAreaProvider>
            <StatusBar />
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
