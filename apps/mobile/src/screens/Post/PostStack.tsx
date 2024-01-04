import { View, SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import React, { useCallback, useState } from "react";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";
import {
  RouteProp,
  useRoute,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { Loading } from "../../components/Loading";
import { PostCard } from "../../components/Post";
import { LocalStorage } from "../../utils/cache";
import { Post, Attribute, Image } from "@leace/db";
import { Btn } from "../../components/Btn";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";

export default function PostStack() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "MyPosts">>();
  const [selectedType, setSelectedType] = useState("");
  const { userId } = route.params;
  const [posts, setPosts] = useState<
    (Post & {
      attribute: Attribute | null;
      images: Image[];
    })[]
  >([]);
  const {
    data: fetchedPosts,
    isLoading,
    refetch,
  } = trpc.post.getPostsByUserId.useQuery(
    { userId },
    {
      onSuccess(data) {
        if (!data) return;
        setPosts([...data]);
      },
    },
  );
  useFocusEffect(
    useCallback(() => {
      const check = LocalStorage.getItem("refreshPosts");
      if (!check) return;
      LocalStorage.setItem("refreshPosts", false);
      setPosts([]);
      refetch();
    }, [userId]),
  );
  if (isLoading)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.view}>
          <Loading />
        </View>
      </SafeAreaView>
    );

  if (!posts)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.view}>
          <Header />
          <Text>Data not found</Text>
        </View>
      </SafeAreaView>
    );
  function handlePicker(itemValue: string) {
    if (!fetchedPosts) return;
    setSelectedType(itemValue);
    if (itemValue === "RENTED") {
      const tmp = fetchedPosts.filter((posts) => posts.type === "RENTED");
      setPosts([...tmp]);
    } else if (itemValue === "TO_BE_RENTED") {
      const tmp = fetchedPosts.filter((posts) => posts.type === "TO_BE_RENTED");
      setPosts([...tmp]);
    } else setPosts([...fetchedPosts]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        {fetchedPosts && fetchedPosts.length > 0 ? (
          <View className={`flex-1`}>
            <View
              style={{ borderBottomColor: "#d3d3d3", borderBottomWidth: 0.2 }}
            >
              <Picker
                mode="dropdown"
                selectedValue={selectedType}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onValueChange={(itemValue, itemIndex) =>
                  handlePicker(itemValue)
                }
              >
                <Picker.Item label="All" value="ALL" />
                <Picker.Item label="Rented" value="RENTED" />
                <Picker.Item label="Available" value="TO_BE_RENTED" />
              </Picker>
            </View>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              className="px-2"
            >
              {posts.map((post, idx) => (
                <PostCard data={post} key={idx} userId={userId} />
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className={`flex-1 items-center justify-center px-3`}>
            <View className="flex flex-col items-center gap-2">
              <Text className="font-bold">You currently have no posts.</Text>
              <View>
                <Btn
                  title="Ready to make your first post ?"
                  onPress={() => navigation.navigate("CreatePost", { userId })}
                  bgColor="#6366f1"
                ></Btn>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  view: { flex: 1, backgroundColor: "white" },
});
