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

// import RNPickerSelect from "react-native-picker-select";

export default function PostStack() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "MyPosts">>();
  const { userId } = route.params;
  const [posts, setPosts] = useState<
    (Post & {
      attribute: Attribute | null;
      images: Image[];
    })[]
  >([]);
  const { isLoading, refetch } = trpc.post.getPostsByUserId.useQuery(
    {
      userId,
    },
    {
      onSuccess(data) {
        if (!data) return;
        setPosts([...data]);
      },
    },
  );
  /*const [reason, setReason] = useState<"ALL" | "RENTED" | "TO_BE_RENTED">(
    "ALL",
  );*/
  useFocusEffect(
    useCallback(() => {
      const check = LocalStorage.getItem("refreshPosts");
      if (!check) return;
      LocalStorage.setItem("refreshPosts", false);
      setPosts([]);
      refetch();
    }, [userId]),
  );
  /*useEffect(() => {
    if (posts.length > 0) return;
    setPosts([...data]);
  }, [data]);*/

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
  /*function handlePicker(itemValue: "ALL" | "RENTED" | "TO_BE_RENTED") {
    if (posts.length === 0) return;
    if (itemValue === reason) return;
    if (itemValue === "RENTED") {
      const tmp = posts.filter((posts) => posts.type === "RENTED");
      setPosts([...tmp]);
    } else if (itemValue === "TO_BE_RENTED") {
      const tmp = posts.filter((posts) => posts.type === "TO_BE_RENTED");
      setPosts([...tmp]);
    } else setPosts([...posts]);
    setReason(itemValue);
  }*/

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        {/*
        <View
          style={{
            borderBottomColor: "#d3d3d3",
            borderBottomWidth: 1,
          }}
        >
          <RNPickerSelect
            placeholder={{ label: "ALL", value: "ALL" }}
            onValueChange={handlePicker}
            items={[
              { label: "ALL", value: "ALL" },
              { label: "RENTED", value: "RENTED" },
              { label: "TO_BE_RENTED", value: "TO_BE_RENTED" },
            ]}
          />
        </View>
          */}
        {posts.length > 0 ? (
          <View className={`flex-1`}>
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
