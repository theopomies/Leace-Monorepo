import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Button, Icon } from "react-native-elements";
import { trpc } from "../../utils/trpc";

interface IUserProfile {
  id: string;
  role: string;
  email: string;
  emailVerified: null;
  image: string;
  firstName: string;
  lastName: string;
  phoneNumber: null;
  country: null;
  description: string;
  birthDate: string;
  status: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  attribute: {
    id: string;
    userId: string;
    postId: null;
    location: string;
    lat: null;
    lng: null;
    maxPrice: number;
    minPrice: number;
    maxSize: number;
    minSize: number;
    range: number;
    price: null;
    size: null;
    rentStartDate: null;
    rentEndDate: null;
    furnished: boolean;
    homeType: null;
    terrace: boolean;
    pets: boolean;
    smoker: boolean;
    disability: boolean;
    garden: boolean;
    parking: boolean;
    elevator: boolean;
    pool: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export default function UserProfile({
  user,
  setUser,
  edit,
  userId,
}: {
  user: IUserProfile;
  setUser: React.Dispatch<any>;
  edit: boolean;
  userId: string;
}) {
  const BLUE = "#428AF8";
  const LIGHT_GRAY = "#D3D3D3";

  const defFocus = {
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    birthday: false,
    country: false,
    description: false,
    minPrice: false,
    maxPrice: false,
    minSize: false,
    maxSize: false,
  };

  const [focus, setFocus] = useState(defFocus);

  useEffect(() => {
    setFocus(defFocus);
  }, [edit]);

  return (
    <View className="flex flex-1 px-2.5">
      <View className="flex h-24 flex-row">
        <View className="w-24 items-center justify-center">
          <Image
            className="rounded-full"
            source={{ uri: user.image }}
            style={{ width: "75%", height: "75%" }}
          ></Image>
        </View>
        <View className="flex flex-1 items-center justify-center px-1.5">
          {edit ? (
            <View className="flex w-full flex-col">
              <TextInput
                className="h-10"
                placeholder="First Name"
                defaultValue={user.firstName ?? ""}
                onFocus={() => setFocus({ ...defFocus, firstName: true })}
                onChangeText={(text) => {
                  setUser({ ...user, firstName: text });
                }}
                style={{
                  borderBottomColor: focus.firstName ? BLUE : LIGHT_GRAY,
                  borderBottomWidth: 1,
                }}
              />
              <TextInput
                className="h-10"
                placeholder="Last Name"
                defaultValue={user.lastName ?? ""}
                onFocus={() => setFocus({ ...defFocus, lastName: true })}
                onChangeText={(text) => {
                  setUser({ ...user, lastName: text });
                }}
                style={{
                  borderBottomColor: focus.lastName ? BLUE : LIGHT_GRAY,
                  borderBottomWidth: 1,
                }}
              />
            </View>
          ) : (
            <Text className="text-lg font-bold text-[#002642]">{`${
              user.firstName ?? ""
            } ${user.lastName ?? ""}`}</Text>
          )}
        </View>
      </View>
      <View className="flex space-y-3">
        <View className="flex flex-col">
          <Text className="text-md min-w-[60px] font-bold text-[#002642]">
            Email
          </Text>
          {edit ? (
            <View className="flex">
              <TextInput
                defaultValue={`${user.email}`}
                className="flex h-10 flex-1"
                onFocus={() => setFocus({ ...defFocus, email: true })}
                onChangeText={(text) => {
                  setUser({ ...user, email: text });
                }}
                style={{
                  borderBottomColor: focus.email ? BLUE : LIGHT_GRAY,
                  borderBottomWidth: 1,
                }}
              />
            </View>
          ) : (
            <Text className=" ">{user.email}</Text>
          )}
        </View>
        <View className="flex flex-col">
          <Text className="text-md min-w-[60px] font-bold text-[#002642]">
            Phone
          </Text>
          {edit ? (
            <View className="flex">
              <TextInput
                inputMode="tel"
                // placeholder="0765164821"
                defaultValue={user.phoneNumber ?? ""}
                className="flex h-10 flex-1"
                onFocus={() => setFocus({ ...defFocus, phone: true })}
                onChangeText={(text) => {
                  setUser({ ...user, phoneNumber: text });
                }}
                style={{
                  borderBottomColor: focus.phone ? BLUE : LIGHT_GRAY,
                  borderBottomWidth: 1,
                }}
              />
            </View>
          ) : (
            <Text className="">{user.phoneNumber ?? "-"}</Text>
          )}
        </View>
        <View className="flex flex-col">
          <Text className="text-md min-w-[60px] font-bold text-[#002642]">
            Birthday
          </Text>
          {edit ? (
            <View className="flex">
              <TextInput
                placeholder="YYYY-MM-DD"
                defaultValue={user.birthDate ?? ""}
                className="flex h-10 flex-1"
                onFocus={() => setFocus({ ...defFocus, birthday: true })}
                onChangeText={(text) => {
                  const pattern = /^\d{4}-\d{2}-\d{2}$/;
                  if (pattern.test(text)) setUser({ ...user, birthDate: text });
                }}
                style={{
                  borderBottomColor: focus.birthday ? BLUE : LIGHT_GRAY,
                  borderBottomWidth: 1,
                }}
              />
            </View>
          ) : (
            <Text className="">{user.birthDate ?? "-"}</Text>
          )}
        </View>
        <View>
          <Text className="text-md min-w-[60px] font-bold text-[#002642]">
            Description
          </Text>
          {edit ? (
            <View className="flex">
              <TextInput
                multiline
                numberOfLines={16}
                defaultValue={user.description ?? ""}
                onChangeText={(text) => {
                  setUser({ ...user, description: text });
                }}
                className="flex h-10 flex-1"
                onFocus={() => setFocus({ ...defFocus, description: true })}
                style={{
                  borderBottomColor: focus.description ? BLUE : LIGHT_GRAY,
                  borderBottomWidth: 1,
                }}
              />
            </View>
          ) : (
            <Text className="">{user.description ?? "-"}</Text>
          )}
        </View>
        <View className="">
          <Text className="text-md min-w-[60px] font-bold text-[#002642]">
            Criterials
          </Text>
          <View className="flex flex-row flex-wrap items-center justify-center gap-1 pt-2">
            {edit ? (
              <>
                <TouchableOpacity
                  className="rounded-md border px-2 py-0.5"
                  style={{
                    borderColor: user.attribute?.terrace ? BLUE : LIGHT_GRAY,
                  }}
                  onPress={() => {
                    let tmp = user?.attribute;
                    if (!tmp?.terrace) tmp = { ...tmp, terrace: true };
                    else tmp.terrace = !tmp.terrace;
                    setUser({ ...user, attribute: tmp });
                  }}
                >
                  <Text className="">Terrace</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-md border px-2 py-0.5"
                  style={{
                    borderColor: user.attribute?.smoker ? BLUE : LIGHT_GRAY,
                  }}
                  onPress={() => {
                    let tmp = user?.attribute;
                    if (!tmp?.smoker) tmp = { ...tmp, smoker: true };
                    else tmp.smoker = !tmp.smoker;
                    setUser({ ...user, attribute: tmp });
                  }}
                >
                  <Text className="">Smoker</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-md border px-2 py-0.5"
                  style={{
                    borderColor: user.attribute?.elevator ? BLUE : LIGHT_GRAY,
                  }}
                  onPress={() => {
                    let tmp = user?.attribute;
                    if (!tmp?.elevator) tmp = { ...tmp, elevator: true };
                    else tmp.elevator = !tmp.elevator;
                    setUser({ ...user, attribute: tmp });
                  }}
                >
                  <Text className="">Elevator</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-md border px-2 py-0.5"
                  style={{
                    borderColor: user.attribute?.pets ? BLUE : LIGHT_GRAY,
                  }}
                  onPress={() => {
                    let tmp = user?.attribute;
                    if (!tmp?.pets) tmp = { ...tmp, pets: true };
                    else tmp.pets = !tmp.pets;
                    setUser({ ...user, attribute: tmp });
                  }}
                >
                  <Text className="">Pets</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-md border px-2 py-0.5"
                  style={{
                    borderColor: user.attribute?.pool ? BLUE : LIGHT_GRAY,
                  }}
                  onPress={() => {
                    let tmp = user?.attribute;
                    if (!tmp?.pool) tmp = { ...tmp, pool: true };
                    else tmp.pool = !tmp.pool;
                    setUser({ ...user, attribute: tmp });
                  }}
                >
                  <Text className="">Pool</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-md border px-2 py-0.5"
                  style={{
                    borderColor: user.attribute?.disability ? BLUE : LIGHT_GRAY,
                  }}
                  onPress={() => {
                    let tmp = user?.attribute;
                    if (!tmp?.disability) tmp = { ...tmp, disability: true };
                    else tmp.disability = !tmp.disability;
                    setUser({ ...user, attribute: tmp });
                  }}
                >
                  <Text className="">Accessible</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-md border px-2 py-0.5"
                  style={{
                    borderColor: user.attribute?.parking ? BLUE : LIGHT_GRAY,
                  }}
                  onPress={() => {
                    let tmp = user?.attribute;
                    if (!tmp?.parking) tmp = { ...tmp, parking: true };
                    else tmp.parking = !tmp.parking;
                    setUser({ ...user, attribute: tmp });
                  }}
                >
                  <Text className="">Garage</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-md border px-2 py-0.5"
                  style={{
                    borderColor: user.attribute?.garden ? BLUE : LIGHT_GRAY,
                  }}
                  onPress={() => {
                    let tmp = user?.attribute;
                    if (!tmp?.garden) tmp = { ...tmp, garden: true };
                    else tmp.garden = !tmp.garden;
                    setUser({ ...user, attribute: tmp });
                  }}
                >
                  <Text className="">Garden</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {user.attribute?.terrace ? (
                  <Text className="rounded-md border px-2 py-0.5">Terrace</Text>
                ) : null}
                {user.attribute?.smoker ? (
                  <Text className="rounded-md border px-2 py-0.5">Smoker</Text>
                ) : null}
                {user.attribute?.elevator ? (
                  <Text className="rounded-md border px-2 py-0.5">
                    Elevator
                  </Text>
                ) : null}
                {user.attribute?.pets ? (
                  <Text className="rounded-md border px-2 py-0.5">Pets</Text>
                ) : null}
                {user.attribute?.pool ? (
                  <Text className="rounded-md border px-2 py-0.5">Pool</Text>
                ) : null}
                {user.attribute?.disability ? (
                  <Text className="rounded-md border px-2 py-0.5">
                    Accessible
                  </Text>
                ) : null}
                {user.attribute?.parking ? (
                  <Text className="rounded-md border px-2 py-0.5">Garage</Text>
                ) : null}
                {user.attribute?.garden ? (
                  <Text className="rounded-md border px-2 py-0.5">Garden</Text>
                ) : null}
              </>
            )}
          </View>
        </View>
        <View>
          <Text className="text-md min-w-[60px] font-bold text-[#002642]">
            Budget
          </Text>
          <View className="flex flex-row">
            <View className="flex-1 items-center justify-center">
              {edit ? (
                <View className="flex flex-row items-center justify-center">
                  <Text>Min: </Text>
                  <TextInput
                    inputMode="numeric"
                    placeholder="0"
                    defaultValue={`${user.attribute?.minPrice ?? ""}`}
                    className="h-10 text-center"
                    onFocus={() => setFocus({ ...defFocus, minPrice: true })}
                    style={{
                      borderBottomColor: focus.minPrice ? BLUE : LIGHT_GRAY,
                      borderBottomWidth: 1,
                    }}
                    onChangeText={(text) => {
                      if (!text) return;
                      let tmp = user?.attribute;
                      tmp = { ...tmp, minPrice: parseInt(text) };
                      setUser({ ...user, attribute: tmp });
                    }}
                  />
                </View>
              ) : (
                <Text className=" ">
                  Min: {user.attribute?.minPrice ?? "-"}
                </Text>
              )}
            </View>
            <View className="flex-1 items-center justify-center">
              {edit ? (
                <View className="flex flex-row items-center justify-center">
                  <Text>Max: </Text>
                  <TextInput
                    inputMode="numeric"
                    placeholder="1000"
                    defaultValue={`${user.attribute?.maxPrice ?? ""}`}
                    className="h-10 text-center"
                    onFocus={() => setFocus({ ...defFocus, maxPrice: true })}
                    style={{
                      borderBottomColor: focus.maxPrice ? BLUE : LIGHT_GRAY,
                      borderBottomWidth: 1,
                    }}
                    onChangeText={(text) => {
                      if (!text) return;
                      let tmp = user?.attribute;
                      tmp = { ...tmp, maxPrice: parseInt(text) };
                      setUser({ ...user, attribute: tmp });
                    }}
                  />
                </View>
              ) : (
                <Text className=" ">
                  Max: {user.attribute?.maxPrice ?? "-"}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View>
          <Text className="text-md min-w-[60px] font-bold text-[#002642]">
            Size
          </Text>
          <View className="flex flex-row">
            <View className="flex-1 items-center justify-center">
              {edit ? (
                <View className="flex flex-row items-center justify-center">
                  <Text>Min: </Text>
                  <TextInput
                    inputMode="numeric"
                    onChangeText={(text) => {
                      if (!text) return;
                      let tmp = user?.attribute;
                      tmp = { ...tmp, minSize: parseInt(text) };
                      setUser({ ...user, attribute: tmp });
                    }}
                    placeholder="0"
                    defaultValue={`${user.attribute?.minSize ?? ""}`}
                    className="h-10 text-center"
                    onFocus={() => setFocus({ ...defFocus, minSize: true })}
                    style={{
                      borderBottomColor: focus.minSize ? BLUE : LIGHT_GRAY,
                      borderBottomWidth: 1,
                    }}
                  />
                </View>
              ) : (
                <Text className=" ">Min: {user.attribute?.minSize ?? "-"}</Text>
              )}
            </View>
            <View className="flex-1 items-center justify-center">
              {edit ? (
                <View className="flex flex-row items-center justify-center">
                  <Text>Max: </Text>
                  <TextInput
                    inputMode="numeric"
                    onChangeText={(text) => {
                      if (!text) return;
                      let tmp = user?.attribute;
                      tmp = { ...tmp, maxSize: parseInt(text) };
                      setUser({ ...user, attribute: tmp });
                    }}
                    placeholder="100"
                    defaultValue={`${user.attribute?.maxSize ?? ""}`}
                    className="h-10 text-center"
                    onFocus={() => setFocus({ ...defFocus, maxSize: true })}
                    style={{
                      borderBottomColor: focus.maxSize ? BLUE : LIGHT_GRAY,
                      borderBottomWidth: 1,
                    }}
                  />
                </View>
              ) : (
                <Text className=" ">Max: {user.attribute?.maxSize ?? "-"}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
