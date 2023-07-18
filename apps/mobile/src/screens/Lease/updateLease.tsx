import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "../../components/Button";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import CustomInput from "../../components/CustomInput/CustomInput";
import { RouterInputs, trpc } from "../../../../web/src/utils/trpc";
import { DatePicker } from "../../components/Attributes";

export const UpdateLease = () => {
  const route = useRoute<RouteProp<TabStackParamList, "UpdateLease">>();

  const leaseId = route.params.leaseId;

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const lease = trpc.lease.updateLeaseById.useMutation();

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    rentCost: false,
    utilitiesCost: false,
  });

  const [data, setData] = useState<RouterInputs["lease"]["updateLeaseById"]>({
    leaseId: "",
    rentCost: 0,
    utilitiesCost: 0,
    startDate: new Date(),
    endDate: new Date(),
  });

  const [isRentModified, setIsRentModified] = useState(false);
  const [isUtilitiesModified, setIsUtilitiesModified] = useState(false);

  const onChangeAttributesHandler = (
    key: string,
    value: string | number | boolean | Date,
  ) => {
    if (!key) return;

    if (key === "rent") {
      if (isNaN(Number(value))) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          rentCost: true,
        }));
        setIsRentModified(true);
        setData((prevState) => ({
          ...prevState,
          leaseId: leaseId,
          rentCost: 0,
        }));
        return;
      }
      setIsRentModified(true);
      setData((prevState) => ({
        ...prevState,
        leaseId: leaseId,
        rentCost: Number(value),
      }));
    }

    if (key === "utilities") {
      if (isNaN(Number(value))) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          utilitiesCost: true,
        }));
        setIsUtilitiesModified(true);
        setData((prevState) => ({
          ...prevState,
          leaseId: leaseId,
          utilitiesCost: 0,
        }));
        return;
      }
      setIsUtilitiesModified(true);
      setData((prevState) => ({
        ...prevState,
        leaseId: leaseId,
        utilitiesCost: Number(value),
      }));
    }

    if (key === "startDate" || key === "endDate") {
      setData((prevState) => ({
        ...prevState,
        [key]: value,
        leaseId: leaseId,
      }));
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: false,
    }));
  };

  const updateAttributesButton = async () => {
    const newErrors = {
      rentCost: isRentModified && isNaN(Number(data.rentCost)),
      utilitiesCost: isUtilitiesModified && isNaN(Number(data.utilitiesCost)),
    };

    setErrors(newErrors);

    if (newErrors.rentCost || newErrors.utilitiesCost) {
      return;
    }

    if (!data) return;

    await lease.mutateAsync(data);
    navigation.navigate("Portal", {});
  };

  return (
    <View className="mt-20">
      <View className="flex h-full flex-col space-y-16">
        <View className="ml-10 flex-row items-center justify-center">
          <Text className="font-poppins text-custom mx-auto	text-center text-3xl">
            LEASE
          </Text>
        </View>
        <View>
          <CustomInput
            label="Rent"
            category="rent"
            onChangeAttributesHandler={onChangeAttributesHandler}
            multiline={false}
            placeholder="Enter rent cost..."
            value={isRentModified ? data.rentCost.toString() : ""}
            isEmpty={errors.rentCost || false}
          />
          <CustomInput
            label="Utilities"
            category="utilities"
            onChangeAttributesHandler={onChangeAttributesHandler}
            multiline={false}
            placeholder="Enter utilities cost..."
            value={isUtilitiesModified ? data.utilitiesCost.toString() : ""}
            isEmpty={errors.utilitiesCost || false}
          />
          <DatePicker
            startLabel="startDate"
            endLabel="endDate"
            onChangeAttributesHandler={onChangeAttributesHandler}
          />

          <View className="mt-20 flex flex-row items-center justify-center">
            <View className="mr-10">
              <Button
                title={"Cancel"}
                color={"custom"}
                onPress={() => navigation.navigate("Portal", {})}
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
