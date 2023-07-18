import { View, ScrollView, Text } from "react-native";
import React from "react";

import { PostCard } from "../../components/Card";
import ShowProfile from "../../components/ShowProfile";
import { trpc } from "../../../../web/src/utils/trpc";

const Income = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const income = trpc.post.getRentIncomeByUserId.useQuery({
    userId: session?.userId as string,
  });

  const posts = trpc.post.getPostsByUserId.useQuery({
    userId: session?.userId as string,
  });

  return (
    <ScrollView className="mx-5 mt-20" showsVerticalScrollIndicator={false}>
      <View>
        <View className="ml-10 flex-row items-center justify-center">
          <Text className="font-p text-custom mx-auto mb-10	text-center text-3xl font-bold">
            INCOME
          </Text>
          <ShowProfile path={require("../../../assets/blank.png")} />
        </View>
        {posts.data && income ? (
          posts.data.map((post) => (
            <View key={post.id} className="mb-5 items-center">
              <PostCard
                title={post.title}
                desc={post.desc}
                content={post.content}
                income={income.data}
                expenses={undefined}
                postId={post.id}
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

export default Income;
