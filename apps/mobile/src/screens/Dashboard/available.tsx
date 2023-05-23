import { View, Text, ScrollView } from "react-native";
import React from "react";

import { trpc } from "../../utils/trpc";
import { Type } from "../../utils/enum";
import { PostCard } from "../../components/Card";
import ShowProfile from "../../components/ShowProfile";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";

const Available = () => {
  const route = useRoute<RouteProp<TabStackParamList, "Available">>();
  const userId = route.params?.userId;

  const available = trpc.post.getPostsByUserId.useQuery({
    userId,
    postType: Type.TO_BE_RENTED,
  });

  return (
    <ScrollView
      className="mx-5 mb-20 mt-20"
      showsVerticalScrollIndicator={false}
    >
      <View className="ml-10 flex-row items-center justify-center">
        <Text className="font-p text-custom mx-auto mb-10	text-center text-3xl font-bold">
          AVAILABLE
        </Text>
        <ShowProfile path={require("../../../assets/blank.png")} />
      </View>
      {available.data && available.data.length > 0 ? (
        available.data.map((item) => {
          return (
            <View key={item.id} className="mb-10">
              <PostCard
                title={item.title}
                desc={item.desc}
                content={item.content}
                postId={item.id}
                income={undefined}
                expenses={undefined}
                userId={userId}
              />
            </View>
          );
        })
      ) : (
        <View className="bottom-80 left-0 right-0 top-80 items-center justify-center">
          <Text className="items-center justify-center text-center text-3xl font-bold">
            No property available at the moment
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Available;
