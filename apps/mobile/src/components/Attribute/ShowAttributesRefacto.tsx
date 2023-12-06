import { View, Text } from "react-native";
import React from "react";
import { Attribute } from "@prisma/client";
import { Divider, Icon } from "react-native-elements";

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
  iconBGColor = "#10316B",
  titleColor = "#10316B",
  show = true,
}: IShowAttributes) {
  return (
    <View>
      {show && (
        <View className="p-6 mx-4">
          <Text className="text-xl font-bold text-[#111827] mb-2">
            Preferences:
          </Text>
          <Text className="text-lg font-semibold text-[#111827]">
            Renting dates:
          </Text>
          <View className="flex flex-row justify-evenly my-4">
            <View className="flex min-w-[350px] items-center justify-center rounded-xl bg-[#6C47FF] px-2 py-2">
              <Text className="text-lg font-md text-white">
                <Text className="text-xl  text-white">
                  {attribute.rentStartDate?.toLocaleDateString() ?? "_"}
                </Text>
                <Icon className="w-32"
                  name={"arrow-right-alt"}
                  color={"white"}
                  size={32}
                  type="material-icons"
                ></Icon>
                <Text className="text-xl  text-white">
                  {attribute.rentEndDate?.toLocaleDateString() ?? "_"}
                </Text>
              </Text>
            </View>
          </View>
          <Text className="text-lg font-semibold text-[#111827]">
            Price Range:
          </Text>
          <View className="flex flex-row justify-evenly my-4">
            <View className="flex min-w-[350px] items-center justify-center rounded-xl bg-[#6C47FF] px-2 py-2">
              <Text className="text-lg font-md text-white">
                <Text className="text-xl  text-white">
                  {attribute.minPrice ?? "_"}
                  {" €"}
                </Text>
                <Icon className="w-32"
                  name={"arrow-right-alt"}
                  color={"white"}
                  size={32}
                  type="material-icons"
                ></Icon>
                <Text className="text-xl  text-white">
                  {attribute.maxPrice ?? "_"}
                  {" €"}
                </Text>
              </Text>
            </View>
          </View>

          <Text className="text-lg font-semibold text-[#111827]">
            Surface Range:
          </Text>
          <View className="flex flex-row justify-evenly my-4">
            <View className="flex min-w-[350px] items-center justify-center rounded-xl bg-[#6C47FF] px-2 py-2">
              <Text className="text-lg font-md text-white">
                <Text className="text-xl  text-white">
                  {attribute.minSize ?? "_"}
                  {" m²"}
                </Text>
                <Icon className="w-32"
                  name={"arrow-right-alt"}
                  color={"white"}
                  size={32}
                  type="material-icons"
                ></Icon>
                <Text className="text-xl  text-white">
                  {attribute.minSize ?? "_"}
                  {" m²"}
                </Text>
              </Text>
            </View>
          </View>
          <Text className="text-lg font-semibold text-[#111827]">
            Attributes:
          </Text>

          {!attribute.furnished && !attribute.terrace && !attribute.pets && !attribute.smoker && !attribute.disability && !attribute.garden && !attribute.parking && !attribute.elevator && !attribute.pool && (
            <Text className="text-md font-semibold text-[#111827] my-2">
              No attribute selected
            </Text>
          )}


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
      )}

    </View>
  );
}