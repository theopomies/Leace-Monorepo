import {
  View,
  Text,
  Image as RCImage,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Icon } from "react-native-elements";
import GestureRecognizer from "react-native-swipe-gestures";
import { trpc } from "../../utils/trpc";
import { Loading } from "../../components/Loading";
import { Btn } from "../../components/Btn";
import Separator from "../../components/Separator";
import { Report } from "../../components/Report";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
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


interface IAttributeCard {
  name: string;
  status: boolean | null;
  iconName: string;
  iconTextColor?: string;
  iconBGColor?: string;
}

function AttributeCard({
  name,
  status,
  iconName,
  iconTextColor,
  iconBGColor,
}: IAttributeCard) {
  return (
    <View
      className="flex min-w-[105px] h-14 flex-row items-center justify-center space-x-0.5 rounded-lg my-8"
      style={{
        backgroundColor: "#6C47FF",
        opacity: status ? 1 : 0.5,
      }}
    >
      <Icon
        name={iconName}
        color={"white"}
        size={20}
        type="material-icons"
      ></Icon>
      <Text className="text-md font-light text-white">{name}</Text>
    </View>
  );
}

export default function TenantStack() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "Stack">>();
  const { userId } = route.params;
  const [idx, setIdx] = useState(0);
  const { data, isLoading } = trpc.post.getPosts.useQuery();
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

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        <View style={styles.box}>
          {post && (
            <>
              <GestureRecognizer
                className="flex flex-1 rounded-2xl bg-white shadow shadow-sm shadow-gray-400 mb-2"
                onSwipeLeft={() => swipeHandler("LEFT")}
                onSwipeRight={() => swipeHandler("RIGHT")}
              >
                <TouchableOpacity className="flex flex-1" onPress={() => {
                  navigation.navigate("PostInfo", {
                    userId,
                    postId: post.id,
                    editable: false,
                  })
                }}>
                  <View className="h-80">
                    <RCImage
                      className="rounded-t-2xl"
                      source={{
                        uri:
                          post.images[0]?.ext ??
                          "https://montverde.org/wp-content/themes/eikra/assets/img/noimage-420x273.jpg",
                      }}
                      style={{ flex: 1, resizeMode: "cover" }}
                    ></RCImage>
                    <Report
                      className="absolute bottom-0 right-4 bottom-4 flex flex-row items-center space-x-2 rounded-br-md rounded-tl-md bg-red-500 p-2.5"
                      type="POST"
                      postId={post.id}
                    />
                  </View>
                  <View style={{ flex: 1 }} className="mx-6 mt-6">
                    <Text className="text-2xl font-bold text-black">
                      {post.title}
                    </Text>
                    <Text className=" text-xl font-light text-black mt-2">
                      {(post.attribute?.size ?? '-') + " m² - "}
                      {(post.attribute?.location ?? "No location") + " - " + capitalize(post.attribute?.homeType?.toLowerCase() ?? "No type")}
                    </Text>
                    <View style={{ flex: 1 }}>
                      {
                        /* <Text className="mt-2 text-xs font-light text-white">
                        {post.content}
                        </Text> */
                      }
                      {
                        /* <View className="flex flex-row">
                        <Text className="min-w-[68px] font-bold text-white">
                        Type:
                        </Text>
                        <Text className="font-light text-white">
                        {post.attribute?.homeType === "APARTMENT"
                        ? "Apartment"
                        : "House"}
                        </Text>
                        </View> */
                      }
                      {
                        /* <View className="flex flex-row">
                        <Text className=" min-w-[68px] font-bold text-white">
                        Size:
                        </Text>
                        <Text className="font-light text-white">
                        {post.attribute?.size} m²
                        </Text>
                        </View> */
                      }
                      <View className="flex flex-row mt-5">

                        <Text className="text-xl font-light text-black">
                          <Text className="font-bold text-xl" >
                            {post.attribute?.price} €
                          </Text>
                          /month
                        </Text>
                      </View>

                      <View className="flex flex-row text-black">
                        <Text className="min-w-[68px] text-xl">
                          {'Available from '}
                        </Text>
                        <Text className="font-bold text-xl">
                          {post.attribute?.rentStartDate?.toDateString()}
                        </Text>
                      </View>
                      <View className="flex flex-row w-full justify-evenly mt-[-4]">
                        <AttributeCard
                          name="Furnished"
                          status={post.attribute?.furnished!}
                          iconName="king-bed"
                          iconTextColor={"white"}
                          iconBGColor={"#6C47FF"}
                        />
                        <AttributeCard
                          name="Parking"
                          status={post.attribute?.parking!}
                          iconName="local-parking"
                          iconTextColor={"white"}
                          iconBGColor={"#6C47FF"}
                        />
                        <AttributeCard
                          name="Disability"
                          status={post.attribute?.disability!}
                          iconName="accessible"
                          iconTextColor={"white"}
                          iconBGColor={"#6C47FF"}
                        />


                      </View>
                    </View>
                    <View className="h-8 mb-2">
                      <Text className="font-base text-xl">
                        Created: {post.attribute?.createdAt?.toDateString()}
                      </Text>
                    </View>
                    {/* <Btn
                    title="More"
                    bgColor="#F2F7FF"
                    textColor="#0A2472"
                    onPress={() =>
                      navigation.navigate("PostInfo", {
                        userId,
                        postId: post.id,
                        editable: false,
                      })
                    }
                  ></Btn> */}
                  </View>
                </TouchableOpacity>
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
