import {
  View,
  ScrollView,
  Platform,
  StatusBar,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import { Button, Icon } from "react-native-elements";

import GestureRecognizer from "react-native-swipe-gestures";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import Carousel from "react-native-snap-carousel";

interface IAnnounceAttrs {
  id: string;
  userId: string;
  postId: null;
  location: string;
  lat: null;
  lng: null;
  maxPrice: number;
  minPrice: number;
  maxSize: number;
  minSize: number;
  range: number;
  price: null;
  size: null;
  rentStartDate: null;
  rentEndDate: null;
  furnished: boolean;
  homeType: null;
  terrace: boolean;
  pets: boolean;
  smoker: boolean;
  disability: boolean;
  garden: boolean;
  parking: boolean;
  elevator: boolean;
  pool: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IAnnounceImage {
  id: string;
  ext: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

interface IAnnouceCard {
  id: string;
  createdById: string;
  title: string;
  content: string;
  desc: string;
  type: "RENTED" | "TO_BE_RENTED";
  createdAt: string;
  updatedAt: string;
  images: IAnnounceImage[];
  attribute: IAnnounceAttrs;
}

function AnnounceCard({ data, userId }: { data: any; userId: string }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [reportText, setReportText] = useState("");
  const [message, setMessage] = useState("");
  const [inspect, setInspect] = useState(false);
  const [idx, setIdx] = useState(0);

  const likePost = trpc.relationship.likePostForTenant.useMutation({
    onSuccess() {
      console.log("post liked !");
      setMessage("Liked");
    },
  });
  const dislikePost = trpc.relationship.dislikePostForTenant.useMutation({
    onSuccess() {
      console.log("post disliked !");
      setMessage("Disliked");
    },
    onError() {
      console.error("post disliked error");
    },
  });

  const reportPost = trpc.report.reportPostById.useMutation({
    onSuccess() {
      console.log("post reported");
    },
  });

  function formatDate(date: any) {
    return `${date.getUTCDate()}/${
      date.getUTCMonth() + 1
    }/${date.getUTCFullYear()}`;
  }

  function _renderItem({ item, index }: { item: any; index: number }) {
    return (
      <Image
        className="rounded-xl"
        source={{ uri: item.ext }}
        style={{ flex: 1, resizeMode: "contain" }}
      ></Image>
    );
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
                        postId: data.id,
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
      )}
      <GestureRecognizer
        onSwipeLeft={(state) => {
          if (inspect) return;
          dislikePost.mutate({ userId, postId: data.id });
        }}
        onSwipeRight={(state) => {
          if (inspect) return;
          likePost.mutate({ userId, postId: data.id });
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
          <View className={`h-48 ${inspect ? "flex items-center" : ""}`}>
            {inspect ? (
              <Carousel
                layout={"default"}
                data={data.images}
                sliderWidth={300}
                itemWidth={300}
                renderItem={_renderItem}
                onSnapToItem={(index) => setIdx(index)}
              />
            ) : (
              <Image
                className="rounded-xl"
                source={{ uri: data.images[0]?.ext }}
                style={{ flex: 1, resizeMode: "contain" }}
              ></Image>
            )}
          </View>
          <View className="flex flex-row flex-wrap items-center justify-around gap-1 py-1 pt-4">
            <View className="flex items-center justify-center rounded-md border border-[#9BA4B4] bg-[#394867] px-2 py-0.5">
              <Text className="text-white">From</Text>
              <Text className="text-white">
                {formatDate(data.attribute.rentStartDate)}
              </Text>
            </View>
            <View className="flex items-center justify-center rounded-md border border-[#9BA4B4] bg-[#394867] px-2 py-0.5">
              <Text className="text-white">To</Text>
              <Text className="text-white">
                {formatDate(data.attribute.rentEndDate)}
              </Text>
            </View>
            <View className="flex items-center justify-center rounded-md border border-[#9BA4B4] bg-[#394867] px-2 py-0.5">
              <Text className="text-white">Price</Text>
              <Text className="text-white">{data.attribute.price}€</Text>
            </View>
            <View className="flex items-center justify-center rounded-md border border-[#9BA4B4] bg-[#394867] px-2 py-0.5">
              <Text className="text-white">Size</Text>
              <Text className="text-white">{data.attribute.size}</Text>
            </View>
          </View>
          {inspect && (
            <View className="mt-1">
              <Text className="text-lg font-bold text-white">Owner:</Text>
              <View className="flex w-full flex-row items-center justify-between">
                <View className="flex flex-row items-center gap-2">
                  <Image
                    className="rounded-full"
                    source={{ uri: data.createdBy.image }}
                    style={{ height: 32, width: 32 }}
                  ></Image>
                  <Text className="text-white">
                    {data.createdBy.firstName} {data.createdBy.lastName}
                  </Text>
                </View>
                <Text className="text-red-500">{data.createdBy.status}</Text>
              </View>
            </View>
          )}
          <View className="mt-1 flex-1">
            <Text className="text-lg font-bold text-white">Description:</Text>
            <ScrollView className="mb-2">
              <Text className="text-white">{data.content}</Text>
            </ScrollView>
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
                  onPress={() => likePost.mutate({ userId, postId: data.id })}
                >
                  <Text className="text-white">Like</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded bg-red-500 px-4 py-1"
                  onPress={() =>
                    dislikePost.mutate({ userId, postId: data.id })
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
            {data.attribute?.terrace ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Terrace
              </Text>
            ) : null}
            {data.attribute?.smoker ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Smoker
              </Text>
            ) : null}
            {data.attribute?.elevator ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Elevator
              </Text>
            ) : null}
            {data.attribute?.pets ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Pets
              </Text>
            ) : null}
            {data.attribute?.pool ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Pool
              </Text>
            ) : null}
            {data.attribute?.disability ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Accessible
              </Text>
            ) : null}
            {data.attribute?.parking ? (
              <Text className="rounded-full border border-[#9BA4B4] bg-white px-2 py-0.5">
                Garage
              </Text>
            ) : null}
            {data.attribute?.garden ? (
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
              dislikePost.mutate({ userId, postId: data.id });
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
              likePost.mutate({ userId, postId: data.id });
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

export const Stack = () => {
  const { data, isLoading, refetch } = trpc.post.getPosts.useQuery();
  const route = useRoute<RouteProp<TabStackParamList, "Stack">>();
  const userId = route.params?.userId;
  console.log({ userId });

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
          {data && <AnnounceCard data={data[0]} userId={userId} />}
        </>
      )}
    </View>
  );
};
