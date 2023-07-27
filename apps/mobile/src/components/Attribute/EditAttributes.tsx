import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { Attribute } from "@prisma/client";
import { Icon } from "react-native-elements";
import { User } from "@leace/db";

interface IShowAttributes {
  user:
    | (User & {
        attribute: Attribute | null;
      })
    | undefined;
  setUser: React.Dispatch<
    React.SetStateAction<
      | (User & {
          attribute: Attribute | null;
        })
      | undefined
    >
  >;
}
interface IAttributeBtn {
  name: string;
  status: boolean | null;
  iconName: string;
}

function AttributeBtn({ name, status, iconName }: IAttributeBtn) {
  return (
    <View
      className="flex min-w-[100px] flex-row items-center justify-center space-x-1 rounded-full px-2 py-1"
      style={{
        margin: 2,
        backgroundColor: "#10316B",
        opacity: status ? 1 : 0.5,
      }}
    >
      <Icon
        name={iconName}
        color={"white"}
        size={20}
        type="material-icons"
      ></Icon>
      <Text className="font-light text-white">{name}</Text>
    </View>
  );
}

export default function EditAttributes({ user, setUser }: IShowAttributes) {
  if (!user || !user.attribute) return null;
  return (
    <View className="flex space-y-1">
      <View>
        <View>
          <Text className="text-base font-bold text-[#10316B]">Budget:</Text>
          <View className="flex flex-row justify-evenly">
            <View className="flex min-w-[100px] flex-row items-center justify-center rounded-full bg-[#10316B] px-2 py-0.5">
              <Text className="font-light text-white">Min: </Text>
              <TextInput
                // @ts-ignore
                inputMode="numeric"
                placeholder="0"
                className="font-light text-white"
                placeholderTextColor={"white"}
                onChangeText={(text) => {
                  if (!user.attribute || !text) return;
                  setUser({
                    ...user,
                    attribute: { ...user.attribute, minPrice: parseInt(text) },
                  });
                }}
                defaultValue={user.attribute.minPrice?.toString() ?? "0"}
              />
              <Text className="font-light text-white"> €</Text>
            </View>
            <View className="flex min-w-[100px] flex-row items-center justify-center rounded-full bg-[#10316B] px-2 py-0.5">
              <Text className="font-light text-white">Max: </Text>
              <TextInput
                // @ts-ignore
                inputMode="numeric"
                placeholder="0"
                className="font-light text-white"
                placeholderTextColor={"white"}
                onChangeText={(text) => {
                  if (!user.attribute || !text) return;
                  setUser({
                    ...user,
                    attribute: { ...user.attribute, maxPrice: parseInt(text) },
                  });
                }}
                defaultValue={user.attribute.maxPrice?.toString() ?? "0"}
              />
              <Text className="font-light text-white"> €</Text>
            </View>
          </View>
        </View>
        <View>
          <Text className="text-base font-bold text-[#10316B]">Size:</Text>
          <View className="flex flex-row justify-evenly">
            <View className="flex min-w-[100px] flex-row items-center justify-center rounded-full bg-[#10316B] px-2 py-0.5">
              <Text className="font-light text-white">Min: </Text>
              <TextInput
                // @ts-ignore
                inputMode="numeric"
                placeholder="0"
                className="font-light text-white"
                placeholderTextColor={"white"}
                onChangeText={(text) => {
                  if (!user.attribute || !text) return;
                  setUser({
                    ...user,
                    attribute: { ...user.attribute, minSize: parseInt(text) },
                  });
                }}
                defaultValue={user.attribute.minSize?.toString() ?? "0"}
              />
              <Text className="font-light text-white"> m²</Text>
            </View>
            <View className="flex min-w-[100px] flex-row items-center justify-center rounded-full bg-[#10316B] px-2 py-0.5">
              <Text className="font-light text-white">Max: </Text>
              <TextInput
                // @ts-ignore
                inputMode="numeric"
                placeholder="0"
                className="font-light text-white"
                placeholderTextColor={"white"}
                onChangeText={(text) => {
                  if (!user.attribute || !text) return;
                  setUser({
                    ...user,
                    attribute: { ...user.attribute, maxSize: parseInt(text) },
                  });
                }}
                defaultValue={user.attribute.maxSize?.toString() ?? "0"}
              />
              <Text className="font-light text-white"> m²</Text>
            </View>
          </View>
        </View>
      </View>
      <Text className="text-base font-bold text-[#10316B]">Attributes:</Text>
      <View className="flex flex-row flex-wrap items-center justify-center">
        <TouchableOpacity
          onPress={() => {
            if (!user.attribute) return;
            setUser({
              ...user,
              attribute: {
                ...user.attribute,
                furnished: !user.attribute.furnished ?? true,
              },
            });
          }}
        >
          <AttributeBtn
            name="Furnished"
            status={user.attribute.furnished}
            iconName="king-bed"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!user.attribute) return;
            setUser({
              ...user,
              attribute: {
                ...user.attribute,
                terrace: !user.attribute.terrace ?? true,
              },
            });
          }}
        >
          <AttributeBtn
            name="Terrace"
            status={user.attribute.terrace}
            iconName="deck"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!user.attribute) return;
            setUser({
              ...user,
              attribute: {
                ...user.attribute,
                pets: !user.attribute.pets ?? true,
              },
            });
          }}
        >
          <AttributeBtn
            name="Pets"
            status={user.attribute.pets}
            iconName="pets"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!user.attribute) return;
            setUser({
              ...user,
              attribute: {
                ...user.attribute,
                smoker: !user.attribute.smoker ?? true,
              },
            });
          }}
        >
          <AttributeBtn
            name="Smoker"
            status={user.attribute.smoker}
            iconName="smoking-rooms"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!user.attribute) return;
            setUser({
              ...user,
              attribute: {
                ...user.attribute,
                disability: !user.attribute.disability ?? true,
              },
            });
          }}
        >
          <AttributeBtn
            name="Disability"
            status={user.attribute.disability}
            iconName="accessible"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!user.attribute) return;
            setUser({
              ...user,
              attribute: {
                ...user.attribute,
                garden: !user.attribute.garden ?? true,
              },
            });
          }}
        >
          <AttributeBtn
            name="Garden"
            status={user.attribute.garden}
            iconName="local-florist"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!user.attribute) return;
            setUser({
              ...user,
              attribute: {
                ...user.attribute,
                parking: !user.attribute.parking ?? true,
              },
            });
          }}
        >
          <AttributeBtn
            name="Parking"
            status={user.attribute.parking}
            iconName="local-parking"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!user.attribute) return;
            setUser({
              ...user,
              attribute: {
                ...user.attribute,
                elevator: !user.attribute.elevator ?? true,
              },
            });
          }}
        >
          <AttributeBtn
            name="Elevator"
            status={user.attribute.elevator}
            iconName="elevator"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!user.attribute) return;
            setUser({
              ...user,
              attribute: {
                ...user.attribute,
                pool: !user.attribute.pool ?? true,
              },
            });
          }}
        >
          <AttributeBtn
            name="Pool"
            status={user.attribute.pool}
            iconName="pool"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
