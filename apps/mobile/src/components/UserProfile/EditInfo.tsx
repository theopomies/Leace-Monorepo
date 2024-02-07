import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface IEditInfo {
  user: {
    userId: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    description?: string;
    birthDate?: Date;
  };
  setUser: React.Dispatch<
    React.SetStateAction<
      | {
          userId: string;
          firstName?: string;
          lastName?: string;
          phoneNumber?: string;
          description?: string;
          birthDate?: Date;
        }
      | undefined
    >
  >;
}

export default function EditInfo({ user, setUser }: IEditInfo) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DateTimePickerModal
        isVisible={open}
        date={user.birthDate ?? new Date()}
        mode={"date"}
        onConfirm={(date) => {
          setOpen(false);
          setUser({ ...user, birthDate: date });
        }}
        onCancel={() => setOpen(false)}
      />
      <View className="flex flex-row items-center justify-between px-2">
        <Text className="text-base font-bold text-[#394867]">Phone:</Text>
        <TextInput
          className="font-light"
          inputMode="tel"
          placeholder="0123456789"
          defaultValue={user.phoneNumber ?? ""}
          onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
        />
      </View>
      <View className="flex flex-row items-center justify-between px-2">
        <Text className="text-base font-bold text-[#394867]">Birthdate:</Text>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Text className="font-light">
            {user.birthDate?.toLocaleDateString() ??
              new Date().toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex px-2">
        <Text className="text-base font-bold text-[#0A2472]">Description:</Text>
        <TextInput
          multiline
          numberOfLines={4}
          className="font-light"
          placeholder="I am..."
          defaultValue={user.description ?? ""}
          onChangeText={(text) => setUser({ ...user, description: text })}
        />
      </View>
    </>
  );
}
