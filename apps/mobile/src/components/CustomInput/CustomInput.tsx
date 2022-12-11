import React from "react";
import { View, TextInput, TextInputProps } from "react-native";

export type CustomInputProps = TextInputProps;

const CustomInput: React.FC<CustomInputProps> = ({ value, onChange }) => {
  return (
    <View >
      <TextInput className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="value"/>
    </View>
  );
};

export default CustomInput;
