import { View, Text, ScrollView, Modal } from "react-native";
import React, { useState } from "react";
import { Btn } from "../../components/Btn";
import * as DocumentPicker from "expo-document-picker";
import { DocType } from "@leace/db";
import { Picker } from "@react-native-picker/picker";
import { trpc } from "../../utils/trpc";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { Buffer } from "buffer";

export default function UploadDocuments({ userId }: { userId: string }) {
  const utils = trpc.useContext();

  const [documents, setDocuments] = useState<
    { file: DocumentPicker.DocumentPickerAsset; docType: DocType; id: number }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<{
    name: string;
    docType: DocType;
  }>({
    name: "",
    docType: "IDENTITY_CARD",
  });
  const uploadDocument = trpc.document.putSignedUrl.useMutation();
  const [loading, setLoading] = useState({
    status: false,
    message: "Finish setting me up",
  });

  async function pickDocument() {
    try {
      const picked: {
        assets: DocumentPicker.DocumentPickerAsset[];
        canceled: boolean;
      } = (await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any;
      if (picked.canceled) throw new Error("Document picker canceled");
      const [document] = picked.assets;
      if (!document) throw new Error("Document picker failed");
      if (!document.mimeType || !document.uri)
        throw new Error("Invalid document");
      const [exist] = documents.filter((a) => a.id === idx);
      setSelectedDoc((a) => ({ ...a, name: document.name }));
      if (!exist)
        setDocuments((docs) => [
          ...docs,
          { file: document, docType: selectedDoc.docType, id: idx },
        ]);
      else
        setDocuments((docs) =>
          docs.map((a) =>
            a.docType === selectedDoc.docType ? { ...a, file: document } : a,
          ),
        );
    } catch (e) {
      console.error(e);
    }
  }

  function getDocument(id: number): { name: string; docType: DocType } {
    const [doc] = documents.filter((a) => a.id === id);
    if (!doc) return { name: "Not found", docType: "IDENTITY_CARD" };
    return { name: doc.file.name, docType: doc.docType };
  }

  function finishOnboarding() {
    setLoading(() => ({ status: true, message: "Uploading files..." }));
    Promise.all(
      documents.map((a) =>
        uploadDocument
          .mutateAsync({
            userId,
            docType: a.docType,
            fileName: a.file.name,
            fileType: a.file.mimeType as string,
          })
          .then(async (url) => {
            if (!url) return;
            const fileContent = await FileSystem.readAsStringAsync(a.file.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const buffer = Buffer.from(fileContent, "base64");
            await axios({
              method: "PUT",
              url: url,
              data: buffer,
              headers: { "Content-Type": a.file.mimeType },
            });
          }),
      ),
    )
      .then(() => {
        utils.document.invalidate();
        utils.onboarding.invalidate();
        utils.user.invalidate();
        utils.auth.invalidate();
      })
      .catch((e) => console.error(e));
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-center px-8">
          <View
            className="rounded-md bg-white p-4"
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
            <Text className="font-bold">Document type</Text>
            <Picker
              mode="dropdown"
              selectedValue={selectedDoc.docType}
              onValueChange={(item) =>
                setSelectedDoc((a) => ({ ...a, docType: item }))
              }
            >
              <Picker.Item label="Identity Card" value="IDENTITY_CARD" />
              <Picker.Item label="Passport" value="PASSPORT" />
              <Picker.Item label="Driver License" value="DRIVER_LICENSE" />
              <Picker.Item label="Residence Permit" value="RESIDENCE_PERMIT" />
            </Picker>
            <View className="h-10">
              <Text className="font-bold">Document name</Text>
              <Text>{selectedDoc.name}</Text>
            </View>
            <View className="flex flex-row space-x-2 pt-3">
              <View className="flex-1">
                <Btn
                  title="Select document"
                  onPress={() => pickDocument()}
                  bgColor="#38a169"
                ></Btn>
              </View>
              <View className="flex-1">
                <Btn title="Close" onPress={() => setOpen(false)}></Btn>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View className="flex h-40 flex-col justify-center px-8">
        <Text className="text-3xl font-bold">One more thing,</Text>
        <Text className="text-lg font-bold">
          we will need some documents to ensure the safety of our community
        </Text>
      </View>
      <View className="flex flex-1 flex-col gap-3 px-8">
        <View className="flex flex-col">
          <Text className="font-bold">Identity document</Text>
          <View className="flex flex-row items-center justify-between">
            <Text>{getDocument(0).name}</Text>
            <Btn
              title="Add"
              onPress={() => {
                setIdx(0);
                setSelectedDoc(getDocument(0));
                setOpen(true);
              }}
            ></Btn>
          </View>
        </View>
        <View className="flex flex-col">
          <Text className="font-bold">Proof of residence</Text>
          <View className="flex flex-row items-center justify-between">
            <Text>{getDocument(1).name}</Text>
            <Btn
              title="Add"
              onPress={() => {
                setIdx(1);
                setSelectedDoc(getDocument(1));
                setOpen(true);
              }}
            ></Btn>
          </View>
        </View>
      </View>
      <View className="px-8 pb-4">
        <Btn
          title={loading.message}
          bgColor="#6C47FF"
          onPress={!loading.status ? finishOnboarding : undefined}
        />
      </View>
    </ScrollView>
  );
}
