import React from "react";

import { View, SafeAreaView, Text, Image } from "react-native";
import MagicLink from "../components/MagicLink";
import OAuth from "../components/Oauth";

export default function AuthScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
      <Image source={require("../../assets/logo.png")} alt="leace" />
      <View className="w-full p-8">
        <Text className="mb-6 text-4xl font-bold tracking-[.5em] text-[#313131]">
          Login
        </Text>

        <View className="mb-4">
          <OAuth
            icon={require("../../assets/facebook.png")}
            provider="oauth_facebook"
            title="Continue with Facebook"
          />
        </View>
        <OAuth
          icon={require("../../assets/google.png")}
          provider="oauth_google"
          title="Continue with Google"
        />

        <View className="my-8 flex flex-row items-center">
          <View className="mr-3 h-0.5 flex-1 bg-gray-300"></View>
          <Text className="text-sm font-medium text-gray-500">OR</Text>
          <View className="ml-3 h-0.5 flex-1 bg-gray-300"></View>
        </View>

        <MagicLink />
      </View>
    </SafeAreaView>
  );
}
