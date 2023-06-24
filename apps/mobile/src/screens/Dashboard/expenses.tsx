import { View, ScrollView, Text } from "react-native";
import React from "react";

import { trpc } from "../../utils/trpc";
import { PostCard } from "../../components/Card";
import ShowProfile from "../../components/ShowProfile";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";

const Expenses = () => {
  const route = useRoute<RouteProp<TabStackParamList, "Expenses">>();
  const userId = route.params?.userId;
  const expenses = trpc.post.getRentIncomeByUserId.useQuery({ userId });

  const posts = trpc.post.getPostsByUserId.useQuery({ userId });

  return (
    <ScrollView className="mx-5 mt-20" showsVerticalScrollIndicator={false}>
      <View>
        <View className="ml-10 flex-row items-center justify-center">
          <Text className="font-p text-custom mx-auto mb-10	text-center text-3xl font-bold">
            EXPENSES
          </Text>
          <ShowProfile path={require("../../../assets/blank.png")} />
        </View>
        {posts.data && expenses ? (
          posts.data.map((post) => (
            <View key={post.id} className="mb-10 items-center">
              <PostCard
                title={post.title}
                desc={post.desc}
                content={post.content}
                postId={post.id}
                income={undefined}
                expenses={expenses.data}
                userId={userId}
              />
            </View>
          ))
        ) : (
          <View className="bottom-80 left-0 right-0 top-80 items-center justify-center">
            <Text className="items-center justify-center text-center text-3xl font-bold">
              No property at the moment
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Expenses;
