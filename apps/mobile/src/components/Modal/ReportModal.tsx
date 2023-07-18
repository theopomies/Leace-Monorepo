import { View, Image, TouchableOpacity, TextInput, Text } from "react-native";
import React, { useState } from "react";
import { Button } from "../Button";
import { Picker } from "@react-native-picker/picker";
import { Reason } from "../../utils/enum";
import Modal from "./Modal";
import { trpc } from "../../../../web/src/utils/trpc";

const ReportModal = ({
  userId,
  isOpened,
  setIsOpened,
}: {
  userId: string | undefined;
  isOpened: boolean;
  setIsOpened: (bool: boolean) => void;
}) => {
  const reportUser = trpc.report.reportUserById.useMutation();

  const [selectedValue, setSelectedValue] = useState<Reason>(Reason.SPAM);
  const [inputText, setInputText] = useState("");

  const reportButton = (reason: Reason) => {
    const id = userId as string;

    reportUser.mutate({
      userId: id,
      reason: reason,
      desc: inputText,
    });
    setInputText("");
  };

  return (
    <View>
      <Modal aspect={false} visible={isOpened}>
        <View className="h-full rounded-lg ">
          <View className="flex items-end justify-end">
            <TouchableOpacity
              onPress={() => {
                setIsOpened(false);
                setInputText("");
              }}
            >
              <Image
                source={require("../../../assets/x.png")}
                className="mb-5 h-8 w-8"
              />
            </TouchableOpacity>
          </View>

          <Text className="font-p text-custom mb-2 text-xl font-bold">
            What's happening?
          </Text>
          <Text className="mb-5 text-sm text-gray-800">
            Tell us the reason of your report.
          </Text>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => setSelectedValue(itemValue as Reason)}
          >
            <Picker.Item label="SPAM" value={Reason.SPAM} />
            <Picker.Item label="SCAM" value={Reason.SCAM} />
            <Picker.Item label="INAPPROPRIATE" value={Reason.INAPPROPRIATE} />
            <Picker.Item label="OTHER" value={Reason.OTHER} />
          </Picker>

          <TextInput
            className="my-10 h-32 w-full rounded-lg border border-solid border-gray-400 px-2"
            placeholder="Let us know what's going on"
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            multiline
          />

          <View className="items-center">
            <Button
              title="Submit"
              color="custom"
              onPress={() => {
                reportButton(selectedValue);
                setIsOpened(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReportModal;
