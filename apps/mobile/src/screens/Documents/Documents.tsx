import React from "react";
import {
  Button,
  View,
  Text,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { Buffer } from "buffer";
import { trpc } from "../../utils/trpc";
import { Btn } from "../../components/Btn";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";

export default function Documents() {
  const route = useRoute<RouteProp<TabStackParamList, "Profile">>();
  const { userId } = route.params;
  const { data: documents, refetch } = trpc.document.getSignedUrl.useQuery({
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <View>
          <Button title="Pick a Document" onPress={pickDocument} />
        </View>
        <View>
          {documents &&
            documents.map((doc, key) => (
              <View key={key} className="mt-2 px-3">
                <Text>{doc.url}</Text>
                <Btn
                  title="Delete"
                  onPress={() =>
                    deleteDocument.mutate({ userId, documentId: doc.id })
                  }
                />
              </View>
            ))}
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
