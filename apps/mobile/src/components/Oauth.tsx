import { useSignUp, useSignIn } from "@clerk/clerk-expo";
import React from "react";
import { Image, Pressable, View, Text } from "react-native";

import * as AuthSession from "expo-auth-session";

interface OAuthProps extends React.HTMLAttributes<HTMLDivElement> {
  provider: "oauth_facebook" | "oauth_google";
  title: string;
  icon: any;
}

const OAuth = ({ provider, title, icon }: OAuthProps) => {
  const { isLoaded, signIn, setSession } = useSignIn();
  const { signUp } = useSignUp();
  if (!isLoaded) return null;

  const handleOAuth = async (provider: "oauth_facebook" | "oauth_google") => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        path: "/oauth-native-callback",
      });

      await signIn.create({
        strategy: provider,
        redirectUrl,
      });

      const {
        firstFactorVerification: { externalVerificationRedirectURL },
      } = signIn;

      if (!externalVerificationRedirectURL)
        throw "Something went wrong during the OAuth flow. Try again.";

      const authResult = await AuthSession.startAsync({
        authUrl: externalVerificationRedirectURL.toString(),
        returnUrl: redirectUrl,
      });

      if (authResult.type !== "success") {
        throw "Something went wrong during the OAuth flow. Try again.";
      }

      // Get the rotatingTokenNonce from the redirect URL parameters
      const { rotating_token_nonce: rotatingTokenNonce } = authResult.params;

      await signIn.reload({ rotatingTokenNonce });

      const { createdSessionId } = signIn;

      if (createdSessionId) {
        // If we have a createdSessionId, then auth was successful
        await setSession(createdSessionId);
      } else {
        // If we have no createdSessionId, then this is a first time sign-in, so
        // we should process this as a signUp instead
        // Throw if we're not in the right state for creating a new user
        if (
          !signUp ||
          signIn.firstFactorVerification.status !== "transferable"
        ) {
          throw "Something went wrong during the Sign up OAuth flow. Please ensure that all sign up requirements are met.";
        }

        console.log(
          "Didn't have an account transferring, following through with new account sign up",
        );

        // Create user
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
    <Pressable
      className="flex flex-row rounded-md border-2 border-gray-300 py-3"
      onPress={() => handleOAuth(provider)}
    >
      <View className="mx-10 flex flex-row items-center justify-center">
        <Image source={icon} alt={title} className="mr-2 h-6 w-6" />
        <Text className="text-black">{title}</Text>
      </View>
    </Pressable>
  );
};

export default OAuth;
