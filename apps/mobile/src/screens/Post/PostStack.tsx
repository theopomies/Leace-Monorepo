import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";
import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import Loading from "../../components/Loading";
import { PostCard } from "../../components/Post";
import { LocalStorage } from "../../utils/cache";
import { Picker } from "@react-native-picker/picker";
import { Post, Attribute, Image } from "@leace/db";

export default function PostStack() {
  const route = useRoute<RouteProp<TabStackParamList, "MyPosts">>();
  const { userId } = route.params;
  const { data, isLoading, refetch } = trpc.post.getPostsByUserId.useQuery({
    userId,
  });
  const [posts, setPosts] = useState<
    (Post & {
      attribute: Attribute | null;
      images: Image[];
    })[]
  >();
  const [reason, setReason] = useState<"ALL" | "RENTED" | "TO_BE_RENTED">(
    "ALL",
  );
  useFocusEffect(
    useCallback(() => {
      const check = LocalStorage.getItem("refreshPosts");
      if (!check) return;
      LocalStorage.setItem("refreshPosts", false);
      refetch();
    }, [userId]),
  );
  useEffect(() => {
    if (posts) return;
    console.log("in useEffect");
    setPosts(data);
  }, [data]);

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Loading />
        </View>
      </View>
    );

  if (!data)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Header />
          <Text>Data not found</Text>
        </View>
      </View>
    );

  function handlePicker(itemValue: "ALL" | "RENTED" | "TO_BE_RENTED") {
    if (!data) return;
    if (itemValue === reason) return;
    if (itemValue === "RENTED") {
      const tmp = data.filter((posts) => posts.type === "RENTED");
      setPosts([...tmp]);
    } else if (itemValue === "TO_BE_RENTED") {
      const tmp = data.filter((posts) => posts.type === "TO_BE_RENTED");
      setPosts([...tmp]);
    } else setPosts([...data]);
    setReason(itemValue);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        <View
          style={{
            borderBottomColor: "#d3d3d3",
            borderBottomWidth: 1,
          }}
        >
          <Picker selectedValue={reason} onValueChange={handlePicker}>
            <Picker.Item label="ALL" value={"ALL"} />
            <Picker.Item label="RENTED" value={"RENTED"} />
            <Picker.Item label="TO_BE_RENTED" value={"TO_BE_RENTED"} />
          </Picker>
        </View>
        {posts && (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ backgroundColor: "#F2F7FF" }}
            className="px-2"
          >
            {posts.map((post, idx) => (
              <PostCard data={post} key={idx} userId={userId} />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  view: {
    flex: 1,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
  },
});
