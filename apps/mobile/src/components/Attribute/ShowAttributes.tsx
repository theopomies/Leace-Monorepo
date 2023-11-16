import { View, Text } from "react-native";
import React from "react";
import { Attribute } from "@prisma/client";
import { Icon } from "react-native-elements";

interface IShowAttributes {
  attribute: Attribute;
  iconTextColor?: string;
  iconBGColor?: string;
  titleColor?: string;
  show?: boolean;
}
interface IAttributeBtn {
  name: string;
  status: boolean | null;
  iconName: string;
  iconTextColor?: string;
  iconBGColor?: string;
}

function AttributeBtn({
  name,
  status,
  iconName,
  iconTextColor,
  iconBGColor,
}: IAttributeBtn) {
  if (!status) return null;
  return (
    <View
      className="flex min-w-[100px] flex-row items-center justify-center space-x-1 rounded-full px-2 py-1"
      style={{
        margin: 2,
        backgroundColor: iconBGColor,
      }}
    >
      <Icon
        name={iconName}
        color={iconTextColor}
        size={20}
        type="material-icons"
      ></Icon>
      <Text className="font-light" style={{ color: iconTextColor }}>
        {name}
      </Text>
    </View>
  );
}

export default function ShowAttributes({
  attribute,
  iconTextColor = "#FFFFFF",
  iconBGColor = "#0A2472",
  titleColor = "#0A2472",
  show = true,
}: IShowAttributes) {
  return (
    <View className="flex">
      {show && (
        <View>
          <View>
            <Text className="text-base font-bold" style={{ color: titleColor }}>
              Rent:
            </Text>
            <View className="flex flex-row justify-evenly">
              <View className="flex min-w-[100px] items-center justify-center rounded-full bg-[#0A2472] px-2 py-1">
                <Text className="font-light text-white">
                  Start: {attribute.rentStartDate?.toLocaleDateString() ?? "-"}
                </Text>
              </View>
              <View className="flex min-w-[100px] items-center justify-center rounded-full bg-[#0A2472] px-2 py-1">
                <Text className="font-light text-white">
                  End: {attribute.rentEndDate?.toLocaleDateString() ?? "-"}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text className="text-base font-bold" style={{ color: titleColor }}>
              Budget:
            </Text>
            <View className="flex flex-row justify-evenly">
              <View className="flex min-w-[100px] items-center justify-center rounded-full bg-[#0A2472] px-2 py-1">
                <Text className="font-light text-white">
                  Min: {attribute.minPrice ?? "-"} €
                </Text>
              </View>
              <View className="flex min-w-[100px] items-center justify-center rounded-full bg-[#0A2472] px-2 py-1">
                <Text className="font-light text-white">
                  Max: {attribute.maxPrice ?? "-"} €
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text className="text-base font-bold" style={{ color: titleColor }}>
              Size:
            </Text>
            <View className="flex flex-row justify-evenly">
              <View className="flex min-w-[100px] items-center justify-center rounded-full bg-[#0A2472] px-2 py-1">
                <Text className="font-light text-white">
                  Min: {attribute.minSize ?? "-"} m²
                </Text>
              </View>
              <View className="flex min-w-[100px] items-center justify-center rounded-full bg-[#0A2472] px-2 py-1">
                <Text className="font-light text-white">
                  Max: {attribute.maxSize ?? "-"} m²
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
      <Text className="text-base font-bold" style={{ color: titleColor }}>
        Attributes:
      </Text>
      <View className="mt-2 flex flex-row flex-wrap items-center justify-center">
        <AttributeBtn
          name="Furnished"
          status={attribute.furnished}
          iconName="king-bed"
          iconTextColor={iconTextColor}
          iconBGColor={iconBGColor}
        />
        <AttributeBtn
          name="Terrace"
          status={attribute.terrace}
          iconName="deck"
          iconTextColor={iconTextColor}
          iconBGColor={iconBGColor}
        />
        <AttributeBtn
          name="Pets"
          status={attribute.pets}
          iconName="pets"
          iconTextColor={iconTextColor}
          iconBGColor={iconBGColor}
        />
        <AttributeBtn
          name="Smoker"
          status={attribute.smoker}
          iconName="smoking-rooms"
          iconTextColor={iconTextColor}
          iconBGColor={iconBGColor}
        />
        <AttributeBtn
          name="Disability"
          status={attribute.disability}
          iconName="accessible"
          iconTextColor={iconTextColor}
          iconBGColor={iconBGColor}
        />
        <AttributeBtn
          name="Garden"
          status={attribute.garden}
          iconName="local-florist"
          iconTextColor={iconTextColor}
          iconBGColor={iconBGColor}
        />
        <AttributeBtn
          name="Parking"
          status={attribute.parking}
          iconName="local-parking"
          iconTextColor={iconTextColor}
          iconBGColor={iconBGColor}
        />
        <AttributeBtn
          name="Elevator"
          status={attribute.elevator}
          iconName="elevator"
          iconTextColor={iconTextColor}
          iconBGColor={iconBGColor}
        />
        <AttributeBtn
          name="Pool"
          status={attribute.pool}
          iconName="pool"
          iconTextColor={iconTextColor}
          iconBGColor={iconBGColor}
        />
      </View>
    </View>
  );
}
