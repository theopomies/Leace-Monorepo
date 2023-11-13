import { Icon } from "react-native-elements";
import React from "react";
import { GestureResponderEvent, TouchableOpacity, Text } from "react-native";

export default function Btn({
  title,
  onPress,
  textColor = "white",
  iconName,
  iconType,
  bgColor = "#10316B",
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
      className={`flex flex-row items-center justify-center ${
        iconName && iconType ? "space-x-2" : ""
      } rounded-lg p-2.5 ${className}`}
      onPress={onPress}
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
