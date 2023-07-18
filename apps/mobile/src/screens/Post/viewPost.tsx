import React from "react";
import { View, ScrollView, Text } from "react-native";
import { PostCard } from "../../components/Card";

import ShowProfile from "../../components/ShowProfile";
import { trpc } from "../../../../web/src/utils/trpc";

const ViewPost = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const posts = trpc.post.getPostsByUserId.useQuery({
    userId: session?.userId as string,
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
                postId={post.id}
                title={post.title}
                desc={post.desc}
                content={post.content}
                income={undefined}
                expenses={undefined}
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
