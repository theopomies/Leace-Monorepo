import { View, Text, ScrollView } from "react-native";
import React from "react";

import { trpc } from "../../utils/trpc";

import ShowProfile from "../../components/ShowProfile";
import { ClientCard } from "../../components/Card";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";

const Clients = () => {
  const route = useRoute<RouteProp<TabStackParamList, "Clients">>();
  const userId = route.params?.userId;

  const rs = trpc.support.getRelationshipsForOwner.useQuery({ userId });

  return (
    <ScrollView className="mx-5 mt-20" showsVerticalScrollIndicator={false}>
      <View>
        <View className="ml-10 flex-row items-center justify-center">
          <Text className="font-p text-custom mx-auto mb-10	text-center text-3xl font-bold">
            CLIENTS
          </Text>
          <ShowProfile path={require("../../../assets/blank.png")} />
        </View>
        {rs.data ? (
          rs.data.map((item) => (
            <View key={item.id} className="mb-2 items-center">
              <ClientCard
                firstName={item.user.firstName}
                lastName={item.user.lastName}
                email={item.user.email}
                image={require("../../../assets/blank.png")}
                userId={userId}
                relationshipId={item.id}
              />
            </View>
          ))
        ) : (
          <View className="bottom-80 left-0 right-0 top-80 items-center justify-center">
            <Text className="items-center justify-center text-center text-3xl font-bold">
              No clients added
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Clients;
