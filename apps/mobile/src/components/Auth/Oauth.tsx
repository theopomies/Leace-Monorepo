import { useSignUp, useSignIn } from "@clerk/clerk-expo";
import React from "react";
import {
  Image,
  View,
  Text,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";

import * as AuthSession from "expo-auth-session";

interface OAuthProps extends React.HTMLAttributes<HTMLDivElement> {
  provider: "oauth_facebook" | "oauth_google";
  title: string;
  icon: ImageSourcePropType;
}

const OAuth = ({ provider, title, icon }: OAuthProps) => {
  const { isLoaded, signIn, setSession } = useSignIn();
  const { signUp } = useSignUp();
  if (!isLoaded) return null;

  const handleOAuth = async (provider: "oauth_facebook" | "oauth_google") => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        path: "/oauth-native-callback",
        scheme: "com.leaceeip.leace",
      });
      await signIn.create({ strategy: provider, redirectUrl });
      const {
        firstFactorVerification: { externalVerificationRedirectURL },
      } = signIn;
      if (!externalVerificationRedirectURL)
        throw "Something went wrong during the OAuth flow. Try again.";
      const authResult = await AuthSession.startAsync({
        authUrl: externalVerificationRedirectURL.toString(),
        returnUrl: redirectUrl,
        projectNameForProxy: "@leace-eip/leace",
      });
      if (authResult.type !== "success") {
        throw "Something went wrong during the OAuth flow. Try again.";
      }
      const { rotating_token_nonce: rotatingTokenNonce } = authResult.params;
      await signIn.reload({ rotatingTokenNonce });
      const { createdSessionId } = signIn;
      if (createdSessionId) {
        await setSession(createdSessionId);
      } else {
        if (!signUp || signIn.firstFactorVerification.status !== "transferable")
          throw "Something went wrong during the Sign up OAuth flow. Please ensure that all sign up requirements are met.";
        await signUp.create({ transfer: true });
        await signUp.reload({
          rotatingTokenNonce: authResult.params.rotating_token_nonce,
        });
        await setSession(signUp.createdSessionId);
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log("error signing in", err);
    }
  };

  return (
    <TouchableOpacity
      className="flex flex-col rounded-md border-2 border-gray-300 py-3"
      onPress={() => handleOAuth(provider)}
    >
      <View className="mx-10 flex flex-row items-center justify-center">
        <Image source={icon} alt={title} className="mr-2 h-6 w-6" />
        <Text className="text-black">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default OAuth;
