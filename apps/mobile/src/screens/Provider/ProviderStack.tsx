import {
  View,
  Platform,
  StatusBar,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Button, Icon } from "react-native-elements";

import GestureRecognizer from "react-native-swipe-gestures";
import { trpc } from "../../../../web/src/utils/trpc";
import { Type } from "../../utils/enum";

function AnnounceCard({
  data,
  attributes,
  userId,
}: {
  data: any;
  attributes: any;
  userId: string;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [reportText, setReportText] = useState("");
  const [message, setMessage] = useState("");
  const [inspect, setInspect] = useState(false);
  const [idx, setIdx] = useState(0);

  const likeUser = trpc.relationship.likeTenantForPost.useMutation({
    onSuccess() {
      console.log("post liked !");
      setMessage("Liked");
    },
  });
  const dislikeUser = trpc.relationship.dislikeTenantForPost.useMutation({
    onSuccess() {
      console.log("post disliked !");
      setMessage("Disliked");
    },
    onError() {
      console.error("post disliked error");
    },
  });

  const reportPost = trpc.report.reportUserById.useMutation({
    onSuccess() {
      console.log("post reported");
    },
  });

  function formatDate(date: any) {
    return `${date.getUTCDate()}/${
      date.getUTCMonth() + 1
    }/${date.getUTCFullYear()}`;
  }

  return (
    <View
      className={`flex flex-1 flex-col ${
        inspect ? "" : "gap-2 bg-[#F2F7FF] p-4"
      }`}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setReportText("");
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
          }}
        >
          <View
            className="flex w-3/4 rounded-md bg-white p-4"
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
            <Text className="text-md font-bold text-[#002642]">
              REPORT POST
            </Text>
            <View className="mt-1 flex gap-2">
              <Text>Reason:</Text>
              <TextInput
                className="rounded border border-black px-2"
                numberOfLines={6}
                onChangeText={(text) => {
                  setReportText(text);
                }}
              ></TextInput>
              <View className="flex flex-row items-center justify-center space-x-4">
                <View className="bg-green-100">
                  <Button
                    className="rounded text-white"
                    title="Cancel"
                    buttonStyle={{ backgroundColor: "#002642" }}
                    onPress={() => {
                      setModalVisible(false);
                      setReportText("");
                    }}
                  />
                </View>
                <View>
                  <Button
                    className="rounded text-white"
                    title="Report"
                    buttonStyle={{ backgroundColor: "rgb(239 68 68)" }}
                    onPress={() => {
                      reportPost.mutate({
                        userId: data.id,
                        reason: "SCAM",
                        desc: reportText,
                      });
                      setReportText("");
                      setModalVisible(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {inspect && (
        <>
          <TouchableOpacity
            className="flex h-8 flex-row items-start bg-[#10316B] pl-4 pt-1"
            onPress={() => setInspect(false)}
          >
            <Icon
              size={30}
              name="arrow-back-ios"
              type="material-icons"
              color={"white"}
            ></Icon>
            <View className="flex h-8 items-center justify-center">
              <Text className="font-bold text-white">Back</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
      <GestureRecognizer
        onSwipeLeft={(state) => {
          if (inspect) return;
          likeUser.mutate({ userId, postId: data.id });
        }}
        onSwipeRight={(state) => {
          if (inspect) return;
          dislikeUser.mutate({ userId, postId: data.id });
        }}
        style={{
          flex: 1,
        }}
      >
        <View
          className={`flex flex-1 flex-col bg-[#10316B] p-4 text-white ${
            inspect ? "pt-1" : "rounded-xl"
          }`}
        >
          <View className={`h-48 `}>
            <Image
              className="rounded-xl"
              source={{ uri: data.image }}
              style={{ flex: 1, resizeMode: "contain" }}
            ></Image>
          </View>
          <Text className="text-white">
            {data.firstName} {data.lastName}
          </Text>
          <View className="flex flex-row flex-wrap items-center justify-around gap-1 py-1 pt-4">
            <View className="flex items-center justify-center rounded-md border border-[#9BA4B4] bg-[#394867] px-2 py-0.5">
              <Text className="text-white">Start</Text>
              <Text className="text-white">
                {formatDate(attributes.attribute.rentStartDate)}
              </Text>
            </View>
            <View className="flex items-center justify-center rounded-md border border-[#9BA4B4] bg-[#394867] px-2 py-0.5">
              <Text className="text-white">Budget</Text>
              <Text className="text-white">
                {attributes.attribute.minPrice}$ -{" "}
                {attributes.attribute.maxPrice}$
              </Text>
            </View>
            <View className="flex items-center justify-center rounded-md border border-[#9BA4B4] bg-[#394867] px-2 py-0.5">
              <Text className="text-white">Size</Text>
              <Text className="text-white">
                {attributes.attribute.minSize}m² -{" "}
                {attributes.attribute.maxSize}m²
              </Text>
            </View>
          </View>
          {inspect && (
            <View className="mt-1">
              <Text className="text-lg font-bold text-white">Tenant:</Text>
              <View className="flex w-full flex-row items-center justify-between">
                <View className="flex flex-row items-center gap-2">
                  <Image
                    className="rounded-full"
                    source={{ uri: data.image }}
                    style={{ height: 32, width: 32 }}
                  ></Image>
                  <Text className="text-white">
                    {data.firstName} {data.lastName}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View className="mb-2 mt-1 flex-1">
            <Text className="text-white">{data.description}</Text>
          </View>
          <View
            style={{
              borderBottomColor: "#F2F7FF",
              borderBottomWidth: 1,
            }}
          />
          <View className="flex h-12 flex-row items-center justify-around">
            {!inspect && (
              <TouchableOpacity
                className="rounded bg-[#F2F7FF] px-4 py-1"
                onPress={() => setInspect(true)}
              >
                <Text className="">More</Text>
              </TouchableOpacity>
            )}
            {inspect && (
              <>
                <TouchableOpacity
                  className="rounded bg-green-500 px-4 py-1"
                  onPress={() => likeUser.mutate({ userId, postId: data.id })}
                >
                  <Text className="text-white">Like</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded bg-red-500 px-4 py-1"
                  onPress={() =>
                    dislikeUser.mutate({ userId, postId: data.id })
                  }
                >
                  <Text className="text-white">Dislike</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              className="rounded bg-red-500 px-4 py-1"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white">Report</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: "#F2F7FF",
              borderBottomWidth: 1,
              marginBottom: 12,
            }}
          />
          <View className="flex flex-row flex-wrap items-center justify-center gap-1.5">
            {attributes.attribute?.homeType === "APARTMENT" ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Apartment
              </Text>
            ) : null}
            {attributes.attribute?.homeType === "HOUSE" ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                House
              </Text>
            ) : null}
            {attributes.attribute?.terrace ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Terrace
              </Text>
            ) : null}
            {attributes.attribute?.smoker ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Smoker
              </Text>
            ) : null}
            {attributes.attribute?.elevator ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Elevator
              </Text>
            ) : null}
            {attributes.attribute?.pets ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Pets
              </Text>
            ) : null}
            {attributes.attribute?.pool ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Pool
              </Text>
            ) : null}
            {attributes.attribute?.disability ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Accessible
              </Text>
            ) : null}
            {attributes.attribute?.parking ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Parking
              </Text>
            ) : null}
            {attributes.attribute?.garden ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Garden
              </Text>
            ) : null}
          </View>
        </View>
      </GestureRecognizer>
      {!inspect && (
        <View className="flex h-16 flex-row items-center justify-around rounded-lg">
          <TouchableOpacity
            onPress={() => {
              dislikeUser.mutate({ userId, postId: data.id });
            }}
            className="flex items-center justify-center rounded-full border-4 border-red-500"
            style={{
              height: 60,
              width: 60,
              backgroundColor: "#FFF",
              borderWidth: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Icon
              size={40}
              name="close"
              type="material-icons"
              color={"red"}
            ></Icon>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log("reload post")}
            className="flex items-center justify-center rounded-full border-4 border-[#FFEA00]"
            style={{
              height: 60,
              width: 60,
              backgroundColor: "#FFF",
              borderWidth: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            {/**<Icon
              size={40}
              name="refresh"
              type="material-icons"
              color={"#FFEA00"}
            ></Icon> */}
            <Text>{message}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              likeUser.mutate({ userId, postId: data.id });
            }}
            className="flex items-center justify-center rounded-full border-4 border-green-500 drop-shadow-md"
            style={{
              height: 60,
              width: 60,
              backgroundColor: "#FFF",
              borderWidth: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Icon
              size={38}
              name="favorite"
              type="material-icons"
              color={"#22c55e"}
            ></Icon>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export const ProviderStack = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const userId = session?.userId as string;

  const {
    data: posts,
    isLoading,
    refetch,
  } = trpc.post.getPostsByUserId.useQuery({
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

  let otherId = "";

  if (users) {
    otherId = users[0]?.id as string;
  }

  const { data: attributes } = trpc.user.getUserById.useQuery({
    userId: otherId,
  });

  console.log(attributes);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#002642" />
        </View>
      ) : (
        <>
          <View
            className="flex items-center justify-center bg-white"
            style={{
              height: 70,
              marginTop:
                Platform.OS === "android" ? StatusBar.currentHeight : 20,
              borderBottomColor: "#d3d3d3", // Light grey color
              borderBottomWidth: 1,
              zIndex: 1,
            }}
          >
            <Image
              className="h-16 w-16"
              source={require("../../../assets/logo.png")}
            ></Image>
          </View>
          {users && attributes && (
            <AnnounceCard
              data={users[0]}
              attributes={attributes}
              userId={userId}
            />
          )}
        </>
      )}
    </View>
  );
};
