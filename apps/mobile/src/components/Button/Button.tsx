import React from "react";
import { TouchableOpacity, Text } from "react-native";

const Button = ({
  title,
  color,
  onPress,
}: {
  title: string;
  color: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-${color} flex h-12 w-32 items-center justify-center rounded px-3 py-2`}
    >
      <Text className="text-bold text-center text-xl text-white">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
