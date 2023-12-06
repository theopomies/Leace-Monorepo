import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import React, { useState } from "react";

import { trpc } from "../../../../web/src/utils/trpc";
import { Btn } from "../../components/Btn";
import { UserProfile } from "../../components/UserProfile";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";

const ClientCard = ({
  firstName,
  lastName,
  image,
  otherId,
  onDislike,
  onLike,
}: {
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  otherId: string;
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

  const { data: user } = trpc.user.getUserById.useQuery({
    userId: otherId,
  });

  const [isModalVisible, setModalVisible] = useState(false);

  const openUserProfile = () => {
    setModalVisible(true);
  };

  const closeUserProfile = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        className="max-w-400 w-full overflow-hidden rounded-2xl border border-gray-300"
        onPress={openUserProfile}
      >
        <View className="flex-row items-center p-2">
          <Image
            source={{ uri: imageUrl }}
            className="mr-10 h-20 w-20 rounded-full"
          />
          <View className="mr-10">
            <Text className="text-18 mb-5  font-bold">
              {firstName} {lastName}
            </Text>
          </View>
          <TouchableOpacity onPress={onLike}>
            <Text
              style={{ color: "green", fontWeight: "bold", marginRight: 20 }}
            >
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={{ color: "red", fontWeight: "bold" }}>Delete</Text>
          </TouchableOpacity>
        </View>
        <View className="rounded-10 border-1 overflow-hidden border-gray-300" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeUserProfile}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {user && (
              <UserProfile userId={otherId} data={user} showLogout={false} />
            )}
            <Btn title="Close" onPress={closeUserProfile} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const TenantLikes = () => {
  const route = useRoute<RouteProp<TabStackParamList, "Likes">>();

  const subscriptionId = route.params?.subscriptionId;

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

  const { data: user } = trpc.user.getUserById.useQuery({
    userId: session?.userId as string,
  });

  const updateUser = trpc.user.updateUserById.useMutation();

  const payment = trpc.stripe.cancelPayment.useMutation();

  const updateStatus = async () => {
    payment.mutateAsync({
      subscriptionId,
    });
    updateUser.mutateAsync({
      isPremium: false,
      userId: user?.id as string,
    });
  };

  return (
    <>
      <View className="mt-20 items-center justify-center px-3 pb-2">
        <Text className="mb-2 text-center text-xl font-semibold">
          You are now a premium member, to cancel this subscription click on
          here
        </Text>
        <Btn
          title="Cancel"
          className="mt-5 w-20 p-2"
          bgColor="#EF4444"
          onPress={updateStatus}
        />
      </View>
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
                  otherId={item.userId}
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
    </>
  );
};

export default TenantLikes;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
});
