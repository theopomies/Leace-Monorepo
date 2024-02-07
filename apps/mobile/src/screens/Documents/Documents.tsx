import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import {
  DocumentModal,
  ZoomImageModal,
  ConfirmUpload,
} from "../../components/Modal";

export default function Documents() {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selected, setSelected] = useState({ id: "", url: "" });
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
      setLoading({ status: false, message: "" });
      refetch();
      setOpen(false);
    },
  });
  const [tmpDocument, setTmpDocument] = useState<
    DocumentPicker.DocumentPickerAsset | undefined
  >();

  const [loading, setLoading] = useState({
    status: false,
    message: "",
  });

  function uploadHandler() {
    if (!tmpDocument) return;
    if (!tmpDocument.mimeType) return;
    setLoading({ status: true, message: "Uploading..." });
    uploadDocument
      .mutateAsync({
        userId,
        fileType: tmpDocument.mimeType,
        fileName: tmpDocument.name,
      })
      .then(async (url) => {
        if (!url) return;
        const fileContent = await FileSystem.readAsStringAsync(
          tmpDocument.uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          },
        );
        const buffer = Buffer.from(fileContent, "base64");
        await axios({
          method: "PUT",
          url: url,
          data: buffer,
          headers: { "Content-Type": tmpDocument.mimeType },
        })
          .then(() => refetch())
          .catch((e) => console.error(e))
          .finally(() => {
            setLoading({ status: false, message: "Uploading..." });
            setOpen2(false);
          });
      });
  }

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
      setTmpDocument(document);
      setOpen2(true);
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
        callback={() => {
          setLoading({ status: true, message: "Deleting..." });
          deleteDocument({ userId, documentId: selected.id });
        }}
        buttonStatus={loading}
      />
      <ConfirmUpload
        open={open2}
        setOpen={setOpen2}
        document={tmpDocument}
        setDocument={setTmpDocument}
        callback={uploadHandler}
        buttonStatus={loading}
      />
      {open1 && (
        <ZoomImageModal image={selected} callback={() => setOpen1(false)} />
      )}
      <View style={styles.view}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {documents.map((doc, key) => (
            <View
              key={key}
              className={`relative mx-3 mt-2 max-h-60 rounded-md bg-[#f1f1f1] p-2`}
            >
              <TouchableOpacity
                disabled={doc.ext === "pdf"}
                onPress={() => {
                  setSelected({ id: doc.id, url: doc.url });
                  setOpen1(true);
                }}
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
              </TouchableOpacity>
              <View className="flex flex-row items-center gap-1 pt-2">
                <View className="flex-1">
                  <Text>{doc.name}</Text>
                </View>
                <View className="flex flex-row space-x-1">
                  <View>
                    <Btn
                      className="rounded-md"
                      bgColor="#6366f1"
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
                        setSelected({ id: doc.id, url: doc.url });
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
