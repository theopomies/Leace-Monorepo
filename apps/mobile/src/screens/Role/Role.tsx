import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { trpc } from "../../utils/trpc";
import { UserRole } from "../../utils/enum";
import Swiper from "react-native-swiper";
// import { Role as LRole } from "@leace/db";

export default function Role() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const createUser = trpc.user.createUser.useMutation();

  const utils = trpc.useContext();
  const data = utils.auth.getSession.getData();
  console.log(JSON.stringify(data, null, 1));
  const userId = data?.userId || "";
  console.log({ userId });

  const userRole = trpc.user.updateUserRoleById.useMutation({
    onSuccess() {
      utils.auth.getSession.invalidate();
    },
  });

  async function submitRole(role: "TENANT" | "OWNER" | "AGENCY") {
    await createUser.mutateAsync();
    await userRole.mutateAsync({ role, userId });
    navigation.navigate("Stack", { userId });
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <View className="flex w-full flex-row items-center">
        <Image
          source={require("../../../assets/logo.png")}
          className="h-20 w-20 rounded-full"
        />
        <View className="flex-1">
          <Text className="text-center text-xl font-black">
            Choose your role
          </Text>
        </View>
      </View>
      <View
        className="flex h-1/2 items-center justify-center rounded-md border bg-[#F2F7FF]"
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Swiper
          showsButtons={true}
          loadMinimal
          loadMinimalSize={3}
          autoplay
          autoplayTimeout={5}
          className="text-[#10316B]"
        >
          <TouchableOpacity
            onPress={() => submitRole("TENANT")}
            className="mx-10 flex-1 items-center justify-center"
          >
            <Image
              source={require("../../../assets/mb-tenant.png")}
              className="mb-4 h-24 w-24 rounded-full"
              style={{ borderWidth: 2, borderColor: "black" }}
            />
            <View className="flex space-y-2">
              <Text className="text-center text-xl font-medium">TENANT</Text>
              <Text className="text-center italic">
                Finding the perfect apartment has never been easier! Swipe
                through our extensive selection of high-quality rentals and
                discover your dream home today.
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => submitRole("OWNER")}
            className="mx-10 flex-1 items-center justify-center"
          >
            <Image
              source={require("../../../assets/mb-owner.png")}
              className="mb-4 h-24 w-24 rounded-full"
              style={{ borderWidth: 2, borderColor: "black" }}
            />
            <View className="flex space-y-2">
              <Text className="text-center text-xl font-medium">OWNER</Text>
              <Text className="text-center italic">
                We take care of all the details, from marketing your property to
                managing lease agreements, so you can sit back and relax.
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => submitRole("AGENCY")}
            className="mx-10 flex-1 items-center justify-center"
          >
            <Image
              source={require("../../../assets/mb-agency.png")}
              className="mb-4 h-24 w-24 rounded-full"
              style={{ borderWidth: 2, borderColor: "black" }}
            />
            <View className="flex space-y-2">
              <Text className="text-center text-xl font-medium">AGENCY</Text>
              <Text className="text-center italic">
                Effortlessly manage your rental portfolio with our powerful
                tools and innovative features. Join our network today and take
                your business to the next level!
              </Text>
            </View>
          </TouchableOpacity>
        </Swiper>
      </View>
    </View>
  );
}
