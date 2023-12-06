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
import { TabStackParamList } from "../../navigation/RootNavigator";
import { Icon } from "react-native-elements";
import { EditAttributes } from "../../components/Attribute";
import Separator from "../../components/Separator";
import { trpc } from "../../utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LocalStorage } from "../../utils/cache";
import { IUserAttrs } from "../../types";
import { EditInfo } from "../../components/UserProfile";
import { Btn } from "../../components/Btn";
import { useAuth } from "@clerk/clerk-expo";
import EditInfoRefacto from "../../components/UserProfile/EditInfoRefacto";
import EditAttributesRefacto from "../../components/Attribute/EditAttributesRefacto";

export default function EditProfile() {
  const { signOut } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "EditProfile">>();
  const { data, userId, showAttrs } = route.params;
  const [open, setOpen] = useState(false);
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
  const deleteAccount = trpc.user.deleteUserById.useMutation();
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
        id,
        firstName,
        lastName,
        phoneNumber,
        description,
        birthDate,
        image,
        role,
        isPremium,
        emailVerified,
        email,
      } = parsed;
      let { attribute } = parsed;
      if (!attribute) {
        attribute = {
          ...attribute,
          rentStartDate: new Date(),
          rentEndDate: new Date(),
        };
      }
      setUser({
        userId: id,
        firstName,
        lastName,
        phoneNumber,
        description,
        birthDate: new Date(birthDate),
      });
      setUser1({ image, isPremium, emailVerified, role, email });
      setAttrs({
        ...attribute,
        userId: id,
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
    userMutation.mutate({ ...user });
    if (showAttrs && attrs) {
      attributesMutation.mutate(attrs);
    }
  }

  if (!user || !user1 || !attrs) return null;

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 items-center justify-center">
          <View
            className="w-3/4 rounded-md bg-white p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text className="text-center text-lg font-bold">
              Delete my Account
            </Text>
            <Text className="mt-3 text-sm font-light">
              Are you sure you want to delete your account?
            </Text>
            <View className="mt-3 flex space-y-1">
              <View>
                <Btn
                  title="Confirm"
                  bgColor="#ef4444"
                  textColor="#FFFFFF"
                  iconName="delete"
                  iconType="material"
                  onPress={() => {
                    deleteAccount.mutate({ userId });
                    signOut();
                  }}
                ></Btn>
              </View>
              <View>
                <Btn
                  title="Close"
                  bgColor="#F2F7FF"
                  textColor="#0A2472"
                  onPress={() => setOpen(false)}
                ></Btn>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: "white" }}
        >
          <View className="flex flex-col items-center py-2">
            <Image
              source={{
                uri: user1.image ?? "https://www.gravatar.com/avatar/?d=mp",
              }}
              className="h-24 w-24 rounded-full"
              style={{ borderWidth: 1.5, borderColor: "#111827" }}
            />


            <View className="flex flex-col w-full items-center justify-center  space-y-2 py-2">

              <TextInput
                className="w-1/2 text-3xl font-bold text-black"
                placeholder="First Name"
                placeholderTextColor={"black"}
                defaultValue={user.firstName ?? ""}
                style={{ borderBottomWidth: 1 }}
                onChangeText={(text) => setUser({ ...user, firstName: text })}
              />
              <TextInput
                className="w-1/2 text-3xl text-black"
                placeholder="Last Name"
                placeholderTextColor={"black"}
                defaultValue={user.lastName ?? ""}
                style={{  borderBottomWidth: 1 }}
                onChangeText={(text) => setUser({ ...user, lastName: text })}
              />
              <View className="w-full bg-[#6C47FF] py-6">

                <TouchableOpacity
                  className="flex flex-row items-center justify-center space-x-1 rounded-md px-2 py-2 border mx-32 bg-[#F1F5F9]"
                  style={{ borderColor: "black" }}
                  onPress={updateUser}
                >
                  <Icon
                    name="save"
                    color="black"
                    size={28}
                    type="material-icons"
                  ></Icon>
                  <Text className=" text-lg font-bold text-black">Save</Text>
                </TouchableOpacity>

              </View>
            </View>


          </View>
          <View style={{ flex: 1 }}>
            <EditInfoRefacto user={user} setUser={setUser} />
            {showAttrs && (
              <View
                className="px-3"
                style={{ justifyContent: "flex-end", flex: 1 }}
              >
                <EditAttributesRefacto
                  userId={userId}
                  attrs={attrs}
                  setAttrs={setAttrs}
                />
              </View>
            )}
          </View>
        </ScrollView>
        <Btn
          title="Delete account"
          className="rounded-none"
          bgColor="#EF4444"
          onPress={() => setOpen(true)}
        ></Btn>
      </View>
    </>
  );
}
