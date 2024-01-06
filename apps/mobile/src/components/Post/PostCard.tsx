import { View, Text, TouchableOpacity, Image as RNIMage } from "react-native";
import React from "react";
import { Attribute, Post, Image } from "@prisma/client";
import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { trpc } from "../../utils/trpc";

interface IPostCard {
  data: Post & {
    attribute: Attribute | null;
    images: Image[];
  };
  userId: string;
}

export default function PostCard({ data, userId }: IPostCard) {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const { data: images, isLoading } = trpc.image.getSignedPostUrl.useQuery({
    postId: data.id,
  });

  if (isLoading) return null;

  return (
    <TouchableOpacity
      className="border-indigo mt-3 flex min-h-[100px] flex-row rounded-md border p-2"
      onPress={() => {
        navigation.navigate("PostInfo", {
          userId,
          postId: data.id,
          editable: true,
        });
      }}
    >
      {images && (
        <View>
          <RNIMage
            className="h-24 w-24 rounded-full"
            style={{ borderWidth: 2, borderColor: "white" }}
            source={{
              uri:
                images.length > 0
                  ? images[0]?.url
                  : "https://montverde.org/wp-content/themes/eikra/assets/img/noimage-420x273.jpg",
            }}
          />
        </View>
      )}
      <View className="flex-1 justify-between pl-2">
        <Text className="font-bold">{data.title}</Text>
        <Text className="font-bold">{data.desc}</Text>
        <View>
          <Text className="font-light">Price: {data.attribute?.price} €</Text>
          <Text className="font-light">
            Type:{" "}
            {data.attribute?.homeType === "APARTMENT" ? "Apartment" : "House"}
          </Text>
          <Text className="font-light">
            Status:{" "}
            <Text
              className={`font-bold ${
                data.type === "TO_BE_RENTED" ? "text-green-500" : "text-red-500"
              }`}
            >
              {data.type === "TO_BE_RENTED" ? "Available" : "Rented"}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
