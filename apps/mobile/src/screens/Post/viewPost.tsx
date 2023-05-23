import React from "react";
import { View, ScrollView, Text } from "react-native";
import { PostCard } from "../../components/Card";

import { trpc } from "../../utils/trpc";
import ShowProfile from "../../components/ShowProfile";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";

const ViewPost = () => {
  const route = useRoute<RouteProp<TabStackParamList, "ViewPost">>();
  const userId = route.params?.userId;

  const posts = trpc.post.getPostsByUserId.useQuery({
    userId,
  });

  return (
    <ScrollView className="mx-5 mt-20">
      <View>
        <View className="ml-10 flex-row items-center justify-center">
          <Text className="font-poppins text-custom mx-auto	mb-10 text-center text-3xl">
            PROPERTIES
          </Text>
          <ShowProfile path={require("../../../assets/blank.png")} />
        </View>
        {posts.data ? (
          posts.data.map((post) => (
            <View key={post.id} className="mb-10 items-center">
              <PostCard
                title={post.title}
                desc={post.desc}
                content={post.content}
                postId={post.id}
                income={undefined}
                expenses={undefined}
                userId={userId}
              />
            </View>
          ))
        ) : (
          <></>
        )}
      </View>
    </ScrollView>
  );
};

export default ViewPost;
