import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Platform,
  Text,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-elements";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { useAuth } from "@clerk/clerk-expo";
import UserProfile from "../../components/UserProfile/UserProfile";
import { trpc } from "../../utils/trpc";

const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View className="px-2">
      <Button
        className="bg-custom mx-9 mt-5 rounded  text-white"
        title="Sign Out"
        buttonStyle={{ backgroundColor: "#002642" }}
        onPress={() => {
          // signOut();
        }}
      />
    </View>
  );
};

export const Profile = () => {
  const { signOut } = useAuth();
  const route = useRoute<RouteProp<TabStackParamList, "Profile">>();
  const userId = route.params?.userId;
  const [edit, setEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<any>(undefined);
  const [user1, setUser1] = useState<any>(undefined);

  const { data, isLoading, refetch } = trpc.user.getUserById.useQuery({
    userId,
  });
  const response = trpc.user.updateUserById.useMutation();

  const attrResponse = trpc.attribute.updateUserAttributes.useMutation({
    onSuccess() {
      refetch();
      setEdit(false);
    },
  });

  const userDelete = trpc.user.deleteUserById.useMutation({
    onSuccess() {
      signOut();
    },
  });

  useEffect(() => {
    if (data) {
      if (data.birthDate) {
        const date = new Date(data.birthDate);
        const dateString = date.toISOString().substring(0, 10);
        setUser({ ...data, birthDate: dateString });
        setUser1({ ...data, birthDate: dateString });
      } else {
        setUser({ ...data });
        setUser1({ ...data });
      }
    }
  }, [data]);

  return (
    <View style={{ flex: 1 }}>
      {user ? (
        <ScrollView
          style={{
            marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
          }}
        >
          <UserProfile
            user={user}
            setUser={setUser}
            edit={edit}
            userId={userId}
          />
        </ScrollView>
      ) : (
        <View
          className="flex-1 items-center justify-center"
          style={{
            marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
          }}
        >
          <ActivityIndicator size="large" color="#002642" />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View
            className="flex w-3/4 rounded-md bg-white p-4"
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
            <Text className="text-md font-bold text-[#002642]">
              DELETE ACCOUNT
            </Text>
            <View className="mt-1 flex space-y-4">
              <Text>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Consectetur accusantium perspiciatis, ad aspernatur et harum
                aliquam totam voluptatum nemo optio magni ipsum placeat
                voluptatibus vero reprehenderit sapiente? Earum, voluptate sed.
              </Text>
              <View className="flex flex-row items-center justify-center space-x-4">
                <View className="bg-green-100">
                  <Button
                    className="rounded text-white"
                    title="Cancel"
                    buttonStyle={{ backgroundColor: "#002642" }}
                    onPress={() => setModalVisible(false)}
                  />
                </View>
                <View>
                  <Button
                    className="rounded text-white"
                    title="Delete"
                    buttonStyle={{ backgroundColor: "rgb(239 68 68)" }}
                    onPress={() => userDelete.mutate({ userId })}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View className="mb-2 space-y-1">
        {edit ? (
          <View className="flex flex-row space-x-1 px-2">
            <View className="flex flex-1">
              <Button
                className="mx-9 mt-5 flex-1  rounded text-white"
                title="Save"
                buttonStyle={{ backgroundColor: "rgb(34 197 94)" }}
                onPress={() => {
                  response.mutate({
                    ...user,
                    userId,
                    birthDate: new Date(user.birthDate + "T00:00:00.000Z"),
                  });
                  const tmp = {
                    maxPrice: user?.attribute?.maxPrice
                      ? user?.attribute?.maxPrice
                      : 1000,
                    minPrice: user?.attribute?.minPrice
                      ? user?.attribute?.minPrice
                      : 0,
                    maxSize: user?.attribute?.maxSize
                      ? user?.attribute?.maxSize
                      : 100,
                    minSize: user?.attribute?.minSize
                      ? user?.attribute?.minSize
                      : 0,
                    terrace: user?.attribute?.terrace
                      ? user?.attribute?.terrace
                      : false,
                    pets: user?.attribute?.pets ? user?.attribute?.pets : false,
                    smoker: user?.attribute?.smoker
                      ? user?.attribute?.smoker
                      : false,
                    disability: user?.attribute?.disability
                      ? user?.attribute?.disability
                      : false,
                    garden: user?.attribute?.garden
                      ? user?.attribute?.garden
                      : false,
                    parking: user?.attribute?.parking
                      ? user?.attribute?.parking
                      : false,
                    elevator: user?.attribute?.elevator
                      ? user?.attribute?.elevator
                      : false,
                    pool: user?.attribute?.pool ? user?.attribute?.pool : false,
                  };
                  attrResponse.mutate({ ...tmp, userId });
                }}
              />
            </View>
            <View className="flex flex-1">
              <Button
                className="mx-9 mt-5 flex-1 rounded text-white"
                title="Cancel"
                buttonStyle={{ backgroundColor: "rgb(239 68 68)" }}
                onPress={() => {
                  setUser(user1);
                  setEdit(false);
                }}
              />
            </View>
          </View>
        ) : (
          <>
            {user ? (
              <View className="flex flex-row space-x-1 px-2">
                <View className="flex flex-1">
                  <Button
                    className="bg-custom mx-9 mt-5 flex-1  rounded text-white"
                    title="Edit"
                    buttonStyle={{ backgroundColor: "#002642" }}
                    onPress={() => setEdit(true)}
                  />
                </View>
                <View className="flex flex-1">
                  <Button
                    className="mx-9 mt-5 flex-1 rounded text-white"
                    title="Delete"
                    buttonStyle={{ backgroundColor: "rgb(239 68 68)" }}
                    onPress={() => setModalVisible(true)}
                  />
                </View>
              </View>
            ) : null}
            <View className="">
              <SignOut />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
