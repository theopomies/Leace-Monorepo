import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "../../components/Button";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import CustomInput from "../../components/CustomInput/CustomInput";
import { RouterInputs } from "../../../../web/src/utils/trpc";
import { trpc } from "../../utils/trpc";

export const Contract = ({
  route,
}: {
  route?: RouteProp<TabStackParamList, "Contract">;
}) => {
  const params = route?.params;

  console.log(params);

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const contracts = trpc.conversation.sendDealToUser.useMutation();

  const [data, setData] = useState<
    RouterInputs["conversation"]["sendDealToUser"]
  >({
    conversationId: "",
  });

  const onChangeAttributesHandler = (
    key: string,
    value: string | number | boolean | Date,
  ) => {
    console.log(data);

    if (!key) return;

    setData((prevState) => ({
      ...prevState,
      [key]: value,
      conversationId: params?.id as string,
    }));
  };

  const updateAttributesButton = async () => {
    if (!data) return;

    const payload = {
      conversationId: data.conversationId,
    };

    await contracts.mutateAsync(payload);
    navigation.navigate("Contract", { id: params as unknown as string });
  };

  return (
    <View className="mt-20">
      <View className="flex h-full flex-col space-y-16">
        <View className="ml-10 flex-row items-center justify-center">
          <Text className="font-poppins text-custom mx-auto	text-center text-3xl">
            CONTRACT
          </Text>
        </View>
        <View>
          <CustomInput
            label="Price"
            category="price"
            onChangeAttributesHandler={onChangeAttributesHandler}
            multiline={true}
            placeholder="Enter price..."
            value={undefined}
          />
          <CustomInput
            label="Time length"
            category="time"
            onChangeAttributesHandler={onChangeAttributesHandler}
            multiline={true}
            placeholder="Enter time lenght..."
            value={undefined}
          />
          <View className="mt-20 flex flex-row items-center justify-center">
            <View className="mr-10">
              <Button
                title={"Cancel"}
                color={"custom"}
                onPress={() =>
                  navigation.navigate("Chat", {
                    id: params as unknown as string,
                  })
                }
              />
            </View>
            <View>
              <Button
                title={"Next"}
                color={"custom"}
                onPress={updateAttributesButton}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
