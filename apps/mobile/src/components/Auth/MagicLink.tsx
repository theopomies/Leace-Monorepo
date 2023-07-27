import { useSignUp, useSignIn } from "@clerk/clerk-expo";
import React, { useState } from "react";
import { Text, View, TextInput, Pressable } from "react-native";

import * as AuthSession from "expo-auth-session";

const MagicLink = () => {
  const [emailAddress, setEmail] = useState("");
  const { isLoaded, setActive, signUp } = useSignUp();
  const { signIn } = useSignIn();
  let errors: string | null = null;
  if (!isLoaded) return null;

  const handleSignUp = async () => {
    const redirectUrl = AuthSession.makeRedirectUri({
      path: "/oauth-native-callback",
    });

    await signUp.create({ emailAddress }).catch((err) => {
      if (err.errors[0].code === "form_identifier_exists") {
        errors = err.errors[0].code;
      }
    });
    if (!errors) {
      const { startMagicLinkFlow } = signUp.createMagicLinkFlow();
      //this hold on while we wait for the user to open it.
      const su = await startMagicLinkFlow({
        redirectUrl: redirectUrl,
      });

      const verification = su.verifications.emailAddress;
      if (verification.status === "verified" && su.status === "complete") {
        setActive({ session: su.createdSessionId });
        return;
      }
    }
    if (errors === "form_identifier_exists") {
      if (!signIn) return null;
      const si = await signIn.create({ identifier: emailAddress });

      const { emailAddressId } = si.supportedFirstFactors.find(
        (id) => id.strategy === "email_link",
      );
      const { startMagicLinkFlow } = signIn.createMagicLinkFlow();
      await startMagicLinkFlow({
        emailAddressId: emailAddressId,
        redirectUrl: redirectUrl,
      });

      if (si.status === "complete") {
        setActive({ session: si.createdSessionId });

        return;
      }
    }
  };

  return (
    <View className="gap-3">
      <TextInput
        className="h-12 w-full rounded-md border border-gray-200 px-4"
        placeholder="Email"
        value={emailAddress}
        onChangeText={(emailAddress) => setEmail(emailAddress)}
      />
      <Pressable
        className="h-12 w-full items-center justify-center rounded-md bg-[#10316B] px-4 py-2"
        onPress={handleSignUp}
      >
        <Text className="text-white">Send me a link</Text>
      </Pressable>
    </View>
  );
};
export default MagicLink;
