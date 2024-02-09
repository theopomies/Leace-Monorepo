import {
  View,
  Text,
  Image as RCImage,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import { Icon } from "react-native-elements";
import GestureRecognizer from "react-native-swipe-gestures";
import { trpc } from "../../utils/trpc";
import { Loading } from "../../components/Loading";
import { Report } from "../../components/Report";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import Toast from "react-native-toast-message";
import { AppRouter } from "@leace/api";
import { inferRouterOutputs } from "@trpc/server";

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

function AttributeCard({ name, status, iconName }: IAttributeCard) {
  return (
    <View
      className="my-8 flex h-14 min-w-[95px] flex-row items-center justify-center space-x-0.5 rounded-lg"
      style={{
        backgroundColor: "#6466f1",
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

type RouterOutput = inferRouterOutputs<AppRouter>;

type Posts = RouterOutput["post"]["getPostsToBeSeen"]["postsToBeSeen"];
type PostItem = Posts[0];

export default function TenantStack() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "Stack">>();
  const { userId } = route.params;
  const [idx, setIdx] = useState(0);

  const [post, setPost] = useState<PostItem>();
  const [lastPost, setLastPost] = useState<PostItem>();

  const { data, isLoading, refetch } = trpc.post.getPostsToBeSeen.useQuery(
    {
      userId,
    },
    {
      onSuccess(data) {
        setPost(data.postsToBeSeen[0]);
      },
    },
  );

  const { data: images, isLoading: imagesLoading } =
    trpc.image.getSignedPostUrl.useQuery(
      { postId: post?.id ?? "" },
      { enabled: !!post?.id },
    );

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

  const rewindPost = trpc.relationship.rewindPostForTenant.useMutation({
    onSuccess() {
      console.log("post rewind!");
    },
    onError() {
      console.error("post rewind error");
    },
  });

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
    if (!data) return;
    if (data.postsToBeSeen)
      if (move === "REFRESH") {
        if (lastPost) {
          setIdx(() => idx - 1);
          rewindPost.mutate({ userId, postId: lastPost.id });
          setPost(lastPost);
          setLastPost(undefined);
        } else {
          Toast.show({
            type: "error",
            text1: "You can't rewind yet",
            text2: "You have to like or dislike a post first.",
          });
        }
        return;
      }
    if (!post) return;
    if (move === "LEFT") {
      dislikePost.mutate({ userId, postId: post.id });
    } else likePost.mutate({ userId, postId: post.id });
    setLastPost(data.postsToBeSeen[idx]);
    if (idx < data.postsToBeSeen.length - 1) {
      setPost(data.postsToBeSeen[idx + 1]);
    } else {
      setPost(undefined);
    }
    setIdx(() => idx + 1);
  }

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header callback={refetch} />
        <View style={styles.box}>
          {post === undefined && (
            <>
              <View className=" mx-16 h-full justify-center">
                <Text className="text-center text-2xl text-black">
                  No more posts available for now
                </Text>
                <View className="absolute bottom-2.5 w-full items-center justify-center">
                  <ActionButton
                    iconName="refresh"
                    iconType="material-icons"
                    iconColor="#FFEA00"
                    onPress={() => swipeHandler("REFRESH")}
                  />
                </View>
              </View>
            </>
          )}
          {post && (
            <>
              <GestureRecognizer
                className="mb-2 flex flex-1 rounded-2xl bg-white shadow-sm shadow-gray-400"
                onSwipeLeft={() => swipeHandler("LEFT")}
                onSwipeRight={() => swipeHandler("RIGHT")}
              >
                <TouchableOpacity
                  className="flex flex-1"
                  onPress={() => {
                    navigation.navigate("PostInfo", {
                      userId,
                      postId: post.id,
                      editable: false,
                    });
                  }}
                >
                  <View className="h-72">
                    {imagesLoading ? (
                      <>
                        <View className="flex-1 items-center justify-center">
                          <ActivityIndicator
                            color={"#6366f1"}
                            size={"large"}
                          ></ActivityIndicator>
                        </View>
                      </>
                    ) : (
                      <>
                        <RCImage
                          className="rounded-t-2xl"
                          source={{
                            uri: images
                              ? images.length > 0
                                ? images[0]?.url
                                : "https://montverde.org/wp-content/themes/eikra/assets/img/noimage-420x273.jpg"
                              : "https://montverde.org/wp-content/themes/eikra/assets/img/noimage-420x273.jpg",
                          }}
                          style={{ flex: 1, resizeMode: "cover" }}
                        ></RCImage>
                        <Report
                          className="absolute bottom-0 right-0 flex flex-row items-center space-x-2 rounded-tl-md bg-red-500 p-2.5"
                          type="POST"
                          postId={post.id}
                        />
                      </>
                    )}
                  </View>
                  <View style={{ flex: 1 }} className="mx-5 mt-6">
                    <Text className="text-2xl font-bold text-black">
                      {post.title}
                    </Text>
                    <Text className=" mt-2 text-xl font-light text-black">
                      {(post.attribute?.size ?? "-") + " m² - "}
                      {(post.attribute?.location ?? "No location") +
                        " - " +
                        capitalize(
                          post.attribute?.homeType?.toLowerCase() ?? "No type",
                        )}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <View className="mt-5 flex flex-row">
                        <Text className="text-xl font-light text-black">
                          <Text className="text-xl font-bold">
                            {post.attribute?.price} €
                          </Text>
                          /month
                        </Text>
                      </View>

                      <View className="flex flex-row text-black">
                        <Text className="min-w-[68px] text-xl">
                          {"Available from "}
                        </Text>
                        <Text className="text-xl font-bold">
                          {post.attribute?.rentStartDate?.toDateString()}
                        </Text>
                      </View>
                      <View className="mt-[-4] flex w-full flex-row justify-evenly">
                        <AttributeCard
                          name="Furnished"
                          status={post.attribute?.furnished ?? false}
                          iconName="king-bed"
                          iconTextColor={"white"}
                          iconBGColor={"#6C47FF"}
                        />
                        <AttributeCard
                          name="Parking"
                          status={post.attribute?.parking ?? false}
                          iconName="local-parking"
                          iconTextColor={"white"}
                          iconBGColor={"#6C47FF"}
                        />
                        <AttributeCard
                          name="Disability"
                          status={post.attribute?.disability ?? false}
                          iconName="accessible"
                          iconTextColor={"white"}
                          iconBGColor={"#6C47FF"}
                        />
                      </View>
                    </View>
                    <View className="mb-2 h-8">
                      <Text className="font-base text-xl">
                        Created: {post.attribute?.createdAt?.toDateString()}
                      </Text>
                    </View>
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
