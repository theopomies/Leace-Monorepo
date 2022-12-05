import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";
import { TRPCProvider } from "./utils/trpc";

import Navigation from "./navigation/navigation";

export const App = () => {
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <Navigation />
          <StatusBar />
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};
