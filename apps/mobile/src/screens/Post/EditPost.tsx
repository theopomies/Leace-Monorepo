import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { trpc } from "../../utils/trpc";
import { Icon } from "react-native-elements";
import { IDefaulAttributes } from "../../types";
import { CreateAttributes } from "../../components/Attribute";
import { Btn } from "../../components/Btn";
import { LocalStorage } from "../../utils/cache";

export default function EditPost() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "EditProfile">>();
  const { data, userId } = route.params;
  const [postInfo, setPostInfo] = useState<{
    postId: string;
    title: string;
    content: string;
    desc: string;
  }>();
  const [postAttrs, setPostAttrs] = useState<IDefaulAttributes>();
  const editPost = trpc.post.updatePostById.useMutation();
  const editAttrs = trpc.attribute.updatePostAttributes.useMutation({
    onSuccess() {
      LocalStorage.setItem("refreshPosts", true);
      LocalStorage.setItem("refreshPost", true);
      navigation.navigate("PostInfo", {
        userId,
        postId: postInfo?.postId ?? "",
        editable: true,
      });
    },
  });

  useFocusEffect(
    useCallback(() => {
      const parsed = JSON.parse(data);
      const { id, desc, title, content, attribute } = parsed;
      setPostInfo({ postId: id, desc, title, content });
      setPostAttrs({
        ...attribute,
        rentStartDate: new Date(attribute.rentStartDate),
        rentEndDate: new Date(attribute.rentEndDate),
      });
    }, [route]),
  );

  function handlePost() {
    if (!postInfo || !postAttrs) return;
    editPost.mutate(postInfo);
    editAttrs.mutate(postAttrs);
  }

  if (!postInfo || !postAttrs) return null;

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [sizeError, setSizeError] = useState("");

  const validateAndSetAttrs = () => {
    let isValid = true;

    if (!postInfo?.title || postInfo?.title.trim() === "") {
      setTitleError("Title is required");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!postAttrs?.location || postAttrs.location.trim() === "") {
      setDescriptionError("Description is required");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!postAttrs?.location || postAttrs.location.trim() === "") {
      setLocationError("Location is required");
      isValid = false;
    } else {
      setLocationError("");
    }

    if (!postAttrs?.price || postAttrs.price <= 0 || isNaN(postAttrs.price)) {
      setPriceError("Invalid price");
      isValid = false;
    } else {
      setPriceError("");
    }

    if (!postAttrs?.size || postAttrs.size <= 0 || isNaN(postAttrs.size)) {
      setSizeError("Invalid size");
      isValid = false;
    } else {
      setSizeError("");
    }

    if (isValid) {
      handlePost();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <View className="flex h-14 flex-row items-center">
          <TouchableOpacity
            className="ml-4"
            onPress={() =>
              navigation.navigate("PostInfo", {
                userId,
                postId: postInfo.postId,
                editable: true,
              })
            }
          >
            <Icon
              name="arrow-back"
              color="#0A2472"
              size={30}
              type="material-icons"
            ></Icon>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
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
                  className={`rounded-xl border border-black
                   p-${
                     Platform.OS === "ios" ? 4 : 2
                   } font-light leading-loose focus:border-[#6466f1]`}
                  placeholder="Enter title..."
                  onChangeText={(text) =>
                    setPostInfo({ ...postInfo, title: text })
                  }
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
                  className={`rounded-xl border border-black
                  p-${
                    Platform.OS === "ios" ? 4 : 2
                  } font-light leading-loose focus:border-[#6466f1]`}
                  placeholder="Enter description..."
                  onChangeText={(text) =>
                    setPostInfo({ ...postInfo, desc: text })
                  }
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
                  securityAlarm={false}
                  internetFiber={false}
                  setSecurityAlarm={function (bool: boolean): void {
                    throw new Error("Function not implemented.");
                  }}
                  setInternetFiber={function (bool: boolean): void {
                    throw new Error("Function not implemented.");
                  }}
                />{" "}
              </View>
              <View className="pt-2">
                <Btn
                  title="Update"
                  bgColor="#10316B"
                  onPress={validateAndSetAttrs}
                ></Btn>
              </View>
            </View>
          </ScrollView>
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
  },
});
