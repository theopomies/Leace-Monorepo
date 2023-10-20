import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";

import { trpc } from "../../../../web/src/utils/trpc";

const ClientCard = ({
  firstName,
  lastName,
  image,
  onDislike,
  onLike,
}: {
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  onDislike: () => void;
  onLike: () => void;
}) => {
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this client?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            onDislike();
          },
        },
      ],
    );
  };

  const imageUrl: string | undefined = image ?? undefined;

  return (
    <TouchableOpacity
      className="max-w-400 w-full overflow-hidden rounded-2xl border border-gray-300"
      onPress={() => {}}
    >
      <View className="flex-row items-center p-2">
        <Image
          source={{ uri: imageUrl }}
          className="mr-10 h-20 w-20 rounded-full"
        />
        <View className="flex-1">
          <Text className="text-18 mb-5 font-bold">{firstName}</Text>
          <Text className="text-18 mb-5 font-bold">{lastName}</Text>
        </View>
        <TouchableOpacity onPress={onLike}>
          <Text style={{ color: "green", fontWeight: "bold", marginRight: 20 }}>
            Accept
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={{ color: "red", fontWeight: "bold" }}>Delete</Text>
        </TouchableOpacity>
      </View>
      <View className="rounded-10 border-1 overflow-hidden border-gray-300" />
    </TouchableOpacity>
  );
};

const TenantLikes = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const rs = trpc.relationship.getLikesForTenant.useQuery({
    userId: session?.userId as string,
  });

  const accept = trpc.relationship.likePostForTenant.useMutation();

  const acceptClient = async (postId: string, userId: string) => {
    await accept.mutateAsync({
      userId,
      postId,
    });
  };

  const del = trpc.relationship.dislikePostForTenant.useMutation();

  const deleteClient = async (postId: string, userId: string) => {
    await del.mutateAsync({
      userId,
      postId,
    });
  };

  return (
    <ScrollView className="mx-5 mt-20" showsVerticalScrollIndicator={false}>
      <View>
        {rs.data?.relationship && rs.data.relationship.length > 0 ? (
          rs.data.relationship.map((item) => (
            <View key={item.id} className="mb-2 items-center">
              <ClientCard
                firstName={item.post.title}
                lastName={item.post.desc}
                onDislike={() => deleteClient(item.postId, item.userId)}
                onLike={() => acceptClient(item.postId, item.userId)}
                image={
                  "https://www.livehome3d.com/assets/img/social/how-to-design-a-house.jpg"
                }
              />
            </View>
          ))
        ) : (
          <View className="bottom-80 left-0 right-0 top-80 items-center justify-center">
            <Text className="items-center justify-center text-center text-3xl font-bold">
              No one liked your post (Tenant)
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TenantLikes;