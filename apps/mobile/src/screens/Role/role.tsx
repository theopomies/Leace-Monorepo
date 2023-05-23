import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Swiper from "react-native-swiper";
import { trpc } from "../../utils/trpc";
import { RouterInputs } from "../../../../web/src/utils/trpc";
import { UserRoles } from "../../utils/enum";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";

const Role = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const createUser = trpc.user.createUser.useMutation();

  const utils = trpc.useContext();
  const data = utils.auth.getSession.getData();
  const userId = data?.userId || "";

  const userRole = trpc.user.updateUserRoleById.useMutation({
    onSuccess() {
      utils.auth.getSession.invalidate();
    },
  });

  const handleClick = async (
    e: { preventDefault: () => void },
    { role, userId }: RouterInputs["user"]["updateUserRoleById"],
  ) => {
    e.preventDefault();
    await createUser.mutateAsync();
    await userRole.mutateAsync({ role, userId });
    console.log(userRole);
    navigation.navigate("Stack", { userId: userId });
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="font-poppins text-custom mx-auto	mb-20 text-center text-3xl">
        CHOOSE YOUR ROLE
      </Text>
      <View className="flex h-1/2 w-5/6 items-center justify-center rounded-2xl border border-gray-400 shadow-xl">
        <Swiper
          showsButtons={true}
          loadMinimal
          loadMinimalSize={3}
          autoplay
          autoplayTimeout={5}
        >
          <TouchableOpacity
            onPress={(e) =>
              handleClick(e, {
                role: UserRoles.TENANT,
                userId: userId,
              })
            }
            className="flex h-full w-full items-center justify-center space-y-5"
          >
            <Image
              source={require("../../../assets/logo.png")}
              className="h-20 w-20 rounded-full "
            />
            <Text className="text-xl font-bold underline">TENANT</Text>
            <Text className="p-5 text-center">
              Finding the perfect apartment has never been easier! Swipe through
              our extensive selection of high-quality rentals and discover your
              dream home today.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) =>
              handleClick(e, {
                role: UserRoles.OWNER,
                userId: userId,
              })
            }
            className="flex h-full w-full items-center justify-center space-y-5"
          >
            <Image
              source={require("../../../assets/logo.png")}
              className="h-20 w-20 rounded-full "
            />
            <Text className="text-xl font-bold underline">OWNER</Text>
            <Text className="p-5 text-center">
              We take care of all the details, from marketing your property to
              managing lease agreements, so you can sit back and relax.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) =>
              handleClick(e, {
                role: UserRoles.AGENCY,
                userId: userId,
              })
            }
            className="flex  h-full w-full items-center justify-center space-y-5"
          >
            <Image
              source={require("../../../assets/logo.png")}
              className="h-20 w-20 rounded-full "
            />
            <Text className="text-xl font-bold underline">AGENCY</Text>
            <Text className="p-5 text-center">
              Effortlessly manage your rental portfolio with our powerful tools
              and innovative features. Join our network today and take your
              business to the next level!
            </Text>
          </TouchableOpacity>
        </Swiper>
      </View>
    </View>
  );
};

export default Role;
