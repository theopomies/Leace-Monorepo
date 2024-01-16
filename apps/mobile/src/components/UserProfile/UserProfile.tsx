import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { User } from "@leace/db";
import { Attribute } from "@prisma/client";
import Separator from "../Separator";
import { Divider, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { Btn } from "../Btn";
import { useAuth } from "@clerk/clerk-expo";
import ShowAttributes from "../Attribute/ShowAttributesRefacto";

interface IUserProfile {
  userId: string;
  data: User & { attribute: Attribute | null };
  editable?: boolean;
  showAttrs?: boolean;
  showLogout: boolean;
}

export default function UserProfile({
  userId,
  data,
  editable = false,
  showAttrs = true,
  showLogout,
}: IUserProfile) {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const { signOut } = useAuth();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex flex-col px-3 py-2">
        <View className="relative flex items-center">
          {editable && (
            <View className="absolute right-0 top-0">
              <TouchableOpacity onPress={() => signOut()}>
                <Icon
                  name="logout"
                  color="#6C47FF"
                  size={35}
                  type="material-icons"
                ></Icon>
              </TouchableOpacity>
            </View>
          )}
          <View className="h-24 w-24">
            <Image
              source={{
                uri: data.image ?? "https://www.gravatar.com/avatar/?d=mp",
              }}
              className="h-full w-full rounded-full"
              style={{ borderWidth: 1.5, borderColor: "#111827" }}
            />
          </View>
        </View>
      </View>
      <View className="flex flex-row items-center justify-center space-x-2 px-4 text-center">
        <Text className="text-3xl font-bold">{data.firstName}</Text>
        <Text className="text-3xl ">{data.lastName}</Text>
        {data.emailVerified && (
          <Icon
            className="flex h-fit w-fit items-center justify-center rounded-full bg-[#2196F3] p-1"
            name={"done"}
            color={"white"}
            size={25}
            type="material-icons"
          ></Icon>
        )}
      </View>
      <View className="bg-indigo relative flex w-full flex-col items-center space-x-2 space-y-1 py-3">
        {editable && (
          <View className="absolute right-0 top-5 pr-1">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EditProfile", {
                  userId: userId,
                  data: JSON.stringify({
                    ...data,
                    birthDate: data.birthDate?.toISOString(),
                  }),
                  showAttrs: showAttrs,
                });
              }}
            >
              <Icon
                name="settings"
                color="white"
                size={38}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          </View>
        )}
        {editable && (
          <View className="absolute left-0 top-5 pl-1">
            <TouchableOpacity
              onPress={() => navigation.navigate("Documents", { userId })}
            >
              <Icon
                name="description"
                color="white"
                size={38}
                type="material-icons"
              ></Icon>
            </TouchableOpacity>
          </View>
        )}
        <Text className="text-xl font-bold text-white">
          {data.isPremium ? "Premium " + data.role : "Not premium " + data.role}
        </Text>
        <Text className="text-sm text-white">
          {"Member since: " + data.createdAt.toLocaleDateString("fr-FR")}
        </Text>
      </View>
      <View className="flex w-full flex-col px-4 pt-4">
        <View className="flex h-12 w-full flex-row items-center space-x-2">
          <Text className="text-xl font-bold text-[#111827]">Email:</Text>
          <Text className="text-lg font-light">{data.email}</Text>
        </View>

        <View className="flex h-12 w-full flex-row items-center space-x-2">
          <Text className="text-xl font-bold text-[#111827]">Phone:</Text>
          <Text className="text-lg font-light">{data.phoneNumber}</Text>
        </View>

        <View className="flex h-12 w-full flex-row items-center space-x-2">
          <Text className="text-xl font-bold text-[#111827]">Birthday:</Text>
          <Text className="text-lg font-light">
            {data.birthDate?.toLocaleDateString("fr-FR") ?? "-"}
          </Text>
        </View>
        <View className="flex h-12 w-full flex-row items-center space-x-2">
          <Text className="text-xl font-bold text-[#111827]">Location:</Text>
          <Text className="text-lg font-light">
            {data.attribute?.location ?? "-"}
          </Text>
        </View>

        <View className="mb-2 flex h-36 w-full flex-col items-start space-y-2">
          <Text className="mt-2 text-xl font-bold text-[#111827]">
            Description:
          </Text>
          <View className="border-gray h-20 w-full rounded-xl border-2 border-dashed p-2">
            <Text className="font-light">{data.description}</Text>
          </View>
        </View>
        <Separator color="#d3d3d3" />
      </View>
      {showAttrs && (
        <>{data.attribute && <ShowAttributes attribute={data.attribute} />}</>
      )}
    </ScrollView>
  );
}
