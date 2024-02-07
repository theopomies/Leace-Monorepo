import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useCallback } from "react";
import { RouteProp, useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";
import { Loading } from "../../components/Loading";
import { Relationship, User, Post, Lease, Conversation } from "@prisma/client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { Btn } from "../../components/Btn";
import { LocalStorage } from "../../utils/cache";

interface IMatchCard {
  data: Relationship & {
    user: User;
    post: Post & {
      createdBy: User;
    };
    lease: Lease | null;
    conversation: Conversation | null;
  };
  tenantId: string;
  ownerId: string;
  role: "TENANT" | "OWNER" | "AGENCY";
  userId: string;
  handleMatch: (id: string) => void;
}

function MatchCard({
  data,
  tenantId,
  ownerId,
  role,
  userId,
  handleMatch,
}: IMatchCard) {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <TouchableOpacity
      className="border-indigo relative mt-3 flex min-h-[100px] flex-row rounded-md border p-2"
      onPress={() =>
        navigation.navigate("ChatTenant", {
          relationshipId: data.id,
          tenantId,
          ownerId,
          role,
          conversationId: data.conversation?.id ?? "",
          userId,
          lease: data.lease,
        })
      }
    >
      <Btn
        className="absolute right-0 top-0 z-10 rounded-md rounded-br-none rounded-tl-none"
        bgColor="#ef4444"
        iconName="delete"
        iconType="material"
        onPress={() => handleMatch(data.id)}
      />
      <Image
        className="h-24 w-24 rounded-full"
        style={{ borderWidth: 2, borderColor: "white" }}
        source={{
          uri:
            data.post.createdBy.image ??
            "https://montverde.org/wp-content/themes/eikra/assets/img/noimage-420x273.jpg",
        }}
      />
      <View className="flex-1 justify-between pl-2">
        <Text className="font-bold">{data.post.title}</Text>
        {/*<Text className="font-bold">{data.post.desc}</Text>*/}
        <View>
          {role === "TENANT" ? (
            <Text className="font-light">
              Owner: {data.post.createdBy.firstName}{" "}
              {data.post.createdBy.lastName}
            </Text>
          ) : (
            <Text className="font-light">
              Tenant: {data.user.firstName} {data.user.lastName}
            </Text>
          )}
          {/*<Text className="font-light">
            Email:{" "}
            {role === "TENANT" ? data.post.createdBy.email : data.user.email}
          </Text>*/}
          <Text className="font-light">
            Status:{" "}
            <Text
              className={`font-bold ${data.post.type === "TO_BE_RENTED"
                  ? "text-green-500"
                  : "text-red-500"
                }`}
            >
              {data.post.type === "TO_BE_RENTED" ? "Available" : "Rented"}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function TenantMatches() {
  const route = useRoute<RouteProp<TabStackParamList, "MatchTenant">>();
  const { role, userId } = route.params;
  const { data, isLoading, refetch } =
    role === "TENANT"
      ? trpc.relationship.getMatchesForTenant.useQuery({ userId })
      : trpc.relationship.getMatchesForOwner.useQuery({ userId });

  const deleteMatch =
    role === "TENANT"
      ? trpc.relationship.deleteRelationForTenant.useMutation()
      : trpc.relationship.deleteRelationForOwner.useMutation();

  async function handleMatch(id: string) {
    await deleteMatch
      .mutateAsync({ userId, relationshipId: id })
      .then(() => refetch());
  }

  useFocusEffect(
    useCallback(() => {
      const check = LocalStorage.getItem("refreshMatches");
      if (!check) return;
      LocalStorage.setItem("refreshMatches", false);
      refetch();
    }, [userId]),
  );

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Loading />
        </View>
      </View>
    );

  if (!data)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.view}>
          <Header />
          <Text>Data not found</Text>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header callback={refetch} />
        <View className="flex-1 bg-white">
          {data.length > 0 ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              className="px-2"
            >
              {data.map((match, idx) => (
                <MatchCard
                  data={match}
                  key={idx}
                  tenantId={match.user.id}
                  ownerId={match.post.createdById}
                  role={role}
                  userId={userId}
                  handleMatch={handleMatch}
                />
              ))}
            </ScrollView>
          ) : (
            <View className={`flex-1 items-center justify-center px-3`}>
              {role === "TENANT" ? (
                <Text className="text-center font-bold">
                  No one has matched with you, yet.
                </Text>
              ) : (
                <Text className="text-center font-bold">
                  No one has matched with your apartment lease listing, yet.
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  view: {
    flex: 1,
    backgroundColor: "white",
  },
});
