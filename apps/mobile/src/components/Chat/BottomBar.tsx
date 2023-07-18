import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { Dropdown } from "../Dropdown/Dropdown";

const BottomBar = ({
  onSelect,
  data,
  value,
  handleChange,
  onSendMessage,
}: {
  onSelect: (item: { item: string }) => void;
  data: { item: string }[];
  value: string;
  handleChange: (value: string) => void;
  onSendMessage: (value: string) => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const sendMessage = () => {
    if (value) {
      onSendMessage(value);
    }
  };

  return (
    <View
      className={`w-fit flex-row items-center justify-start ${
        showOptions ? "absolute bottom-0 left-0 ml-9" : ""
      }`}
    >
      <Dropdown
        onSelect={onSelect}
        data={data}
        showOptions={showOptions}
        setShowOptions={setShowOptions}
      />
      {!showOptions && (
        <View className={`flex-row items-center bg-white p-2`}>
          <TextInput
            value={value}
            onChangeText={handleChange}
            className="mr-2 flex-1 rounded-lg px-2 py-2"
            placeholder="Type a message"
          />
          {value && (
            <TouchableOpacity onPress={sendMessage}>
              <Icon size={15} name="send" reverse color="#002642" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default BottomBar;
