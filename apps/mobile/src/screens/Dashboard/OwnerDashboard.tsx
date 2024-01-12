import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Image as RNImage,
} from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/RootNavigator";

import { BarChart } from "react-native-chart-kit";
import { Icon } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";

import { Post, Attribute, Image } from "@leace/db";
import Carousel from "react-native-snap-carousel";
import { Btn } from "../../components/Btn";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

export default function OwnerDashboard() {
  const utils = trpc.useContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "MyPosts">>();
  const { userId } = route.params;

  const [selectedPost, setSelectedPost] = useState<
    Post & {
      attribute: Attribute | null;
      images: Image[];
    }
  >();

  const { data: posts } = trpc.post.getPostsByUserId.useQuery(
    { userId },
    {
      onSuccess(data) {
        if (data.length > 0) {
          setSelectedPost(data[0]);
        }
      },
    },
  );

  const { data: leases } = trpc.lease.getLeasesByUserId.useQuery({ userId });

  const { data: relationships } = trpc.relationship.getMatchesForOwner.useQuery(
    { userId },
  );

  const { data: metrics } = trpc.metrics.graphsByUserId.useQuery({ userId });

  /*const { data: rented } = trpc.metrics.getRented.useQuery({
    userId,
  });

  const { data: toRent } = trpc.metrics.getPending.useQuery({ userId });
  */
  const signedLeases = leases?.filter((lease) => lease.isSigned);

  const { data: tenants } = trpc.post.getUsersToBeSeen.useQuery(
    { postId: selectedPost?.id ?? "" },
    { retry: false, enabled: !!selectedPost?.id },
  );

  function getYO(birthDate: Date) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age -= 1;
    return age;
  }

  const { mutateAsync: likeHandler } =
    trpc.relationship.likeTenantForPost.useMutation({
      onSuccess() {
        utils.post.getUsersToBeSeen.invalidate();
      },
    });
  const { mutateAsync: dislikeHandler } =
    trpc.relationship.dislikeTenantForPost.useMutation({
      onSuccess() {
        utils.post.getUsersToBeSeen.invalidate();
      },
    });

  const onLike = (userId: string) => {
    if (!selectedPost?.id) return;
    likeHandler({ postId: selectedPost.id, userId });
  };

  const onDislike = (userId: string) => {
    if (!selectedPost?.id) return;
    dislikeHandler({ postId: selectedPost.id, userId });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <ScrollView
        className="space-y-4 py-3"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex h-20 flex-row gap-2 px-3">
          <View className="border-indigo flex-1 items-center justify-center rounded-md border">
            <Text className="text-indigo text-xl font-bold">
              {posts?.filter((post) => post.type === "TO_BE_RENTED").length ??
                0}
            </Text>
            <Text>Active Post</Text>
          </View>
          <View className="border-indigo flex-1 items-center justify-center rounded-md border">
            <Text className="text-indigo text-xl font-bold">
              {signedLeases?.length ?? 0}
            </Text>
            <Text>Signed leases</Text>
          </View>
          <View className="border-indigo flex-1 items-center justify-center rounded-md border">
            <Text className="text-indigo text-xl font-bold">
              {relationships?.length ?? 0}
            </Text>
            <Text>Ongoing chats</Text>
          </View>
        </View>

        <View className="px-3">
          {posts && posts.length > 0 ? (
            <>
              <Text className="text-base font-bold">
                Here are your potential tenants:
              </Text>
              <Picker
                selectedValue={selectedPost?.title}
                onValueChange={(item) => {
                  if (!posts) return;
                  const [tmp] = posts.filter(
                    (a) => a.title?.toLowerCase() === item?.toLowerCase(),
                  );
                  if (!tmp) return;
                  setSelectedPost(() => tmp);
                }}
              >
                {posts?.map((a, key) => (
                  <Picker.Item
                    label={a.title ?? ""}
                    value={a.title}
                    key={key}
                  />
                ))}
              </Picker>
              <View>
                {tenants && tenants?.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  <Carousel
                    layout={"default"}
                    data={tenants}
                    sliderWidth={Dimensions.get("window").width - 20}
                    itemWidth={Dimensions.get("window").width - 20}
                    renderItem={({ item }) => {
                      return (
                        <View
                          className={`${
                            item.isPremium
                              ? "border-yellow-300"
                              : "border-indigo"
                          } flex h-32 flex-col items-center justify-around rounded-md border`}
                        >
                          <View className="flex flex-row items-center space-x-2">
                            <View className="h-16 w-16">
                              <RNImage
                                className={"mr-4 h-16 w-16 rounded-full"}
                                source={{ uri: item.image ?? "" }}
                              ></RNImage>
                            </View>
                            <View className="flex flex-col">
                              <Text className="font-bold">
                                {item.firstName} {item.lastName}
                              </Text>
                              <Text className="text-xs text-gray-400">
                                {getYO(item.birthDate ?? new Date())} years old
                              </Text>
                            </View>
                          </View>
                          <View className="flex w-full flex-row justify-around">
                            <Btn
                              title="Accept"
                              onPress={() => onLike(item.id)}
                            ></Btn>
                            <Btn
                              title="Decline"
                              className="border-indigo border-2"
                              bgColor="#FFFFFF"
                              textColor="#6366f1"
                              onPress={() => onDislike(item.id)}
                            ></Btn>
                          </View>
                        </View>
                      );
                    }}
                  ></Carousel>
                ) : (
                  <View className="py-4">
                    <Text className="text-center text-base font-bold">
                      No result :(
                    </Text>
                    <Text className="text-center text-xs text-gray-400">
                      It seems like nobody has liked your post yet...
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                className="border-indigo bg-indigo rounded-md border py-2"
                onPress={() => navigation.navigate("CreatePost", { userId })}
              >
                <Text className="text-center text-base font-bold text-white">
                  Take the first step by creating a post !
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View className="h-[250px]">
          <ScrollView horizontal>
            <View className="px-3">
              <View className="mb-2 flex flex-row items-center justify-between">
                <Text className="text-base font-bold">Revenues:</Text>
                <View className="flex flex-row items-center gap-1">
                  <Text>
                    $
                    {metrics?.monthlyRevenues
                      .map((a) => a.count)
                      .reduce((a, b) => a + b, 0)}
                  </Text>
                </View>
              </View>
              <BarChart
                data={{
                  labels: metrics?.monthlyRevenues.map((a) => a.month) ?? [],
                  datasets: [
                    {
                      data: metrics?.monthlyRevenues.map((a) => a.count) ?? [],
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 20}
                height={220}
                yAxisLabel="$"
                chartConfig={chartConfig}
              />
            </View>

            <View className="px-3">
              <View className="mb-2 flex flex-row items-center justify-between">
                <Text className="text-base font-bold">Likes:</Text>
                <View className="flex flex-row items-center gap-1">
                  <Text>
                    {metrics?.monthlyLikes
                      .map((a) => a.count)
                      .reduce((a, b) => a + b, 0)}
                  </Text>
                </View>
              </View>
              <BarChart
                data={{
                  labels: metrics?.monthlyLikes.map((a) => a.month) ?? [],
                  datasets: [
                    {
                      data: metrics?.monthlyLikes.map((a) => a.count) ?? [],
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 20}
                height={220}
                chartConfig={chartConfig}
              />
            </View>

            <View className="px-3">
              <View className="mb-2 flex flex-row items-center justify-between">
                <Text className="text-base font-bold">Lease signed:</Text>
                <View className="flex flex-row items-center gap-1">
                  <Text>
                    {metrics?.monthlyLeaseSigned
                      .map((a) => a.count)
                      .reduce((a, b) => a + b, 0)}
                  </Text>
                </View>
              </View>
              <BarChart
                data={{
                  labels: metrics?.monthlyLeaseSigned.map((a) => a.month) ?? [],
                  datasets: [
                    {
                      data:
                        metrics?.monthlyLeaseSigned.map((a) => a.count) ?? [],
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 20}
                height={220}
                chartConfig={chartConfig}
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
