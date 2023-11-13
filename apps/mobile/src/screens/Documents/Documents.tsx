import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import axios from "axios";
import { Buffer } from "buffer";
import { trpc } from "../../utils/trpc";
import { Btn } from "../../components/Btn";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { Loading } from "../../components/Loading";

type DocumentModalType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callback: () => void;
};

function DocumentModal({ open, setOpen, callback }: DocumentModalType) {
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
              Are you certain you want to proceed with the permanent deletion of
              this document ?
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
                textColor="#10316B"
                onPress={() => setOpen(false)}
              ></Btn>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function Documents() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const route = useRoute<RouteProp<TabStackParamList, "Profile">>();
  const { userId } = route.params;
  const {
    data: documents,
    refetch,
    isLoading,
  } = trpc.document.getSignedUrl.useQuery({
    userId,
  });
  const uploadDocument = trpc.document.putSignedUrl.useMutation();
  const { mutate: deleteDocument } = trpc.document.deleteSignedUrl.useMutation({
    onSuccess() {
      refetch();
      setOpen(false);
    },
  });

  const pickDocument = async () => {
    try {
      const documents: {
        assets: DocumentPicker.DocumentPickerAsset[];
        canceled: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } = (await DocumentPicker.getDocumentAsync({ type: "*/*" })) as any;
      if (documents.canceled) throw new Error("Document picker canceled");
      const [document] = documents.assets;
      if (!document) throw new Error("Document picker failed");
      if (!document.mimeType || !document.uri)
        throw new Error("Invalid document");
      await uploadDocument
        .mutateAsync({ userId, fileType: document.mimeType })
        .then(async (url) => {
          if (!url) return;
          const fileContent = await FileSystem.readAsStringAsync(document.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const buffer = Buffer.from(fileContent, "base64");
          await axios({
            method: "PUT",
            url: url,
            data: buffer,
            headers: { "Content-Type": document.mimeType },
          })
            .then(() => refetch())
            .catch((e) => console.error(e));
        });
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <Loading />;

  if (!documents)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Text>Data not found</Text>
        </View>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <DocumentModal
        open={open}
        setOpen={setOpen}
        callback={() => deleteDocument({ userId, documentId: selected })}
      />
      <View style={styles.view}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {documents.map((doc, key) => (
            <View
              key={key}
              className={`relative mx-3 mt-2 max-h-60 rounded-md bg-[#f1f1f1] p-2`}
            >
              <View
                className={`flex max-h-40 ${
                  doc.ext === "pdf" ? "h-20" : "h-40"
                } items-center justify-center`}
              >
                <Image
                  className={`${
                    doc.ext === "pdf" ? "h-20 w-20" : "h-40 w-full"
                  } block rounded-md object-contain`}
                  source={
                    doc.ext === "pdf"
                      ? require("../../../assets/pdf-logo.png")
                      : { uri: doc.url }
                  }
                ></Image>
              </View>
              <View className="flex flex-row items-center pt-2">
                <View className="flex-1">
                  <Text>File name: PLACE HOLDER</Text>
                </View>
                <Btn
                  className="rounded-md"
                  bgColor="#ef4444"
                  iconName="delete"
                  iconType="material"
                  onPress={() => {
                    setSelected(doc.id);
                    setOpen(true);
                  }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        <View>
          <Btn
            title="Upload a document"
            bgColor="#38a169"
            className="rounded-none"
            onPress={pickDocument}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  view: {
    flex: 1,
    backgroundColor: "white",
  },
});
