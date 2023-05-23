import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import { ReportModal } from "../Modal";
import BottomBar from "./BottomBar";
import Message from "./Message";
import { ContractCard } from "../Card";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";

export const Portal = ({
  route,
}: {
  route?: RouteProp<TabStackParamList, "Portal">;
}) => {
  const params = route?.params;

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const [value, setValue] = useState("");
  const [selected, setSelected] = useState({ item: "" });

  const onSelect = (item: { item: string }) => {
    setSelected(item);

    if (item.item === "Contract") {
      navigation.navigate("Contract", { id: params as unknown as string });
    }
  };

  const handleChange = (text: string) => {
    setValue(text);
  };

  const data = [
    { item: "Contract" },
    { item: "Photo & Video" },
    { item: "Document" },
    { item: "Report" },
  ];

  return (
    <View className="mt-10">
      <View className="flex-row items-center border-b border-gray-400 bg-white p-3">
        <TouchableOpacity
          className="mr-5"
          onPress={() => navigation.navigate("Dashboard")}
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
        <ReportModal cond={false} visible={true} />
      ) : null}

      <Message />

      <ContractCard />

      <View className="max-h-100 absolute bottom-0 left-0 flex w-full items-center justify-between p-5">
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
