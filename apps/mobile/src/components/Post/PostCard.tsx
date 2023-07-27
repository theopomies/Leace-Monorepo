import { View, Text, TouchableOpacity, Image as RNIMage } from "react-native";
import React from "react";
import { Attribute, Post, Image } from "@prisma/client";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";

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

  return (
    <TouchableOpacity
      className="mt-3 flex min-h-[100px] flex-row rounded-md bg-[#10316B] p-2"
      onPress={() =>
        navigation.navigate("PostInfo", {
          userId,
          postId: data.id,
          editable: true,
        })
      }
    >
      <View>
        <RNIMage
          className="h-24 w-24 rounded-full"
          style={{ borderWidth: 2, borderColor: "white" }}
          source={{
            uri:
              data.images[0]?.ext ??
              "https://montverde.org/wp-content/themes/eikra/assets/img/noimage-420x273.jpg",
          }}
        />
      </View>
      <View className="flex-1 justify-between pl-2">
        <Text className="font-bold text-white">{data.title}</Text>
        <View>
          <Text className="font-light text-white">
            Price: {data.attribute?.price} €
          </Text>
          <Text className="font-light text-white">
            Type: {data.attribute?.appartment ? "Appartment" : "House"}
          </Text>
          <Text className="font-light text-white">
            Status:{" "}
            <Text
              className={`font-light ${
                data.type === "TO_BE_RENTED" ? "text-red-500" : "text-green-500"
              }`}
            >
              {data.type}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
