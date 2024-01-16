import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";
import { IDefaultAttributes } from "../../types";
import { CreateAttributes } from "../../components/Attribute";
import { Btn } from "../../components/Btn";
import { LocalStorage } from "../../utils/cache";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { ZoomImageModal } from "../../components/Modal";
import { Icon } from "react-native-elements";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { Buffer } from "buffer";
import Toast from "react-native-toast-message";

export default function CreatePost() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "Stack">>();
  const { userId } = route.params;
  const [postInfo, setPostInfo] = useState({
    title: "",
    desc: "",
    content: "",
    energyClass: "A" as "A" | "B" | "C" | "D",
    ges: "A" as "A" | "B" | "C" | "D",
    constructionDate: new Date(),
    estimatedCost: "",
    nearestShops: "",
  });

  const [postAttrs, setPostAttrs] = useState<IDefaultAttributes | undefined>({
    postId: "",
    location: "",
    price: 0,
    size: 0,
    bedrooms: 0,
    bathrooms: 0,
    rentStartDate: new Date(),
    rentEndDate: new Date(),
    furnished: false,
    homeType: "HOUSE",
    terrace: false,
    pets: false,
    smoker: false,
    disability: false,
    garden: false,
    parking: false,
    elevator: false,
    pool: false,
    securityAlarm: false,
    internetFiber: false,
  });

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [bedroomsError, setBedroomsError] = useState("");
  const [bathroomsError, setBathroomsError] = useState("");

  const [images, setImages] = useState<
    { file: DocumentPicker.DocumentPickerAsset; id: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({ id: "", url: "" });

  const validateAndSetAttrs = () => {
    let isValid = true;

    if (!postInfo?.title || postInfo?.title.trim() === "") {
      setTitleError("Please enter a valid title");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!postInfo?.desc || postInfo.desc.trim() === "") {
      setDescriptionError("Please enter a valid description");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!postAttrs?.location || postAttrs.location.trim() === "") {
      setLocationError("Please enter a valid location");
      isValid = false;
    } else {
      setLocationError("");
    }

    if (!postAttrs?.price || postAttrs.price <= 0 || isNaN(postAttrs.price)) {
      setPriceError("Please enter a valid price");
      isValid = false;
    } else {
      setPriceError("");
    }

    if (!postAttrs?.size || postAttrs.size <= 0 || isNaN(postAttrs.size)) {
      setSizeError("Please enter a valid size");
      isValid = false;
    } else {
      setSizeError("");
    }

    if (
      !postAttrs?.bedrooms ||
      postAttrs.bedrooms <= 0 ||
      isNaN(postAttrs.bedrooms)
    ) {
      setBedroomsError("Please enter a valid number of bedrooms");
      isValid = false;
    } else {
      setBedroomsError("");
    }

    if (
      !postAttrs?.bathrooms ||
      postAttrs.bathrooms <= 0 ||
      isNaN(postAttrs.bathrooms)
    ) {
      setBathroomsError("Please enter a valid number of bathrooms");
      isValid = false;
    } else {
      setBathroomsError("");
    }

    if (isValid) {
      createPost();
    }
  };

  const uploadDocument = trpc.image.putSignedUrl.useMutation();

  const [loading, setLoading] = useState({
    status: false,
    message: "Submit",
  });

  const post = trpc.post.createPost.useMutation({});

  const attributes = trpc.attribute.updatePostAttributes.useMutation();

  async function createPost() {
    setLoading(() => ({ status: true, message: "Creating post..." }));
    const response = await post.mutateAsync(postInfo);
    await attributes.mutateAsync({ ...postAttrs, postId: response.id });
    Promise.all(
      images.map((a) =>
        uploadDocument
          .mutateAsync({
            postId: response.id,
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
        setLoading(() => ({ status: false, message: "Submit" }));
        LocalStorage.setItem("refreshPosts", true);
        navigation.navigate("MyPosts", { userId });
      })
      .catch((e) => {
        console.error(e);
        Toast.show({ type: "error", text1: "Could not create post" });
        setLoading(() => ({ status: false, message: "Submit" }));
      });
  }

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
      setImages((a) => [
        ...a,
        { file: document, id: (Math.random() * 10000).toFixed(0) },
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {open && (
          <ZoomImageModal
            image={selected}
            callback={() => setOpen(false)}
            delCallback={() => {
              setImages((a) => a.filter((b) => b.id !== selected.id));
              setOpen(false);
            }}
          />
        )}
        <View style={styles.view}>
          <Header />
          <ScrollView
            scrollEnabled={false}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ backgroundColor: "white" }}
          >
            <View className="flex-1 space-y-2 p-4">
              <View>
                <Text className="mb-1 text-lg font-semibold	 text-[#666666]">
                  Title
                </Text>
                <TextInput
                  style={{
                    color: "black",
                    padding: 4,
                    width: "100%",
                    height: 38,
                  }}
                  className={`focus:border-indigo rounded-md border p-2 font-light leading-loose`}
                  placeholder="Enter title..."
                  onChangeText={(text) => {
                    setPostInfo({ ...postInfo, title: text });
                    setTitleError("");
                  }}
                />
                {titleError ? (
                  <Text className="text-xs text-[#D84654]">{titleError}</Text>
                ) : null}
              </View>
              <Text className="text-lg font-semibold text-[#666666]">
                Images
              </Text>
              <View className="flex h-20 flex-row overflow-hidden rounded-md border">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 8,
                  }}
                >
                  {images.map((a, key) => (
                    <TouchableOpacity
                      key={key}
                      onPress={() => {
                        setSelected({ id: a.id, url: a.file.uri });
                        setOpen(true);
                      }}
                    >
                      <Image
                        source={{ uri: a.file.uri }}
                        className={"mr-2 h-16 w-16 rounded-md"}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View className="justify-center border-l-[1px] bg-[#6466f1]">
                  <TouchableOpacity
                    className="flex h-10 w-10 items-center justify-center"
                    onPress={pickDocument}
                  >
                    <Icon
                      name="add-circle-outline"
                      type="material-icons"
                      color={"white"}
                    ></Icon>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text className="mb-1 text-lg	font-semibold	 text-[#666666]">
                  Description
                </Text>
                <TextInput
                  style={{
                    padding: 4,
                    width: "100%",
                    height: 38,
                  }}
                  className={`focus:border-indigo rounded-md border p-2 font-light leading-loose`}
                  placeholder="Enter description..."
                  multiline
                  onChangeText={(text) => {
                    setPostInfo({ ...postInfo, desc: text });
                    setDescriptionError("");
                  }}
                />
                {descriptionError ? (
                  <Text className="text-xs text-[#D84654]">
                    {descriptionError}
                  </Text>
                ) : null}
              </View>
              <View className="flex-1">
                <CreateAttributes
                  attrs={postAttrs}
                  setAttrs={setPostAttrs}
                  locationError={locationError}
                  priceError={priceError}
                  sizeError={sizeError}
                  setLocationError={setLocationError}
                  setPriceError={setPriceError}
                  setSizeError={setSizeError}
                  bedroomsError={bedroomsError}
                  bathroomsError={bathroomsError}
                  setBedroomsError={setBedroomsError}
                  setBathroomsError={setBathroomsError}
                />
              </View>
              <View
                className={`items-center justify-center p-${
                  Platform.OS === "android" ? 2 : 10
                } ${Platform.OS === "android" ? "mt-20" : "mt-8"}`}
              >
                <Btn
                  className="w-full"
                  title={loading.message}
                  bgColor="#6466f1"
                  spinner={loading.status}
                  onPress={!loading.status ? validateAndSetAttrs : undefined}
                ></Btn>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ScrollView>
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
