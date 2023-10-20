import {
  View,
  Text,
  Platform,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";
import { IDefaulAttributes } from "../../types";
import { CreateAttributes } from "../../components/Attribute";
import { Btn } from "../../components/Btn";

export default function CreatePost() {
  const [postInfo, setPostInfo] = useState({
    title: "",
    desc: "",
    content: "",
  });
  const [postAttrs, setPostAttrs] = useState<IDefaulAttributes | undefined>({
    postId: "",
    location: "",
    price: 0,
    size: 0,
    rentStartDate: new Date(),
    rentEndDate: new Date(),
    furnished: false,
    house: false,
    appartment: false,
    terrace: false,
    pets: false,
    smoker: false,
    disability: false,
    garden: false,
    parking: false,
    elevator: false,
    pool: false,
  });

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [sizeError, setSizeError] = useState("");

  const validateAndSetAttrs = () => {
    let isValid = true;

    if (!postInfo?.title || postInfo?.title.trim() === "") {
      setTitleError("Please enter a valid title");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!postAttrs?.location || postAttrs.location.trim() === "") {
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

    if (isValid) {
      createPost();
    }
  };

  const post = trpc.post.createPost.useMutation({});

  const attributes = trpc.attribute.updatePostAttributes.useMutation({});

  async function createPost() {
    const response = await post.mutateAsync(postInfo);
    attributes.mutate({ ...postAttrs, postId: response.id });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: "white" }}
        >
          <View className="flex-1 space-y-2 p-4">
            <View>
              <Text className="text-sm font-semibold	 text-[#666666]">
                Title
              </Text>
              <TextInput
                style={{ borderColor: titleError ? "#D84654" : "black" }}
                className={`rounded-xl border p-${
                  Platform.OS === "ios" ? 4 : 2
                } font-light leading-loose focus:border-[#6466f1] `}
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
            <View>
              <Text className="text-sm	font-semibold	 text-[#666666]">
                Description
              </Text>
              <TextInput
                multiline
                style={{ borderColor: descriptionError ? "#D84654" : "black" }}
                className={`rounded-xl border
                p-${
                  Platform.OS === "ios" ? 4 : 2
                } font-light leading-loose focus:border-[#6466f1]`}
                placeholder="Enter description..."
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
              />
            </View>
            <View
              className={`justify-center p-${
                Platform.OS === "android" ? 2 : 10
              }`}
            >
              <Btn
                title="Submit"
                bgColor="#6466f1"
                onPress={validateAndSetAttrs}
              ></Btn>
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: "#F2F7FF",
  },
});