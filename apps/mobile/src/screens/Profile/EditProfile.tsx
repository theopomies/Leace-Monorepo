import { View, Text, Image, TextInput, ScrollView, Modal } from "react-native";
import React, { useCallback, useState } from "react";
import {
  useRoute,
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { trpc } from "../../utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LocalStorage } from "../../utils/cache";
import { IUserAttrs } from "../../types";
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
  const [loading, setLoading] = useState({
    status: false,
    message: "Save",
  });
  const userMutation = trpc.user.updateUserById.useMutation({
    onSuccess() {
      if (!showAttrs) {
        LocalStorage.setItem("refreshProfile", true);
        navigation.navigate("ViewProfile", { userId });
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
      navigation.navigate("ViewProfile", { userId });
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

  const [showFirstNameError, setShowFirstNameError] = useState(false);
  const [showLastNameError, setShowLastNameError] = useState(false);
  const [showLocationError, setShowLocationError] = useState(false);
  const [showMinPriceError, setShowMinPriceError] = useState(false);
  const [showMaxPriceError, setShowMaxPriceError] = useState(false);
  const [showMinSizeError, setShowMinSizeError] = useState(false);
  const [showMaxSizeError, setShowMaxSizeError] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showPriceError, setShowPriceError] = useState(false);
  const [showRentDateError, setShowRentDateError] = useState(false);

  function updateUser() {
    if (!user) return;

    let isValid = true;

    if (!user.firstName || !/^[a-zA-Z\s\-]+$/.test(user.firstName.trim())) {
      isValid = false;
      setShowFirstNameError(true);
    } else {
      setShowFirstNameError(false);
    }

    if (!user.lastName || !/^[a-zA-Z\s\-]+$/.test(user.lastName.trim())) {
      isValid = false;
      setShowLastNameError(true);
    } else {
      setShowLastNameError(false);
    }

    if (user1?.role === "TENANT") {
      if (!attrs?.location) {
        isValid = false;
        setShowLocationError(true);
      } else {
        setShowLocationError(false);
      }

      if (
        attrs?.minPrice === undefined ||
        isNaN(attrs?.minPrice as number) ||
        attrs.minPrice <= 0
      ) {
        isValid = false;
        setShowMinPriceError(true);
      } else {
        setShowMinPriceError(false);
      }

      if (
        attrs?.maxPrice === undefined ||
        isNaN(attrs?.maxPrice as number) ||
        attrs.maxPrice <= 0
      ) {
        isValid = false;
        setShowMaxPriceError(true);
      } else {
        setShowMaxPriceError(false);
      }

      if (
        attrs?.minSize === undefined ||
        isNaN(attrs.minSize as number) ||
        attrs.minSize <= 0
      ) {
        isValid = false;
        setShowMinSizeError(true);
      } else {
        setShowMinSizeError(false);
      }

      if (
        attrs?.maxSize === undefined ||
        isNaN(attrs.maxSize as number) ||
        attrs.maxSize <= 0
      ) {
        isValid = false;
        setShowMaxSizeError(true);
      } else {
        setShowMaxSizeError(false);
      }

      if (
        attrs?.rentStartDate &&
        attrs?.rentEndDate &&
        attrs.rentStartDate.getTime() >= attrs.rentEndDate.getTime()
      ) {
        isValid = false;
        setShowRentDateError(true);
      } else {
        setShowRentDateError(false);
      }

      if (
        attrs?.minPrice !== undefined &&
        attrs?.maxPrice !== undefined &&
        attrs.minPrice >= attrs.maxPrice
      ) {
        isValid = false;
        setShowPriceError(true);
      } else {
        setShowPriceError(false);
      }

      if (
        attrs?.minSize !== undefined &&
        attrs?.maxSize !== undefined &&
        attrs.minSize >= attrs.maxSize
      ) {
        isValid = false;
        setShowSizeError(true);
      } else {
        setShowSizeError(false);
      }
    }

    if (isValid) {
      setLoading({ status: true, message: "Updating..." });
      userMutation.mutate({ ...user });
      if (showAttrs && attrs) {
        attributesMutation.mutate(attrs);
      }
      // navigation.navigate("ViewProfile", { userId });
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
      <View className="flex-1 bg-white">
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

            <View className="flex w-full flex-col items-center justify-center  space-y-2 py-2">
              <TextInput
                className="w-1/2 text-3xl font-bold text-black"
                placeholder="First Name"
                placeholderTextColor={"black"}
                defaultValue={user.firstName ?? ""}
                style={{ borderBottomWidth: 1 }}
                onChangeText={(text) => setUser({ ...user, firstName: text })}
              />
              {showFirstNameError && (
                <Text className="text-red-500">
                  {"Enter a valid first name"}
                </Text>
              )}
              <TextInput
                className="w-1/2 text-3xl text-black"
                placeholder="Last Name"
                placeholderTextColor={"black"}
                defaultValue={user.lastName ?? ""}
                style={{ borderBottomWidth: 1 }}
                onChangeText={(text) => setUser({ ...user, lastName: text })}
              />
              {showLastNameError && (
                <Text className="text-red-500">
                  {"Enter a valid last name"}
                </Text>
              )}
              <View className="bg-indigo w-full items-center justify-center py-4">
                <Btn
                  title={loading.message}
                  className="w-[150px] border-2 border-white"
                  iconName="save"
                  iconType="material-icons"
                  onPress={!loading.status ? updateUser : undefined}
                  spinner={loading.status}
                />
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
                  showErrorCallback={showLocationError}
                  showMinPriceErrorCallback={showMinPriceError}
                  showMaxPriceErrorCallback={showMaxPriceError}
                  showMinSizeErrorCallback={showMinSizeError}
                  showMaxSizeErrorCallback={showMaxSizeError}
                  showPriceErrorCallback={showPriceError}
                  showRentDateErrorCallback={showRentDateError}
                  showSizeErrorCallback={showSizeError}
                />
              </View>
            )}
          </View>
        </ScrollView>
        <Btn
          title="Delete account"
          className="mt-2 rounded-none"
          bgColor="#EF4444"
          onPress={() => setOpen(true)}
        ></Btn>
      </View>
    </>
  );
}
