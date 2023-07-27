import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
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
import { User } from "@leace/db";
import { Attribute } from "@prisma/client";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { trpc } from "../../utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LocalStorage } from "../../utils/cache";

export default function EditProfile() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "EditProfile">>();
  const { data, userId, showAttrs } = route.params;
  const [user, setUser] = useState<User & { attribute: Attribute | null }>();
  const [open, setOpen] = useState(false);

  const userMutation = trpc.user.updateUserById.useMutation({
    onSuccess() {
      if (!showAttrs) {
        LocalStorage.setItem("refreshProfile", true);
        navigation.navigate("Profile", { userId });
      }
    },
  });
  const attributesMutation = trpc.attribute.updateUserAttributes.useMutation({
    onSuccess() {
      LocalStorage.setItem("refreshProfile", true);
      navigation.navigate("Profile", { userId });
    },
  });

  useFocusEffect(
    useCallback(() => {
      let parsed = JSON.parse(data);
      let tmpData = parsed.birthDate ?? new Date();
      parsed = {
        ...parsed,
        birthDate: typeof tmpData === "string" ? new Date(tmpData) : tmpData,
      };
      setUser({ ...parsed });
      return () => setUser(undefined);
    }, [route]),
  );

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    if (!user || !date) return;
    setOpen(false);
    setUser({ ...user, birthDate: date });
  };

  function updateUser() {
    if (!user) return;
    userMutation.mutate({
      userId,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      phoneNumber: user.phoneNumber ?? undefined,
      description: user.description ?? undefined,
      birthDate: user.birthDate ?? undefined,
    });
    if (showAttrs) {
      attributesMutation.mutate({
        userId,
        minSize: user.attribute?.minSize ?? 0,
        maxSize: user.attribute?.maxSize ?? 0,
        minPrice: user.attribute?.minPrice ?? 0,
        maxPrice: user.attribute?.maxPrice ?? 0,
        furnished: user.attribute?.furnished ?? false,
        terrace: user.attribute?.terrace ?? false,
        pets: user.attribute?.pets ?? false,
        smoker: user.attribute?.smoker ?? false,
        disability: user.attribute?.disability ?? false,
        garden: user.attribute?.garden ?? false,
        parking: user.attribute?.parking ?? false,
        elevator: user.attribute?.elevator ?? false,
        pool: user.attribute?.pool ?? false,
      });
    }
  }

  return (
    <>
      {user && (
        <View style={{ flex: 1 }}>
          {open && (
            <DateTimePicker
              testID="dateTimePicker"
              value={user.birthDate || new Date()}
              mode={"date"}
              onChange={onChange}
            />
          )}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ backgroundColor: "white", paddingBottom: 20 }}
          >
            <View className="flex flex-row bg-[#10316B] px-3 py-2">
              <Image
                source={{
                  uri: user.image ?? "https://www.gravatar.com/avatar/?d=mp",
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
                <Text className="text-base font-bold text-[#10316B]">
                  Kind:
                </Text>
                <Text className="font-light">{user.role}</Text>
              </View>
              <View className="flex flex-row items-center justify-between px-2">
                <Text className="text-base font-bold text-[#10316B]">
                  Premium:
                </Text>
                <Icon
                  name={user.isPremium ? "star" : "close"}
                  color={user.isPremium ? "#FFE867" : "red"}
                  size={25}
                  type="material-icons"
                ></Icon>
              </View>
              <View className="flex flex-row items-center justify-between px-2">
                <Text className="text-base font-bold text-[#10316B]">
                  Verified:
                </Text>
                <Icon
                  name={user.emailVerified ? "done" : "close"}
                  color={user.emailVerified ? "green" : "red"}
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
                <Text className="text-base font-bold text-[#394867]">
                  Country:
                </Text>
                <TextInput
                  className="font-light"
                  placeholder="France"
                  defaultValue={user.country ?? ""}
                  onChangeText={(text) => setUser({ ...user, country: text })}
                />
              </View>
              <View className="flex flex-row items-center justify-between px-2">
                <Text className="text-base font-bold text-[#394867]">
                  Phone:
                </Text>
                <TextInput
                  className="font-light"
                  // @ts-ignore
                  inputMode="tel"
                  placeholder="0123456789"
                  defaultValue={user.phoneNumber ?? ""}
                  onChangeText={(text) =>
                    setUser({ ...user, phoneNumber: text })
                  }
                />
              </View>
              <View className="flex flex-row items-center justify-between px-2">
                <Text className="text-base font-bold text-[#394867]">
                  Birthdate:
                </Text>
                <TouchableOpacity onPress={() => setOpen(true)}>
                  <Text className="font-light">
                    {user.birthDate?.toLocaleDateString() ?? "-"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex flex-row items-center justify-between px-2">
                <Text className="text-base font-bold text-[#394867]">
                  Email:
                </Text>
                <Text className="font-light">{user.email}</Text>
              </View>
              <View className="flex px-2">
                <Text className="text-base font-bold text-[#10316B]">
                  Description:
                </Text>
                <TextInput
                  multiline
                  className="font-light"
                  placeholder="I am..."
                  defaultValue={user.description ?? ""}
                  onChangeText={(text) =>
                    setUser({ ...user, description: text })
                  }
                />
              </View>
              {showAttrs && (
                <View
                  className="px-3"
                  style={{ justifyContent: "flex-end", flex: 1 }}
                >
                  <Separator color="#10316B" />
                  <EditAttributes user={user} setUser={setUser} />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
}
