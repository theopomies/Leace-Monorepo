import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  useRoute,
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { Icon } from "react-native-elements";
import { EditAttributes } from "../../components/Attribute";
import Separator from "../../components/Separator";
import { trpc } from "../../utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LocalStorage } from "../../utils/cache";
import { IUserAttrs } from "../../types";
import { EditInfo } from "../../components/UserProfile";

export default function EditProfile() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "EditProfile">>();
  const { data, userId, showAttrs } = route.params;
  const [user, setUser] = useState<{
    userId: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    description?: string;
    birthDate?: Date;
  }>();
  const [user1, setUser1] = useState<{
    image: string;
    isPremium: boolean;
    emailVerified: boolean;
    role: string;
    email: string;
  }>();
  const [attrs, setAttrs] = useState<IUserAttrs>();

  const userMutation = trpc.user.updateUserById.useMutation({
    onSuccess() {
      if (!showAttrs) {
        LocalStorage.setItem("refreshProfile", true);
        navigation.navigate("Profile", { userId });
      }
    },
    onError(error, variables, context) {
      console.log({ error, variables, context });
    },
  });
  const attributesMutation = trpc.attribute.updateUserAttributes.useMutation({
    onSuccess() {
      LocalStorage.setItem("refreshProfile", true);
      navigation.navigate("Profile", { userId });
    },
    onError(error, variables, context) {
      console.log({ error, variables, context });
    },
  });

  useFocusEffect(
    useCallback(() => {
      const parsed = JSON.parse(data);
      const {
        userId,
        firstName,
        lastName,
        phoneNumber,
        description,
        birthDate,
        attribute,
        image,
        role,
        isPremium,
        emailVerified,
        email,
      } = parsed;
      setUser({
        userId,
        firstName,
        lastName,
        phoneNumber,
        description,
        birthDate: new Date(birthDate),
      });
      setUser1({ image, isPremium, emailVerified, role, email });
      setAttrs({
        ...attribute,
        userId,
        rentStartDate: new Date(attribute.rentStartDate),
        rentEndDate: new Date(attribute.rentEndDate),
      });

      return () => {
        setUser(undefined);
        setAttrs(undefined);
      };
    }, [route]),
  );

  function updateUser() {
    if (!user) return;
    userMutation.mutate(user);
    if (showAttrs && attrs) {
      attributesMutation.mutate(attrs);
    }
  }

  if (!user || !user1 || !attrs) return null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: "white", paddingBottom: 20 }}
      >
        <View className="flex flex-row bg-[#10316B] px-3 py-2">
          <Image
            source={{
              uri: user1.image ?? "https://www.gravatar.com/avatar/?d=mp",
            }}
            className="h-24 w-24 rounded-full"
            style={{ borderWidth: 2, borderColor: "white" }}
          />
          <View className="flex flex-1 items-start justify-center px-4">
            <TextInput
              className="w-full text-xl font-bold text-white"
              placeholder="First Name"
              placeholderTextColor={"white"}
              defaultValue={user.firstName ?? ""}
              onChangeText={(text) => setUser({ ...user, firstName: text })}
            />
            <TextInput
              className="w-full text-white"
              placeholder="Last Name"
              placeholderTextColor={"white"}
              defaultValue={user.lastName ?? ""}
              onChangeText={(text) => setUser({ ...user, lastName: text })}
            />
          </View>
          <TouchableOpacity
            className="absolute bottom-1.5 right-2 flex flex-row items-center justify-center space-x-1 rounded-full px-2 py-0.5"
            style={{ borderWidth: 1, borderColor: "white" }}
            onPress={updateUser}
          >
            <Icon
              name="save"
              color="white"
              size={20}
              type="material-icons"
            ></Icon>
            <Text className="font-bold text-white">Save</Text>
          </TouchableOpacity>
        </View>
        <View className="pt-2">
          <View className="flex flex-row items-center justify-between px-2">
            <Text className="text-base font-bold text-[#10316B]">Kind:</Text>
            <Text className="font-light">{user1.role}</Text>
          </View>
          <View className="flex flex-row items-center justify-between px-2">
            <Text className="text-base font-bold text-[#10316B]">Premium:</Text>
            <Icon
              name={user1.isPremium ? "star" : "close"}
              color={user1.isPremium ? "#FFE867" : "red"}
              size={25}
              type="material-icons"
            ></Icon>
          </View>
          <View className="flex flex-row items-center justify-between px-2">
            <Text className="text-base font-bold text-[#10316B]">
              Verified:
            </Text>
            <Icon
              name={user1.emailVerified ? "done" : "close"}
              color={user1.emailVerified ? "green" : "red"}
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
            <Text className="text-base font-bold text-[#394867]">Email:</Text>
            <Text className="font-light">{user1.email}</Text>
          </View>
          <EditInfo user={user} setUser={setUser} />
          {showAttrs && (
            <View
              className="px-3"
              style={{ justifyContent: "flex-end", flex: 1 }}
            >
              <Separator color="#10316B" />
              <EditAttributes
                userId={userId}
                attrs={attrs}
                setAttrs={setAttrs}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
