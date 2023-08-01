import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";
import Loading from "../../components/Loading";
import { Relationship, User, Post, Lease, Conversation } from "@prisma/client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";

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
}

function MatchCard({ data, tenantId, ownerId, role, userId }: IMatchCard) {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <TouchableOpacity
      className="mt-3 flex min-h-[100px] flex-row rounded-md bg-[#10316B] p-2"
      onPress={() =>
        navigation.navigate("ChatTenant", {
          tenantId,
          ownerId,
          role,
          conversationId: data.conversation?.id ?? "",
          userId,
        })
      }
    >
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
        <Text className="font-bold text-white">{data.post.title}</Text>
        <View>
          {role === "TENANT" ? (
            <Text className="font-light text-white">
              Owner: {data.post.createdBy.firstName}{" "}
              {data.post.createdBy.lastName}
            </Text>
          ) : (
            <Text className="font-light text-white">
              Tenant: {data.user.firstName} {data.user.lastName}
            </Text>
          )}
          <Text className="font-light text-white">
            Email:{" "}
            {role === "TENANT" ? data.post.createdBy.email : data.user.email}
          </Text>
          <Text className="font-light text-white">
            Status:{" "}
            <Text
              className={`font-light ${
                data.post.type === "TO_BE_RENTED"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {data.post.type}
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
      <View style={styles.container}>
        <View style={styles.view}>
          <Text>Data not found</Text>
        </View>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        <View className="flex-1 bg-white">
          {data && (
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
                />
              ))}
            </ScrollView>
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white", // #F2F7FF
  },
});
