import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import { ReportModal } from "../Modal";
import BottomBar from "./BottomBar";
import Message from "./Message";
import { ContractCard } from "../Card";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { trpc } from "../../utils/trpc";

export const Portal = () => {
  const route = useRoute<RouteProp<TabStackParamList, "Portal">>();
  const userId = route.params?.userId;
  const relationshipId = route.params?.relationshipId;

  const lease = trpc.lease.getLeasesByUserId.useQuery({ userId });

  const deleteLease = trpc.lease.deleteLeaseById.useMutation();

  const deleteLeaseButton = () => {
    deleteLease.mutate({
      leaseId: lease.data[0]?.id as string,
    });
  };

  const updateLeaseButton = async () => {
    navigation.navigate("UpdateLease", {
      userId,
      relationshipId,
      leaseId: lease.data[0]?.id as string,
    });
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const [value, setValue] = useState("");
  const [selected, setSelected] = useState({ item: "" });
  const [openReport, setOpenReport] = useState(false);

  const onSelect = (item: { item: string }) => {
    setSelected(item);

    console.log(item.item);
    console.log(selected.item);
    if (item.item === "Report") {
      setSelected({ item: "Report" });
      setOpenReport(true);
    } else if (item.item === "Lease") {
      navigation.navigate("Lease", { userId, relationshipId });
    }
  };

  const handleChange = (text: string) => {
    setValue(text);
  };

  const data = [
    { item: "Lease" },
    { item: "Photo & Video" },
    { item: "Document" },
    { item: "Report" },
  ];

  return (
    <View className="flex flex-1">
      <View className="mb-20 mt-10 flex flex-1">
        <View className="flex-row items-center border-b border-gray-400 bg-white p-3">
          <TouchableOpacity
            className="mr-5"
            onPress={() => navigation.navigate("Dashboard", { userId })}
          >
            <Icon
              size={20}
              name="arrow-back-ios"
              type="material-icons"
              color={"#002642"}
            />
          </TouchableOpacity>
          <Image
            source={require("../../../assets/blank.png")}
            className="mr-10 h-10 w-10 rounded-full"
          />
          <Text className="ml-5 flex text-center text-2xl font-bold">
            John Doe
          </Text>
        </View>

        {selected.item === "Report" ? (
          <ReportModal
            isOpened={openReport}
            setIsOpened={() => {
              setOpenReport(!openReport);
            }}
            userId={userId}
          />
        ) : null}

        <Message />

        {lease.data && lease.data.length > 0 && (
          <ContractCard
            rentCost={lease.data[0].rentCost as number}
            utilitiesCost={lease.data[0].utilitiesCost as number}
            startDate={lease.data[0].startDate as Date}
            endDate={lease.data[0].endDate as Date}
            deleteLease={deleteLeaseButton}
            updateLease={updateLeaseButton}
          />
        )}
      </View>

      <View className="flex w-full items-center justify-between p-5">
        <BottomBar
          onSelect={onSelect}
          data={data}
          value={value}
          handleChange={handleChange}
        />
      </View>
    </View>
  );
};
