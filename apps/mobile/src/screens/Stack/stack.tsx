import {
  View,
  ScrollView,
  Platform,
  StatusBar,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { trpc } from "../../utils/trpc";
import { Icon } from "react-native-elements";

import { ReportModal } from "../../components/Modal";

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

function AnnounceCard({ data }: { data: IAnnouceCard }) {
  function formatDate(date: any) {
    return `${date.getUTCDate()}/${
      date.getUTCMonth() + 1
    }/${date.getUTCFullYear()}`;
  }

  return (
    <View className="flex flex-1 flex-col gap-2 bg-[#F2F7FF] p-4">
      <View className="flex flex-1 flex-col rounded-xl bg-[#10316B] p-4 text-white">
        <View className="h-48">
          <Image
            className="rounded-xl"
            source={{ uri: data.images[0]?.ext }}
            style={{ flex: 1, resizeMode: "contain" }}
          ></Image>
        </View>
        <View className="mt-1 flex-1">
          <Text className="text-lg font-bold text-white">Description:</Text>
          <ScrollView className="mb-2">
            <Text className="text-white">{data.content}</Text>
          </ScrollView>
        </View>
        <View className="mb-3 flex flex-row flex-wrap items-center justify-around gap-1 py-1">
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
      <View className="flex h-16 flex-row items-center justify-around rounded-lg">
        <View
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
        </View>
        <View
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
          <Icon
            size={40}
            name="refresh"
            type="material-icons"
            color={"#FFEA00"}
          ></Icon>
        </View>
        <View
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
        </View>
      </View>
    </View>
  );
}

export const Stack = () => {
  const { data, isLoading, refetch } = trpc.post.getPosts.useQuery({});

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
          <AnnounceCard data={data[0]} />
        </>
      )}
    </View>
  );
};
