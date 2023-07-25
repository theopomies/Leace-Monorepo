import { Image, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";

export default function Loading() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  function animateFadeInOut() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.2,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      {},
    ).start();
  }

  useEffect(() => {
    animateFadeInOut();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image source={require("../../../assets/logo.png")} alt="leace-logo" />
    </Animated.View>
  );
}
