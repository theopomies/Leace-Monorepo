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
import Separator from "../../components/Separator";
import { Report } from "../../components/Report";
import { User } from "@leace/db";
import { Type } from "../../utils/enum";

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

export default function ProviderStack() {
  const [idx, setIdx] = useState(0);
  const { data: session } = trpc.auth.getSession.useQuery();

  const userId = session?.userId as string;
  console.log({ userId });

  const { data: posts, isLoading } = trpc.post.getPostsByUserId.useQuery({
    userId,
    postType: Type.TO_BE_RENTED,
  });

  let postId = "";

  if (posts) {
    postId = posts[0]?.attribute?.postId as string;
  }

  const { data: users } = trpc.post.getUsersToBeSeen.useQuery({
    postId,
  });

  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const otherId = users?.[currentUserIndex]?.id as string;
  console.log({ otherId });

  const { data: attributes } = trpc.user.getUserById.useQuery({
    userId: otherId,
  });

  const [post, setPost] = useState<User[] | undefined>();

  const likePost = trpc.relationship.likeTenantForPost.useMutation({
    onSuccess() {
      console.log("post liked !");
    },
    onError() {
      console.error("post like error");
    },
  });

  const dislikePost = trpc.relationship.dislikeTenantForPost.useMutation({
    onSuccess() {
      console.log("post disliked !");
    },
    onError() {
      console.error("post disliked error");
    },
  });

  useEffect(() => {
    if (!users || !users[0]) return;
    setPost(users);

    console.log(post);
  }, [users]);

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Header />
          <Loading />
        </View>
      </View>
    );

  if (!users)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Header />
          <Text>Data not found</Text>
        </View>
      </View>
    );

  function swipeHandler(move: "LEFT" | "RIGHT" | "REFRESH") {
    if (!users || !post) return;
    if (move === "REFRESH") {
      setCurrentUserIndex(0);

      // missing refresh API call
      setIdx(0);
      setPost(users);
      return;
    }
    if (move === "LEFT")
      dislikePost.mutate({
        userId: users[currentUserIndex]?.id as string,
        postId,
      });
    else
      likePost.mutate({
        userId: users[currentUserIndex]?.id as string,
        postId,
      });
    if (idx < (users?.length ?? 0) - 1) {
      setCurrentUserIndex((prevIndex) => prevIndex + 1);

      setPost([users[idx + 1]]);
      setIdx(() => idx + 1);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        <View style={styles.box}>
          {post && attributes ? (
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
                        post[0]?.image ??
                        "https://montverde.org/wp-content/themes/eikra/assets/img/noimage-420x273.jpg",
                    }}
                    style={{ flex: 1, resizeMode: "contain" }}
                  ></RCImage>
                  <Report
                    className="absolute bottom-0 right-4 flex flex-row items-center space-x-2 rounded-br-md rounded-tl-md bg-red-500 p-2.5"
                    type="USER"
                    userId={otherId}
                  />
                </View>
                <View style={{ flex: 1 }} className="mx-4 mt-2">
                  <Text className="text-lg font-bold text-white">
                    {post[0]?.firstName} {post[0]?.lastName}
                  </Text>
                  <Text className="mt-2 text-xs font-light text-white">
                    {post[0]?.description}
                  </Text>
                  <Separator />
                  <View style={{ flex: 1 }}>
                    <View className="flex flex-row"></View>
                    <View className="flex flex-row">
                      <Text className=" min-w-[68px] font-bold text-white">
                        Size:
                      </Text>
                      <Text className="font-light text-white">
                        {attributes?.attribute?.minSize}m² -{" "}
                        {attributes?.attribute?.maxSize}m²
                      </Text>
                    </View>
                    <View className="flex flex-row">
                      <Text className=" min-w-[68px] font-bold text-white">
                        Budget:
                      </Text>
                      <Text className="font-light text-white">
                        {attributes?.attribute?.minPrice}€ -{" "}
                        {attributes?.attribute?.maxPrice}€
                      </Text>
                    </View>

                    <View className="flex flex-row">
                      <Text className="min-w-[68px] font-bold text-white">
                        Start:
                      </Text>
                      <Text className="font-light text-white">
                        {attributes?.attribute?.rentStartDate?.toDateString()}
                      </Text>
                    </View>
                  </View>
                  <View className="flex flex-row flex-wrap items-center justify-center gap-1.5">
                    {attributes?.attribute?.homeType === "APARTMENT" ? (
                      <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                        Apartment
                      </Text>
                    ) : null}
                    {attributes?.attribute?.homeType === "HOUSE" ? (
                      <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                        House
                      </Text>
                    ) : null}
                    {attributes?.attribute?.terrace ? (
                      <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                        Terrace
                      </Text>
                    ) : null}
                    {attributes?.attribute?.smoker ? (
                      <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                        Smoker
                      </Text>
                    ) : null}
                    {attributes?.attribute?.elevator ? (
                      <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                        Elevator
                      </Text>
                    ) : null}
                    {attributes?.attribute?.pets ? (
                      <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                        Pets
                      </Text>
                    ) : null}
                    {attributes?.attribute?.pool ? (
                      <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                        Pool
                      </Text>
                    ) : null}
                    {attributes?.attribute?.disability ? (
                      <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                        Accessible
                      </Text>
                    ) : null}
                    {attributes?.attribute?.parking ? (
                      <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                        Parking
                      </Text>
                    ) : null}
                    {attributes?.attribute?.garden ? (
                      <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                        Garden
                      </Text>
                    ) : null}
                  </View>
                  {/* <Btn
                    title="More"
                    bgColor="#F2F7FF"
                    textColor="#10316B"
                    onPress={() =>
                      navigation.navigate("PostInfo", {
                        userId,
                        postId,
                        editable: false,
                      })
                    }
                  ></Btn> */}
                  <Separator />
                  <View className="mb-3 flex flex-row">
                    <Text className="font-bold text-white">Created: </Text>
                    <Text className="text-white">
                      {post[0]?.createdAt.toDateString()}
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
          ) : (
            <View style={styles.centerContainer}>
              <Text style={styles.noPostText}>No posts available.</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostText: {
    fontSize: 18,
    fontWeight: "bold",
  },
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
