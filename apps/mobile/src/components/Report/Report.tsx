import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import { Btn } from "../Btn";
import { Reason } from "../../utils/enum";
import { trpc } from "../../utils/trpc";
import { ReportReason } from "@leace/db";
import RNPickerSelect from "react-native-picker-select";

interface IReport {
  type: "USER" | "POST";
  userId?: string;
  postId?: string;
  className?: string;
}

export default function Report({ type, userId, postId, className }: IReport) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>(Reason.SPAM);
  const [message, setMessage] = useState("");

  const reportUser = trpc.report.reportUserById.useMutation({
    onSuccess() {
      console.log("[USER] report message sent");
      setMessage("");
      setOpen(false);
    },
  });

  const reportPost = trpc.report.reportPostById.useMutation({
    onSuccess() {
      console.log("[POST] report message sent");
      setMessage("");
      setOpen(false);
    },
  });

  function sendReport() {
    if (type === "USER" && userId)
      reportUser.mutate({ userId, reason, desc: message });
    if (type === "POST" && postId)
      reportPost.mutate({ postId, reason, desc: message });
  }

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={() => {
          setOpen(false);
        }}
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
            <Text className="text-center text-lg font-bold">Report form</Text>
            <Text className="text-sm font-light">Reason:</Text>
            <RNPickerSelect
              placeholder={{}}
              onValueChange={(itemValue) => setReason(itemValue)}
              items={[
                { label: "SPAM", value: "SPAM" },
                { label: "SCAM", value: "SCAM" },
                { label: "INAPPROPRIATE", value: "INAPPROPRIATE" },
                { label: "OTHER", value: "OTHER" },
              ]}
            />
            <Text className="pb-3 text-sm font-light">
              What's happening? Tell us the reason of your report.
            </Text>
            <TextInput
              className="h-32 rounded-md border border-solid px-2"
              placeholder="Let us know what's going on"
              value={message}
              onChangeText={(text) => setMessage(text)}
              multiline
            />
            <View className="mt-3 flex space-y-1">
              <View>
                <Btn
                  title="Send Report"
                  bgColor="#ef4444"
                  textColor="#FFFFFF"
                  onPress={sendReport}
                ></Btn>
              </View>
              <View>
                <Btn
                  title="Close"
                  bgColor="#F2F7FF"
                  textColor="#10316B"
                  onPress={() => setOpen(false)}
                ></Btn>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity className={className} onPress={() => setOpen(true)}>
        <Icon
          size={20}
          name="warning"
          type="material-icons"
          color={"white"}
        ></Icon>
        <Text className="text-white">Report</Text>
      </TouchableOpacity>
    </>
  );
}
