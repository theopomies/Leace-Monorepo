import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";

import { trpc } from "../../../../web/src/utils/trpc";
import { Btn } from "../../components/Btn";
import { UserProfile } from "../../components/UserProfile";

const ClientCard = ({
  firstName,
  lastName,
  email,
  image,
  otherId,
  onDislike,
  onLike,
}: {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
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
            <Text className="text-14 mb-5 text-gray-600">{email}</Text>
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
    updateUser.mutateAsync({
      isPremium: false,
      userId: user?.id as string,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginTop: 75,
          alignItems: "center",
          paddingHorizontal: 3,
          paddingBottom: 2,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          You are now a premium member. To cancel this subscription, click here:
        </Text>
        <Btn title="Cancel" className="mt-5 w-32" onPress={updateStatus} />
      </View>
      <ScrollView
        style={{ flex: 1, marginTop: 100 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {rs.data?.relationship && rs.data.relationship.length > 0 ? (
            rs.data.relationship.map((item) => (
              <View key={item.id} className="mb-2 flex-1 items-center">
                <ClientCard
                  firstName={item.user.firstName}
                  lastName={item.user.lastName}
                  email={item.user.email}
                  image={item.user.image}
                  onDislike={() => deleteClient(item.postId, item.userId)}
                  onLike={() => acceptClient(item.postId, item.userId)}
                  otherId={item.userId}
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
    </View>
  );
};

export default OwnerLikes;

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
