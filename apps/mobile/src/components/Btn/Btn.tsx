import { Icon } from "react-native-elements";
import React, { ReactNode } from "react";
import {
  GestureResponderEvent,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

export default function Btn({
  title,
  onPress,
  textColor = "white",
  iconName,
  iconType,
  bgColor = "#002642",
  className,
}: {
  title?: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  textColor?: string;
  iconName?: string;
  iconType?: string;
  bgColor?: string;
  className?: string;
}) {
  return (
    <TouchableOpacity
      className={`flex flex-row items-center justify-center rounded-lg p-2.5 ${className}`}
      onPress={onPress}
      disabled={!onPress}
      style={{ backgroundColor: bgColor }}
    >
      {iconName && iconType && (
        <Icon size={20} name={iconName} type={iconType} color={"white"}></Icon>
      )}
      {title && (
        <Text className="font-bold" style={{ color: textColor }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}