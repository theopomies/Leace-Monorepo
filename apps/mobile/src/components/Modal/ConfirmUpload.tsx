import { View, Text, Modal, TextInput } from "react-native";
import React from "react";
import { Btn } from "../Btn";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "react-native";

type DocumentModalType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  document: DocumentPicker.DocumentPickerAsset | undefined;
  setDocument: React.Dispatch<
    React.SetStateAction<DocumentPicker.DocumentPickerAsset | undefined>
  >;
  callback: () => void;
  buttonStatus: { status: boolean; message: string };
};
export default function ConfirmUpload({
  open,
  setOpen,
  callback,
  document,
  setDocument,
  buttonStatus,
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
          <View className="pb-1">
            <Text className="text-center text-base font-bold">
              Upload a document
            </Text>
          </View>
          <Image
            className={`${
              document?.mimeType === "application/pdf"
                ? "h-20 w-20"
                : "h-40 w-full"
            } block rounded-md object-contain`}
            source={
              document?.mimeType === "application/pdf"
                ? require("../../../assets/pdf-logo.png")
                : { uri: document?.uri }
            }
          ></Image>
          <View className="py-1">
            <TextInput
              className="focus:border-indigo h-8 rounded-md border border-[#d3d3d3] px-2"
              defaultValue={document?.name}
              onChangeText={(text) => {
                if (document) setDocument({ ...document, name: text });
              }}
            ></TextInput>
          </View>
          <View className="flex flex-row gap-2 pt-2">
            {buttonStatus.status ? (
              <View className="flex-1 items-center justify-center">
                <Btn
                  title={buttonStatus.message}
                  spinner={buttonStatus.status}
                />
              </View>
            ) : (
              <>
                <View className="flex-1">
                  <Btn
                    title="Close"
                    bgColor="#6366f1"
                    onPress={() => setOpen(false)}
                  ></Btn>
                </View>
                <View className="flex-1">
                  <Btn
                    title="Upload"
                    bgColor="#38a169"
                    textColor="#FFFFFF"
                    onPress={callback}
                  ></Btn>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
