import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

const CustomInput = ({
  label,
  category,
  value,
  onChangeAttributesHandler,
  placeholder,
  multiline,
  isEmpty,
}: {
  label: string;
  category: string;
  value: string | undefined;
  onChangeAttributesHandler: (name: string, value: number | string) => void;
  placeholder: string;
  multiline: boolean;
  isEmpty: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View className="mb-5">
      <Text className="text-custom ml-3 font-semibold">{label}</Text>
      <TextInput
        className="mx-3 mb-2 h-12 rounded border p-2.5"
        onChangeText={(text) => {
          const newValue = Number.isInteger(parseInt(text))
            ? parseInt(text)
            : text;
          onChangeAttributesHandler(category, newValue);
        }}
        value={value}
        multiline={multiline}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {!isFocused && isEmpty && (
        <Text className="text-md mb-2 ml-3 font-bold text-red-500">
          This field is required
        </Text>
      )}
    </View>
  );
};

export default CustomInput;
