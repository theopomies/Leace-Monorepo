import React from 'react';
import { Text, TextInput, View } from 'react-native';

const CustomInput = ({ label, category, value, onChangeAttributesHandler, placeholder, multiline }: { label: string, category: string, value: string | undefined, onChangeAttributesHandler: (name: string, value: number | string) => void, placeholder: string, multiline: boolean }) => {
  return (
    <View>
      <Text className='text-custom font-semibold ml-3'>{label}</Text>
      <TextInput
        className="h-12 m-3 mb-5 border rounded p-2.5"

        onChangeText={(text) => {
          const newValue = Number.isInteger(parseInt(text)) ? parseInt(text) : text;
          onChangeAttributesHandler(category, newValue)
        }}
        value={value}
        multiline={multiline}
        placeholder={placeholder}
      />
    </View>
  );
};

export default CustomInput;
