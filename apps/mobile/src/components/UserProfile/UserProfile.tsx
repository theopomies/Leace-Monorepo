import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { User } from "@leace/db";
import { Attribute } from "@prisma/client";
import { ShowAttributes } from "../Attribute";
import Separator from "../Separator";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { Btn } from "../Btn";
import { useAuth } from "@clerk/clerk-expo";

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
    <View className="flex-1">
      <View className="flex flex-row bg-[#10316B] px-3 py-2">
        <Image
          source={{
            uri: data.image ?? "https://www.gravatar.com/avatar/?d=mp",
          }}
          className="h-24 w-24 rounded-full"
          style={{ borderWidth: 2, borderColor: "white" }}
        />
        <View className="flex flex-1 items-start justify-center px-4">
          <Text className="text-xl font-bold text-white">{data.firstName}</Text>
          <Text className="text-white ">{data.lastName}</Text>
        </View>
        {editable && (
          <TouchableOpacity
            className="absolute bottom-1.5 right-2 flex flex-row items-center justify-center space-x-1 rounded-full px-2 py-0.5"
            style={{ borderWidth: 1, borderColor: "white" }}
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
              size={20}
              type="material-icons"
            ></Icon>
            <Text className="font-bold text-white">Settings</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="pt-2">
        <View className="flex flex-row items-center justify-between px-2">
          <Text className="text-base font-bold text-[#10316B]">Kind:</Text>
          <Text className="font-light">{data.role}</Text>
        </View>
        <View className="flex flex-row items-center justify-between px-2">
          <Text className="text-base font-bold text-[#10316B]">Premium:</Text>
          <Icon
            name={data.isPremium ? "star" : "close"}
            color={data.isPremium ? "#FFE867" : "red"}
            size={25}
            type="material-icons"
          ></Icon>
        </View>
        <View className="flex flex-row items-center justify-between px-2">
          <Text className="text-base font-bold text-[#10316B]">Verified:</Text>
          <Icon
            name={data.emailVerified ? "done" : "close"}
            color={data.emailVerified ? "green" : "red"}
            size={25}
            type="material-icons"
          ></Icon>
        </View>
      </View>
      <View className="px-3">
        <Separator color="#10316B" />
      </View>
      <View style={{ flex: 1 }}>
        <View className="flex flex-row items-center justify-between px-2">
          <Text className="text-base font-bold text-[#394867]">Location:</Text>
          <Text className="font-light">{data.attribute?.location ?? "-"}</Text>
        </View>
        <View className="flex flex-row items-center justify-between px-2">
          <Text className="text-base font-bold text-[#394867]">Phone:</Text>
          <Text className="font-light">{data.phoneNumber ?? "-"}</Text>
        </View>
        <View className="flex flex-row items-center justify-between px-2">
          <Text className="text-base font-bold text-[#394867]">Birthdate:</Text>
          <Text className="font-light">
            {data.birthDate?.toLocaleDateString() ?? "-"}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between px-2">
          <Text className="text-base font-bold text-[#394867]">Email:</Text>
          <Text className="font-light">{data.email}</Text>
        </View>
        <View className="flex px-2">
          <Text className="text-base font-bold text-[#10316B]">
            Description:
          </Text>
          <Text className="font-light">{data.description}</Text>
        </View>
      </View>
      {showAttrs && (
        <>
          {data.attribute && (
            <View className="mb-3 px-3">
              <Separator color="#10316B" />
              <ShowAttributes attribute={data.attribute} />
            </View>
          )}
        </>
      )}
      {showLogout && (
        <View className="px-3 pb-2">
          <Btn title="Log out" bgColor="#EF4444" onPress={() => signOut()} />
        </View>
      )}
    </View>
  );
}
