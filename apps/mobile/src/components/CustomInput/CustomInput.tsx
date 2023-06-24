import React, { useState, useEffect } from "react";
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
  value: string | number | undefined;
  onChangeAttributesHandler: (name: string, value: number | string) => void;
  placeholder: string;
  multiline: boolean;
  isEmpty: boolean;
}) => {
  const [inputValue, setInputValue] = useState<string>(
    value !== undefined ? value.toString() : "",
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInputValue(value !== undefined ? value.toString() : "");
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    let parsedValue: string | number;

    if (text === "") {
      parsedValue = text;
    } else if (!isNaN(Number(text))) {
      parsedValue = Number(text);
    } else {
      parsedValue = text;
    }

    onChangeAttributesHandler(category, parsedValue);
  };

  return (
    <View className="mb-5">
      <Text className="text-custom ml-3 font-semibold">{label}</Text>
      <TextInput
        className="mx-3 mb-2 h-12 rounded border p-2.5"
        onChangeText={handleInputChange}
        value={inputValue}
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
