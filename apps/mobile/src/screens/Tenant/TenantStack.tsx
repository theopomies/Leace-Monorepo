import {
  View,
  Text,
  Image as RCImage,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Icon } from "react-native-elements";
import GestureRecognizer from "react-native-swipe-gestures";
import { trpc } from "../../utils/trpc";
import Loading from "../../components/Loading";
import { Btn } from "../../components/Btn";
import Separator from "../../components/Separator";
import { Report } from "../../components/Report";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { Post, Attribute, Image } from "@leace/db";

interface IActionButton {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  iconName: string;
  iconType: string;
  iconColor: string;
}

function ActionButton({
  onPress,
  iconName,
  iconType,
  iconColor,
}: IActionButton) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex items-center justify-center rounded-full border-4"
      style={{ ...styles.actButton, borderColor: iconColor }}
    >
      <Icon size={40} name={iconName} type={iconType} color={iconColor}></Icon>
    </TouchableOpacity>
  );
}

export default function TenantStack() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "Stack">>();
  const { userId } = route.params;
  const [idx, setIdx] = useState(0);
  const { data, isLoading, refetch } = trpc.post.getPosts.useQuery();
  const [post, setPost] = useState<
    | Post & {
        attribute: Attribute | null;
        images: Image[];
      }
  >();
  const likePost = trpc.relationship.likePostForTenant.useMutation({
    onSuccess() {
      console.log("post liked !");
    },
    onError() {
      console.error("post like error");
    },
  });
  const dislikePost = trpc.relationship.dislikePostForTenant.useMutation({
    onSuccess() {
      console.log("post disliked !");
    },
    onError() {
      console.error("post disliked error");
    },
  });

  useEffect(() => {
    if (!data || !data[0]) return;
    setPost(data[0]);
  }, [data]);

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Header />
          <Loading />
        </View>
      </View>
    );

  if (!data)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Header />
          <Text>Data not found</Text>
        </View>
      </View>
    );

  function swipeHandler(move: "LEFT" | "RIGHT" | "REFRESH") {
    if (!data || !post) return;
    if (move === "REFRESH") {
      // missing refresh API call
      setIdx(0);
      setPost(data[0]);
      return;
    }
    if (move === "LEFT") dislikePost.mutate({ userId, postId: post.id });
    else likePost.mutate({ userId, postId: post.id });
    if (idx < data.length - 1) {
      setPost(data[idx + 1]);
      setIdx(() => idx + 1);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        <View style={styles.box}>
          {post && (
            <>
              <GestureRecognizer
                className="flex flex-1 rounded-md bg-[#10316B]"
                onSwipeLeft={() => swipeHandler("LEFT")}
                onSwipeRight={() => swipeHandler("RIGHT")}
              >
                <View className="mt-4 h-48 px-4">
                  <RCImage
                    className="rounded-md"
                    source={{
                      uri:
                        post.images[0]?.ext ??
                        "https://montverde.org/wp-content/themes/eikra/assets/img/noimage-420x273.jpg",
                    }}
                    style={{ flex: 1, resizeMode: "contain" }}
                  ></RCImage>
                  <Report
                    className="absolute bottom-0 right-4 flex flex-row items-center space-x-2 rounded-br-md rounded-tl-md bg-red-500 p-2.5"
                    type="POST"
                    postId={post.id}
                  />
                </View>
                <View style={{ flex: 1 }} className="mx-4 mt-2">
                  <Text className="text-lg font-bold text-white">
                    {post.title}
                  </Text>
                  <Text className="mt-2 text-xs font-light text-white">
                    {post.content}
                  </Text>
                  <Separator />
                  <View style={{ flex: 1 }}>
                    <View className="flex flex-row">
                      <Text className="min-w-[68px] font-bold text-white">
                        Type:
                      </Text>
                      <Text className="font-light text-white">
                        {post.attribute?.homeType === "APARTMENT"
                          ? "Apartment"
                          : "House"}
                      </Text>
                    </View>
                    <View className="flex flex-row">
                      <Text className=" min-w-[68px] font-bold text-white">
                        Size:
                      </Text>
                      <Text className="font-light text-white">
                        {post.attribute?.size} m²
                      </Text>
                    </View>
                    <View className="flex flex-row">
                      <Text className=" min-w-[68px] font-bold text-white">
                        Price:
                      </Text>
                      <Text className="font-light text-white">
                        {post.attribute?.price} €
                      </Text>
                    </View>

                    <View className="flex flex-row">
                      <Text className="min-w-[68px] font-bold text-white">
                        Available:
                      </Text>
                      <Text className="font-light text-white">
                        {post.attribute?.rentStartDate?.toDateString()}
                      </Text>
                    </View>
                  </View>
                  <Btn
                    title="More"
                    bgColor="#F2F7FF"
                    textColor="#10316B"
                    onPress={() =>
                      navigation.navigate("PostInfo", {
                        userId,
                        postId: post.id,
                        editable: false,
                      })
                    }
                  ></Btn>
                  <Separator />
                  <View className="mb-3 flex flex-row">
                    <Text className="font-bold text-white">Created: </Text>
                    <Text className="text-white">
                      {post.createdAt.toDateString()}
                    </Text>
                  </View>
                </View>
              </GestureRecognizer>
              <View className="my-2 flex h-16 flex-row items-center justify-around">
                <ActionButton
                  iconName="close"
                  iconType="material-icons"
                  iconColor="#EF4444"
                  onPress={() => swipeHandler("LEFT")}
                />
                <ActionButton
                  iconName="refresh"
                  iconType="material-icons"
                  iconColor="#FFEA00"
                  onPress={() => swipeHandler("REFRESH")}
                />
                <ActionButton
                  iconName="favorite"
                  iconType="material-icons"
                  iconColor="#22c55e"
                  onPress={() => swipeHandler("RIGHT")}
                />
              </View>
            </>
          )}
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
  },
  box: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  actButton: {
    height: 60,
    width: 60,
    backgroundColor: "#FFF",
    borderWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
