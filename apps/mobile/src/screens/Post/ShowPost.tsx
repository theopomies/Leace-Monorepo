import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { Report } from "../../components/Report";
import { trpc } from "../../utils/trpc";
import Loading from "../../components/Loading";
import Carousel from "react-native-snap-carousel";
import Separator from "../../components/Separator";
import { ShowAttributes } from "../../components/Attribute";
import { Btn } from "../../components/Btn";
import { LocalStorage } from "../../utils/cache";

export default function ShowPost() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "PostInfo">>();
  const { userId, postId, editable } = route.params;

  const {
    data: post,
    isLoading,
    refetch,
  } = trpc.post.getPostById.useQuery({ postId });
  const [idx, setIdx] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const check = LocalStorage.getItem("refreshPost");
      if (!check) return;
      LocalStorage.setItem("refreshPost", false);
      refetch();
    }, [userId]),
  );

  const deletePost = trpc.post.deletePostById.useMutation({
    onSuccess() {
      navigation.navigate("MyPosts", { userId });
    },
  });

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Loading />
        </View>
      </View>
    );

  if (!post)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Text>Data not found</Text>
        </View>
      </View>
    );

  function _renderItem({ item, index }: { item: any; index: number }) {
    return (
      <Image
        className="rounded-xl"
        source={{ uri: item.ext }}
        style={{ flex: 1, resizeMode: "contain" }}
      ></Image>
    );
  }

  function handleDelete() {
    if (!post) return;
    LocalStorage.setItem("refreshPosts", true);
    deletePost.mutate({ postId: post.id });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          flexDirection: "column",
        }}
        style={{ backgroundColor: "#10316B", paddingBottom: 5 }}
      >
        <View>
          <View className="mt-4 h-48 px-4">
            {post.images.length > 0 ? (
              <Carousel
                layout={"default"}
                data={post.images}
                sliderWidth={352}
                itemWidth={352}
                renderItem={_renderItem}
                onSnapToItem={(index) => setIdx(index)}
              />
            ) : (
              <Image
                className="rounded-md"
                source={{
                  uri: "https://montverde.org/wp-content/themes/eikra/assets/img/noimage-420x273.jpg",
                }}
                style={{ flex: 1, resizeMode: "contain" }}
              ></Image>
            )}
            {!editable && (
              <Report
                className="absolute bottom-0 right-4 flex flex-row items-center space-x-2 rounded-br-md rounded-tl-md bg-red-500 p-2.5"
                type="POST"
                postId={post.id}
              />
            )}
          </View>
          <View className="mx-4 mt-2">
            <Text className="text-lg font-bold text-white">{post.title}</Text>
            <Text className="mt-2 text-xs font-light text-white">
              {post.desc}
            </Text>
            {!editable && (
              <>
                <Separator />
                <View className="flex flex-row justify-between">
                  <View className="flex flex-row">
                    <Image
                      source={{
                        uri:
                          post.createdBy.image ??
                          "https://www.gravatar.com/avatar/?d=mp",
                      }}
                      className=" h-16 w-16 rounded-full"
                      style={{ borderWidth: 2, borderColor: "white" }}
                    />
                    <View className="flex justify-center pl-3">
                      <Text className="text-xl font-bold text-white">
                        {post.createdBy.firstName}
                      </Text>
                      <Text className="text-white ">
                        {post.createdBy.lastName}
                      </Text>
                    </View>
                  </View>
                  <View className="flex items-center justify-center">
                    <Btn
                      title="More"
                      bgColor="#F2F7FF"
                      textColor="#10316B"
                    ></Btn>
                  </View>
                </View>
              </>
            )}
            <Separator />
            <View>
              <View className="flex flex-row">
                <Text className="min-w-[68px] font-bold text-white">Type:</Text>
                <Text className="font-light text-white">
                  {post.attribute?.appartment ? "Appartment" : "House"}
                </Text>
              </View>
              <View className="flex flex-row">
                <Text className=" min-w-[68px] font-bold text-white">
                  Size:
                </Text>
                <Text className="font-light text-white">
                  {post.attribute?.size} m²
                </Text>
              </View>
              <View className="flex flex-row">
                <Text className=" min-w-[68px] font-bold text-white">
                  Price:
                </Text>
                <Text className="font-light text-white">
                  {post.attribute?.price} €
                </Text>
              </View>

              <View className="flex flex-row">
                <Text className="min-w-[68px] font-bold text-white">
                  Available:
                </Text>
                <Text className="font-light text-white">
                  {post.attribute?.rentStartDate?.toDateString()}
                </Text>
              </View>
            </View>

            {post.attribute && (
              <>
                <Separator />
                <ShowAttributes
                  attribute={post.attribute}
                  iconBGColor="#F2F7FF"
                  iconTextColor="#10316B"
                  titleColor="#FFFFFF"
                  show={false}
                ></ShowAttributes>
              </>
            )}
          </View>
        </View>
        <View className="px-4">
          {editable && (
            <>
              <Separator />
              <View>
                <Btn
                  title="Edit"
                  bgColor="#F2F7FF"
                  textColor="#10316B"
                  onPress={() =>
                    navigation.navigate("EditPost", {
                      userId,
                      data: JSON.stringify(post),
                    })
                  }
                ></Btn>
              </View>
              <View className="pt-1.5">
                <Btn
                  title="Delete"
                  bgColor="#EF4444"
                  onPress={handleDelete}
                ></Btn>
              </View>
            </>
          )}
          <Separator />
          <View className="mb-3 flex flex-row">
            <Text className="font-bold text-white">Created: </Text>
            <Text className="text-white">{post.createdAt.toDateString()}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
});
