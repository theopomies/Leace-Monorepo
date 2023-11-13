import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { trpc } from "../../utils/trpc";
import Swiper from "react-native-swiper";
import Header from "../../components/Header";
import Separator from "../../components/Separator";
import { Btn } from "../../components/Btn";
import { EditAttributes } from "../../components/Attribute";
import { IUserAttrs } from "../../types";
import { EditInfo } from "../../components/UserProfile";

export default function ChooseRole() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const [role, setRole] = useState<"TENANT" | "OWNER" | "AGENCY">("TENANT");
  const [page, setPage] = useState<"CHOOSE" | "CREATE">("CHOOSE");
  const createUser = trpc.user.createUser.useMutation();

  const utils = trpc.useContext();
  const data = utils.auth.getSession.getData();
  const userId = data?.userId || "";
  const [user, setUser] = useState<
    | {
        userId: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        description?: string;
        birthDate?: Date;
      }
    | undefined
  >({ userId });
  const [attrs, setAttrs] = useState<IUserAttrs | undefined>({ userId });

  const userRole = trpc.user.updateUserRoleById.useMutation({
    onSuccess() {
      utils.auth.getSession.invalidate();
    },
  });

  const userProfile = trpc.user.updateUserById.useMutation({
    onSuccess() {
      if (role !== "TENANT") navigation.navigate("Profile", { userId });
    },
  });
  const userAttrs = trpc.attribute.updateUserAttributes.useMutation({
    onSuccess() {
      navigation.navigate("Profile", { userId });
    },
  });

  async function submitRole(role: "TENANT" | "OWNER" | "AGENCY") {
    setRole(role);
    setPage("CREATE");
  }

  async function submitUser() {
    if (!user) return;
    await createUser.mutateAsync();
    await userRole.mutateAsync({ role, userId });
    await userProfile.mutateAsync(user);
    if (attrs && role === "TENANT") await userAttrs.mutateAsync(attrs);
  }

  if (!user) return null;
  return (
    <>
      {page === "CHOOSE" ? (
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
            className="flex h-1/2 items-center justify-center rounded-md border"
            style={styles.shadow}
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
                  <Text className="text-center text-xl font-medium">
                    TENANT
                  </Text>
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
                    We take care of all the details, from marketing your
                    property to managing lease agreements, so you can sit back
                    and relax.
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
                  <Text className="text-center text-xl font-medium">
                    AGENCY
                  </Text>
                  <Text className="text-center italic">
                    Effortlessly manage your rental portfolio with our powerful
                    tools and innovative features. Join our network today and
                    take your business to the next level!
                  </Text>
                </View>
              </TouchableOpacity>
            </Swiper>
          </View>
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.view}>
            <Header />
            <View className="flex-1">
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ backgroundColor: "white" }}
              >
                <View className="flex flex-row bg-[#10316B] px-3 py-2">
                  <Image
                    source={{
                      uri: "https://www.gravatar.com/avatar/?d=mp",
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
                      onChangeText={(text) =>
                        setUser({ ...user, firstName: text })
                      }
                    />
                    <TextInput
                      className="w-full text-white"
                      placeholder="Last Name"
                      placeholderTextColor={"white"}
                      defaultValue={user.lastName ?? ""}
                      onChangeText={(text) =>
                        setUser({ ...user, lastName: text })
                      }
                    />
                  </View>
                </View>
                <View className="pt-2">
                  <View className="flex flex-row items-center justify-between px-2">
                    <Text className="text-base font-bold text-[#10316B]">
                      Kind:
                    </Text>
                    <Text className="font-light">{role}</Text>
                  </View>
                </View>
                <View className="px-3">
                  <Separator color="#10316B" />
                </View>
                <View style={{ flex: 1 }}>
                  <EditInfo user={user} setUser={setUser} />
                  {role === "TENANT" && (
                    <View className="px-3">
                      <EditAttributes
                        userId={userId}
                        attrs={attrs}
                        setAttrs={setAttrs}
                      />
                    </View>
                  )}
                </View>
                <View className="flex space-y-1 px-3 py-5">
                  <View>
                    <Btn
                      title="Change role"
                      bgColor="#F2F7FF"
                      textColor="#10316B"
                      onPress={() => setPage("CHOOSE")}
                    />
                  </View>
                  <View>
                    <Btn
                      title="Create profile"
                      bgColor="#10316B"
                      onPress={submitUser}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  view: {
    flex: 1,
    backgroundColor: "#F2F7FF",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
});
