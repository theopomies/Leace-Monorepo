import { View, Text, ScrollView } from "react-native";
import React from "react";

import ShowProfile from "../../components/ShowProfile";
import { ClientCard } from "../../components/Card";
import { trpc } from "../../../../web/src/utils/trpc";

const Clients = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const rs = trpc.relationship.getMatchesForOwner.useQuery({
    userId: session?.userId as string,
  });

  let firstName: string | null | undefined = null;
  let lastName: string | null | undefined = null;

  if (rs.data && rs.data.length > 0) {
    firstName = rs.data[0]?.post.createdBy.firstName;
    lastName = rs.data[0]?.post.createdBy.lastName;
  }

  const fst = firstName as string;
  const lst = lastName as string;

  const del = trpc.relationship.deleteRelationForOwner.useMutation();

  const deleteClient = async (relationshipId: string) => {
    await del.mutateAsync({
      userId: session?.userId as string,
      relationshipId,
    });
  };

  return (
    <ScrollView className="mx-5 mt-20" showsVerticalScrollIndicator={false}>
      <View>
        <View className="ml-10 flex-row items-center justify-center">
          <Text className="font-p text-custom mx-auto mb-10	text-center text-3xl font-bold">
            CLIENTS
          </Text>
          <ShowProfile path={require("../../../assets/blank.png")} />
        </View>
        {rs.data && rs.data.length > 0 ? (
          rs.data.map((item) => (
            <View key={item.id} className="mb-2 items-center">
              <ClientCard
                firstName={fst}
                lastName={lst}
                email={item.user.email}
                image={require("../../../assets/blank.png")}
                onDelete={() => deleteClient(item.id)}
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
