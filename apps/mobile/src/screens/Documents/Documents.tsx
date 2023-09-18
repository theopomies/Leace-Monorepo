import React, { useState } from "react";
import {
  Button,
  View,
  Text,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { trpc } from "../../utils/trpc";

export default function Documents() {
  const route = useRoute<RouteProp<TabStackParamList, "Profile">>();
  const { userId } = route.params;
  const [selectedDocument, setSelectedDocument] = useState<
    DocumentPicker.DocumentPickerAsset & { type: "success" | "cancel" }
  >();

  const { data: documentsGet, refetch: refetchDocumentsGet } =
    trpc.document.getSignedUrl.useQuery({ userId });

  const uploadDocument = trpc.document.putSignedUrl.useMutation();
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();

  const pickDocument = async () => {
    try {
      const result: DocumentPicker.DocumentPickerAsset & {
        type: "success" | "cancel";
      } = (await DocumentPicker.getDocumentAsync({
        type: "*/*", // You can specify the allowed file types here
        copyToCacheDirectory: false,
      })) as any;

      if (result.type === "success") {
        if (!result.mimeType || !result.uri) return;

        await uploadDocument
          .mutateAsync({
            userId,
            fileType: result.mimeType,
          })
          .then(async (url) => {
            if (url) {
              const formData = new FormData();
              // @ts-ignore
              formData.append("file", {
                uri: result.uri.replace(/^.*[\\\/]/, ""),
                name: result.name,
                type: result.mimeType,
              });
              await axios
                .put(url, formData, {
                  headers: {
                    "Content-Type": result.mimeType,
                  },
                })
                .then(() => refetchDocumentsGet())
                .catch((e) => console.error(e));
            }
          });
      } else {
        console.log("Document picker was canceled.");
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const uploadDocumentToAWS = async () => {
    if (selectedDocument) {
      /*
      const formData = new FormData();
      formData.append("file", {
        uri: selectedDocument.uri,
        name: selectedDocument.name,
        type: selectedDocument.type,
      });

      try {
        const response = await axios.post("YOUR_AWS_UPLOAD_URL", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            // Add any AWS specific headers here (e.g., AWS authorization headers)
          },
        });

        console.log("Document uploaded successfully:", response.data);
        // Handle success response from AWS server
      } catch (error) {
        console.error("Error uploading document to AWS:", error);
        // Handle error from AWS server
      }*/
    } else {
      console.log("No document selected to upload.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <View>
          <Button title="Pick a Document" onPress={pickDocument} />
          {selectedDocument && (
            <View>
              <Text>Selected Document: {selectedDocument.uri}</Text>
              <Button title="Upload to AWS" onPress={uploadDocumentToAWS} />
            </View>
          )}
        </View>
        <View>
          {documentsGet &&
            documentsGet.map((doc) => (
              <View>
                <Text>{doc.url}</Text>
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
    backgroundColor: "white", // #F2F7FF
  },
});
