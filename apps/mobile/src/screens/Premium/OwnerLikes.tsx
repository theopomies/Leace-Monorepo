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
import { Btn } from "../../components/Btn";

const ClientCard = ({
  firstName,
  lastName,
  email,
  image,
  onDislike,
  onLike,
}: {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
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
          <Text className="text-18 mb-5 font-bold">
            {firstName} {lastName}
          </Text>
          <Text className="text-14 mb-5 text-gray-600">{email}</Text>
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

const OwnerLikes = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const rs = trpc.relationship.getLikesForOwner.useQuery({
    userId: session?.userId as string,
  });

  const accept = trpc.relationship.likeTenantForPost.useMutation();

  const acceptClient = async (postId: string, userId: string) => {
    await accept.mutateAsync({
      userId,
      postId,
    });
  };

  const del = trpc.relationship.dislikeTenantForPost.useMutation();

  const deleteClient = async (postId: string, userId: string) => {
    await del.mutateAsync({
      userId,
      postId,
    });
  };

  const { data: user } = trpc.user.getUserById.useQuery({
    userId: session?.userId as string,
  });

  const updateUser = trpc.user.updateUserById.useMutation();

  const updateStatus = async () => {
    console.log("toto");
    updateUser.mutateAsync({
      isPremium: false,
      userId: user?.id as string,
    });
  };

  return (
    <>
      <View className="mt-20 items-center justify-center px-3 pb-2">
        <Text className="mb-2 text-xl font-semibold">
          You are now a premium member, to cancel this subscription click on
          here
        </Text>
        <Btn
          title="Cancel"
          className="w-20 p-2"
          bgColor="#EF4444"
          onPress={updateStatus}
        />
      </View>
      <ScrollView className="mx-5 mt-10" showsVerticalScrollIndicator={false}>
        <View>
          {rs.data?.relationship && rs.data.relationship.length > 0 ? (
            rs.data.relationship.map((item) => (
              <View key={item.id} className="mb-2 items-center">
                <ClientCard
                  firstName={item.user.firstName}
                  lastName={item.user.lastName}
                  email={item.user.email}
                  image={item.user.image}
                  onDislike={() => deleteClient(item.postId, item.userId)}
                  onLike={() => acceptClient(item.postId, item.userId)}
                />
              </View>
            ))
          ) : (
            <View className="bottom-80 left-0 right-0 top-80 items-center justify-center">
              <Text className="items-center justify-center text-center text-3xl font-bold">
                No one liked your post (Owner)
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default OwnerLikes;
