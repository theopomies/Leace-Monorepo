import { Icon } from "react-native-elements";
import React from "react";
import {
  GestureResponderEvent,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from "react-native";

export default function Btn({
  title,
  onPress,
  textColor = "white",
  iconName,
  iconType,
  bgColor = "#6366f1",
  className,
  spinner,
}: {
  title?: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  textColor?: string;
  iconName?: string;
  iconType?: string;
  bgColor?: string;
  className?: string;
  disabled?: boolean;
  spinner?: boolean;
}) {
  return (
    <TouchableOpacity
      className={`flex flex-row items-center justify-center ${
        iconName && iconType ? "space-x-2" : ""
      } rounded-lg p-2.5 ${className}`}
      onPress={onPress}
      disabled={!onPress}
      style={{ backgroundColor: bgColor }}
    >
      {iconName && iconType && (
        <Icon size={20} name={iconName} type={iconType} color={"white"}></Icon>
      )}
      {spinner && (
        <View className="mr-2">
          <ActivityIndicator color={"white"} />
        </View>
      )}
      {title && (
        <Text className="font-bold" style={{ color: textColor }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
