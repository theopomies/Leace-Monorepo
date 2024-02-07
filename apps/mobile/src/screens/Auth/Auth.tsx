import React from "react";
import { MagicLink, OAuth } from "../../components/Auth";
import { View, SafeAreaView, Text, Image } from "react-native";

export default function Auth() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Image
        source={require("../../../assets/logo_1024.png")}
        alt="leace"
        className="h-52 w-52"
      />
      <View className="w-full p-8">
        <View className="mb-4">
          <OAuth
            icon={require("../../../assets/facebook.png")}
            provider="oauth_facebook"
            title="Continue with Facebook"
          />
        </View>
        <OAuth
          icon={require("../../../assets/google.png")}
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
