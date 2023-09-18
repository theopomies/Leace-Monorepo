import React from "react";
import {
  Image,
  View,
  Text,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Buffer } from "buffer";
import { trpc } from "../../utils/trpc";
import { Btn } from "../../components/Btn";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

export default function Documents() {
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
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation({
    onSuccess() {
      refetch();
    },
  });

  const pickDocument = async () => {
    try {
      const document: DocumentPicker.DocumentPickerAsset & {
        type: "success" | "cancel";
      } = (await DocumentPicker.getDocumentAsync({ type: "*/*" })) as any;
      if (document.type !== "success") return;
      if (!document.mimeType || !document.uri) return;
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
          }).then(() => refetch());
        });
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Loading />
        </View>
      </View>
    );

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
      <View style={styles.view}>
        <Header />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {documents &&
            documents.map((doc, key) => (
              <View
                key={key}
                className="bg-navy relative mx-3 mt-2 h-36 rounded-md p-2"
              >
                <View className="flex h-32 w-32 items-center justify-center">
                  <Image
                    className={`${
                      doc.ext === "pdf" ? " h-20 w-20" : "h-32 w-32"
                    } rounded-md`}
                    source={
                      doc.ext === "pdf"
                        ? require("../../../assets/pdf-logo.png")
                        : { uri: doc.url }
                    }
                  ></Image>
                </View>
                <Btn
                  className="absolute right-0 top-0 rounded-md rounded-br-none rounded-tl-none"
                  bgColor="#ef4444"
                  iconName="delete"
                  iconType="material"
                  onPress={() =>
                    deleteDocument.mutate({ userId, documentId: doc.id })
                  }
                />
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white",
  },
});
