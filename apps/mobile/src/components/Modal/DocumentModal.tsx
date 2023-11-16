import { View, Text, Modal } from "react-native";
import React from "react";
import { Btn } from "../Btn";

type DocumentModalType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callback: () => void;
};

export default function DocumentModal({
  open,
  setOpen,
  callback,
}: DocumentModalType) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <View className="flex-1 items-center justify-center">
        <View
          className="w-3/4 rounded-md bg-white p-4"
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <View className="flex flex-col gap-2">
            <Text className="font-base text-sm">
              Are you certain you want to delete this document ?
            </Text>
            <Text className="text-xs font-light">
              Please note that this action is irreversible, and the document
              cannot be recovered.
            </Text>
          </View>
          <View className="flex flex-row gap-1 pt-2">
            <View className="flex-1">
              <Btn
                title="Delete"
                bgColor="#ef4444"
                textColor="#FFFFFF"
                onPress={callback}
              ></Btn>
            </View>
            <View className="flex-1">
              <Btn
                title="Close"
                bgColor="#F2F7FF"
                textColor="#0A2472"
                onPress={() => setOpen(false)}
              ></Btn>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
