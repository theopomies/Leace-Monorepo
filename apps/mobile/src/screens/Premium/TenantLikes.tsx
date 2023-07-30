// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import React from "react";

// import { trpc } from "../../../../web/src/utils/trpc";

// const ClientCard = ({
//   firstName,
//   lastName,
//   email,
//   image,
//   onDislike,
//   onLike,
// }: {
//   firstName: string | null;
//   lastName: string | null;
//   email: string | null;
//   image: string | null;
//   onDislike: () => void;
//   onLike: () => void;
// }) => {
//   const handleDelete = () => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this client?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Delete",
//           onPress: () => {
//             onDislike();
//           },
//         },
//       ],
//     );
//   };

//   const imageUrl: string | undefined = image ?? undefined;

//   return (
//     <TouchableOpacity
//       className="max-w-400 w-full overflow-hidden rounded-2xl border border-gray-300"
//       onPress={() => {}}
//     >
//       <View className="flex-row items-center p-2">
//         <Image
//           source={{ uri: imageUrl }}
//           className="mr-10 h-20 w-20 rounded-full"
//         />
//         <View className="flex-1">
//           <Text className="text-18 mb-5 font-bold">
//             {firstName} {lastName}
//           </Text>
//           <Text className="text-14 mb-5 text-gray-600">{email}</Text>
//         </View>
//         <TouchableOpacity onPress={onLike}>
//           <Text style={{ color: "green", fontWeight: "bold", marginRight: 20 }}>
//             Accept
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleDelete}>
//           <Text style={{ color: "red", fontWeight: "bold" }}>Delete</Text>
//         </TouchableOpacity>
//       </View>
//       <View className="rounded-10 border-1 overflow-hidden border-gray-300" />
//     </TouchableOpacity>
//   );
// };

// const OwnerLikes = () => {
//   const { data: session } = trpc.auth.getSession.useQuery();

//   const rs = trpc.relationship.getLikesForOwner.useQuery({
//     userId: session?.userId as string,
//   });

//   const accept = trpc.relationship.likeTenantForPost.useMutation();

//   const acceptClient = async (postId: string, userId: string) => {
//     await accept.mutateAsync({
//       userId,
//       postId,
//     });
//   };

//   const del = trpc.relationship.dislikeTenantForPost.useMutation();

//   const deleteClient = async (postId: string, userId: string) => {
//     await del.mutateAsync({
//       userId,
//       postId,
//     });
//   };

//   return (
//     <ScrollView className="mx-5 mt-20" showsVerticalScrollIndicator={false}>
//       <View>
//         <View className="ml-10 flex-row items-center justify-center">
//           <Text className="font-p text-custom mx-auto mb-10	text-center text-3xl font-bold">
//             LIKES
//           </Text>
//         </View>
//         {rs.data?.relationship && rs.data.relationship.length > 0 ? (
//           rs.data.relationship.map((item) => (
//             <View key={item.id} className="mb-2 items-center">
//               <ClientCard
//                 firstName={item.user.firstName}
//                 lastName={item.user.lastName}
//                 email={item.user.email}
//                 image={item.user.image}
//                 onDislike={() => deleteClient(item.postId, item.userId)}
//                 onLike={() => acceptClient(item.postId, item.userId)}
//               />
//             </View>
//           ))
//         ) : (
//           <View className="bottom-80 left-0 right-0 top-80 items-center justify-center">
//             <Text className="items-center justify-center text-center text-3xl font-bold">
//               No one liked your post (Owner)
//             </Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default OwnerLikes;

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
import { Attribute, Post, Image, User } from "@leace/db";

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

export default function TenantLikes() {
  const [idx, setIdx] = useState(0);
  const { data: session } = trpc.auth.getSession.useQuery();

  const userId = session?.userId as string;

  const { data: rs, isLoading } = trpc.relationship.getLikesForTenant.useQuery({
    userId,
  });

  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const otherId = rs?.relationship?.[currentUserIndex]?.postId as string;

  const { data: attributes } = trpc.post.getPostById.useQuery({
    postId: otherId,
  });

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
      console.error(likePost);
    },
  });

  const dislikePost = trpc.relationship.dislikePostForTenant.useMutation({
    onSuccess() {
      console.log("post disliked !");
    },
    onError() {
      console.error(dislikePost);
    },
  });

  useEffect(() => {
    if (!rs || !rs?.relationship?.[currentUserIndex]) return;
    setPost(rs?.relationship?.[currentUserIndex]?.post);
  }, [rs]);

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Header />
          <Loading />
        </View>
      </View>
    );

  if (!rs?.relationship)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Header />
          <Text>Data not found</Text>
        </View>
      </View>
    );

  async function swipeHandler(move: "LEFT" | "RIGHT" | "REFRESH") {
    if (!rs || !post) return;
    if (move === "REFRESH") {
      setCurrentUserIndex(0);

      // missing refresh API call
      setIdx(0);
      setPost(rs?.relationship?.[currentUserIndex]);
      return;
    }
    if (move === "LEFT")
      await dislikePost.mutateAsync({
        userId: rs?.relationship?.[currentUserIndex]?.userId as string,
        postId: rs?.relationship?.[currentUserIndex]?.postId as string,
      });
    else
      await likePost.mutateAsync({
        userId: rs?.relationship?.[currentUserIndex]?.userId as string,
        postId: rs?.relationship?.[currentUserIndex]?.postId as string,
      });
    if (idx < (rs?.relationship?.length ?? 0) - 1) {
      setCurrentUserIndex((prevIndex) => prevIndex + 1);

      setPost(rs?.relationship?.[idx + 1]);
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
                        attributes.images[currentUserIndex]?.ext ??
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
                    {post.title}
                  </Text>
                  <Text className="mt-2 text-xs font-light text-white">
                    {post.desc}
                  </Text>
                  <Separator />
                  <View style={{ flex: 1 }}>
                    <View className="flex flex-row">
                      <Text className=" min-w-[68px] font-bold text-white">
                        Type:
                      </Text>
                      <Text className="font-light text-white">
                        {attributes?.attribute?.homeType === "HOUSE"
                          ? "House"
                          : "Apartment"}
                      </Text>
                    </View>
                    <View className="flex flex-row">
                      <Text className=" min-w-[68px] font-bold text-white">
                        Price:
                      </Text>
                      <Text className="font-light text-white">
                        {attributes?.attribute?.price}€
                      </Text>
                    </View>
                    <View className="flex flex-row">
                      <Text className=" min-w-[68px] font-bold text-white">
                        Size:
                      </Text>
                      <Text className="font-light text-white">
                        {attributes?.attribute?.size}m²
                      </Text>
                    </View>
                    <View className="flex flex-row">
                      <Text className="min-w-[68px] font-bold text-white">
                        Duration:
                      </Text>
                      <Text className="font-light text-white">
                        From{" "}
                        {attributes?.attribute?.rentStartDate?.toDateString()}{" "}
                        to {attributes?.attribute?.rentEndDate?.toDateString()}
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
                      {rs.relationship[
                        currentUserIndex
                      ]?.createdAt.toDateString()}
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
    backgroundColor: "#F2F7FF",
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
