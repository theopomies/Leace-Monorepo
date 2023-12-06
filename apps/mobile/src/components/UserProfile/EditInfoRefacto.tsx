import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { StyleSheet } from "react-native";

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

  const styles = StyleSheet.create({
    input: {
      paddingLeft: 10,
      textAlignVertical: 'center',
      height: 50,
      width: '100%',
      borderWidth: 1,
      borderRadius: 5,
    },
  });

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


      <View className="flex flex-col items-left px-8">
        <Text className="text-xl font-bold text-[#111827]">Phone:</Text>
        <TextInput
          className="text-lg font-light mb-6"
          inputMode="tel"
          style={styles.input}
          multiline={true}
          placeholder="0123456789"
          defaultValue={user.phoneNumber ?? ""}
          onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
        />
        <Text className="text-xl font-bold text-[#111827]">Birthday:</Text>
        <TouchableOpacity className="w-24 rounded-lg border-[1px] pl-2 w-1/3 mt-1" onPress={() => setOpen(true)}
        >
          <Text className="text-lg font-light">
            {user.birthDate?.toLocaleDateString() ??
              new Date().toLocaleDateString()}
          </Text>

        </TouchableOpacity>



        <Text className="mt-5 text-xl font-bold text-[#111827]">Description:</Text>
        <View className="mb-6 h-20 w-[100%] border-2 border-gray border rounded-xl p-2">
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
    </>
  );
}
