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
      textAlignVertical: "center",
      height: 50,
      width: "100%",
      borderWidth: 1,
      borderRadius: 5,
    },
  });

  function isAdult() {
    if (!user || !user.birthDate) return false;
    const eighteenYearsAgo = new Date();
    const currentDate = new Date();
    eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18);
    return user.birthDate < eighteenYearsAgo;
  }

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

      <View className="items-left flex flex-col px-8">
        <Text className="text-xl font-bold text-[#111827]">Phone:</Text>
        <TextInput
          className="text-lg font-light"
          inputMode="tel"
          style={styles.input}
          multiline={true}
          placeholder="0123456789"
          defaultValue={user.phoneNumber ?? ""}
          onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
        />
        {!user.phoneNumber && (
          <Text className="text-red-500" style={{ fontSize: 10 }}>
            A phone number is required.
          </Text>
        )}
        <Text className="text-xl font-bold text-[#111827]">Birthday:</Text>
        <TouchableOpacity
          className="mt-1 w-1/3 w-24 rounded-lg border-[1px] pl-2"
          onPress={() => setOpen(true)}
        >
          <Text className="text-lg font-light">
            {user.birthDate?.toLocaleDateString() ??
              new Date().toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {!isAdult() && (
          <Text className="text-red-500" style={{ fontSize: 10 }}>
            You must be 18 years old.
          </Text>
        )}

        <Text className="mt-5 text-xl font-bold text-[#111827]">
          Description:
        </Text>
        <View className="border-gray h-20 w-[100%] rounded-xl border border-2 p-2">
          <TextInput
            multiline
            numberOfLines={4}
            className="h-full font-light"
            placeholder="I am..."
            defaultValue={user.description ?? ""}
            onChangeText={(text) => setUser({ ...user, description: text })}
          />
        </View>
        {!user.description && (
          <Text className="text-red-500" style={{ fontSize: 10 }}>
            A description is required.
          </Text>
        )}
      </View>
    </>
  );
}
