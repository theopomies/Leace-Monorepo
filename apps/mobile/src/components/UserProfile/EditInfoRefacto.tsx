import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";

interface IEditInfoRefacto {
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

export default function EditInfoRefacto({ user, setUser }: IEditInfoRefacto) {
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


      <View className="flex flex-col items-center px-4 space-y-4">

        <View className="flex flex-row align-middle items-center px-6 space-x-2 w-full h-16 bg-[#F1F5F9] rounded-xl shadow shadow-md shadow-gray-400 ">
          <Text className="text-xl font-bold text-[#111827]">Phone:</Text>
          <TextInput
            className="text-lg font-light w-1/2 pb-2 mb-2"
            inputMode="tel"
            placeholder="0123456789"
            defaultValue={user.phoneNumber ?? ""}
            style={{ borderColor: "black", borderBottomWidth: 1 }}
            onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
          />
        </View>
        <View className="flex flex-row align-middle items-center px-6 space-x-2 w-full h-16 bg-[#F1F5F9] rounded-xl shadow shadow-md shadow-gray-400 ">
          <Text className="text-xl font-bold text-[#111827]">Birthday:</Text>
          <TouchableOpacity onPress={() => setOpen(true)}
            style={{ borderColor: "black", borderBottomWidth: 1 }}
          >
            <Text className="text-lg font-light">
              {user.birthDate?.toLocaleDateString() ??
                new Date().toLocaleDateString()}
            </Text>

          </TouchableOpacity>
        </View>
        <View className="flex flex-col items-start px-6 space-y-2 w-full h-36 bg-[#F1F5F9] rounded-xl shadow shadow-md shadow-gray-400 ">
          <Text className="mt-2 text-xl font-bold text-[#111827]">Description:</Text>
          <View className="h-20 w-full border-2 border-gray border-dashed rounded-xl p-2">
            <TextInput
              multiline
              numberOfLines={4}
              className="font-light h-full"
              placeholder="I am..."
              defaultValue={user.description ?? ""}
              onChangeText={(text) => setUser({ ...user, description: text })}
            />
          </View>
        </View>
      </View>
    </>
  );
}
