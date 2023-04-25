import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TRPCProvider } from "./utils/trpc";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import RootNavigator from "./navigation/RootNavigator";
import { tokenCache } from "./utils/cache";
import AuthScreen from "./screens/auth";

export const App = () => {
  return (
    <ClerkProvider
      publishableKey="pk_test_Y2VydGFpbi1jcmFiLTU0LmNsZXJrLmFjY291bnRzLmRldiQ"
      tokenCache={tokenCache}
    >
      <SignedIn>
        <TRPCProvider>
          <SafeAreaProvider>
            <RootNavigator />
            <StatusBar />
          </SafeAreaProvider>
        </TRPCProvider>
      </SignedIn>
      <SignedOut>
        <AuthScreen />
      </SignedOut>
    </ClerkProvider>
  );
};
