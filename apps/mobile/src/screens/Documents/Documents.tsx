import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Buffer } from "buffer";
import { trpc } from "../../utils/trpc";
import { Btn } from "../../components/Btn";
import * as DocumentPicker from "expo-document-picker";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { Loading } from "../../components/Loading";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import Toast from "react-native-toast-message";

import * as Sharing from "expo-sharing";
import { DocumentModal } from "../../components/Modal";

export default function Documents() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const route = useRoute<RouteProp<TabStackParamList, "Profile">>();
  const { userId } = route.params;
  const {
    data: documents,
    refetch,
    isLoading,
  } = trpc.document.getSignedUrl.useQuery({ userId });
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

  async function getFileUri(url: string, fileName: string) {
    const fileUri = FileSystem.documentDirectory + fileName;
    const downloadedFile = await FileSystem.downloadAsync(url, fileUri);
    if (downloadedFile.status === 200) return downloadedFile.uri;
    return null;
  }

  async function saveFile(fileName: string, fileUri: string, ext: string) {
    const saveAs = `${fileName}.${ext}`;
    try {
      const downloadedFile = await getFileUri(fileUri, saveAs);
      if (!downloadedFile) throw new Error("DOWNLOAD FAILED");
      if (ext === "pdf")
        await Sharing.shareAsync(downloadedFile, {
          mimeType: "application/pdf",
          dialogTitle: "Download or share a PDF",
          UTI: "com.adobe.pdf",
        });
      else {
        await MediaLibrary.createAssetAsync(downloadedFile);
        Toast.show({ type: "success", text1: "File downloaded." });
      }
    } catch (e) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: "The file download was not successful.",
        text2: "Try again later.",
      });
    }
  }

  async function downloadFile(fileName: string, fileUri: string, ext: string) {
    const declined = {
      type: "error",
      text1: "Access to the library was declined.",
      text2: "Download canceled.",
    };
    const result = await MediaLibrary.getPermissionsAsync();
    if (result.status === "granted") {
      await saveFile(fileName, fileUri, ext);
    } else if (result.status === "undetermined") {
      const ask = await MediaLibrary.requestPermissionsAsync();
      if (ask.status === "granted") await saveFile(fileName, fileUri, ext);
      else Toast.show(declined);
    } else Toast.show(declined);
  }

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
              <View className="flex flex-row items-center gap-1 pt-2">
                <View className="flex-1">
                  <Text>
                    {doc.id}.{doc.ext}
                  </Text>
                </View>
                <View className="flex flex-row space-x-1">
                  <View>
                    <Btn
                      className="rounded-md"
                      bgColor="#10316B"
                      iconName="download"
                      iconType="material-community"
                      onPress={() => downloadFile(doc.id, doc.url, doc.ext)}
                    />
                  </View>
                  <View>
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
