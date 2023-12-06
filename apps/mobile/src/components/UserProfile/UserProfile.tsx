import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { User } from "@leace/db";
import { Attribute } from "@prisma/client";
import Separator from "../Separator";
import { Divider, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
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
    <ScrollView className="">
      {showLogout && (
        <View className="px-3 pb-2 w-fit h-fit">
          <TouchableOpacity
            className=" items-end top-6 rounded-full"
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            onPress={() => {
              signOut();
            }}
          >
            <Icon
              name="logout"
              color="#6C47FF"
              size={35}
              type="material-icons"
            ></Icon>
          </TouchableOpacity>
        </View>
      )}
      <View className="flex flex-col items-center px-3 py-2">
        <Image
          source={{
            uri: data.image ?? "https://www.gravatar.com/avatar/?d=mp",
          }}
          className="h-24 w-24 rounded-full"
          style={{ borderWidth: 1.5, borderColor: "#111827" }}
        />


        <View className="flex flex-row items-center justify-center px-4 space-x-2 py-2">
          <Text className="text-3xl font-bold">{data.firstName}</Text>
          <Text className="text-3xl ">{data.lastName}</Text>
          {data.emailVerified && (
            <Icon className="bg-[#2196F3] h-fit w-fit p-1 flex items-center justify-center rounded-full"
              name={"done"}
              color={"white"}
              size={25}
              type="material-icons"
            ></Icon>
          )}
        </View>
      </View>
      <View className="flex justify-center items-center h-14">
        <View className="flex flex-col items-center bg-[#6C47FF] space-x-2 space-y-1 py-3 w-full">
          <Text className="text-xl font-bold text-white">{data.isPremium ? "Premium " + data.role : "Not premium " + data.role}</Text>
          <Text className="text-sm text-white">{"Member since: " + data.createdAt.toLocaleDateString("fr-FR")}</Text>
        </View>
        <View className="flex ml-96">
          {editable && (
            <TouchableOpacity
              className="absolute bottom-5 right-[-8] rounded-full"
              onPress={() => {
                navigation.navigate("EditProfileRefacto", {
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
          )}

        </View>
      </View>

      {/* bg-[#F1F5F9] rounded-xl shadow shadow-md shadow-gray-400 */}
      <View className="pt-4 flex flex-col w-full px-4">
        <View className="flex flex-row items-center px-6 space-x-2 w-full h-12">
          <Text className="text-xl font-bold text-[#111827]">Email:</Text>
          <Text className="text-lg font-light">{data.email}</Text>
        </View>

        <View className="flex flex-row items-center px-6 space-x-2 w-full h-12">
          <Text className="text-xl font-bold text-[#111827]">Phone:</Text>
          <Text className="text-lg font-light">{data.phoneNumber}</Text>
        </View>

        <View className="flex flex-row items-center px-6 space-x-2 w-full h-12">
          <Text className="text-xl font-bold text-[#111827]">Birthday:</Text>
          <Text className="text-lg font-light">{data.birthDate?.toLocaleDateString('fr-FR') ?? "-"}</Text>
        </View>
        <View className="flex flex-row items-center px-6 space-x-2 w-full h-12">
          <Text className="text-xl font-bold text-[#111827]">Location:</Text>
          <Text className="text-lg font-light">{data.attribute?.location ?? "-"}</Text>
        </View>

        <View className="flex flex-col items-start px-6 space-y-2 w-full h-36 mb-2">
          <Text className="mt-2 text-xl font-bold text-[#111827]">Description:</Text>
          <View className="h-20 w-full border-2 border-gray border-dashed rounded-xl p-2">
            <Text className="font-light">{data.description}</Text>
          </View>
        </View>
        <Divider width={2}></Divider>
      </View>
      {showAttrs && (
        <>
          {data.attribute && (
            <ShowAttributes attribute={data.attribute} />
          )}
        </>
      )}

    </ScrollView>
  );
}
