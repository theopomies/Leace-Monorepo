import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import { IUserAttrs } from "../../types";

interface IAttributeBtn {
  name: string;
  status?: boolean;
  iconName: string;
}

interface ICreateUserAttrs {
  userId: string;
  attrs: IUserAttrs | undefined;
  setAttrs: React.Dispatch<React.SetStateAction<IUserAttrs | undefined>>;
}

function AttributeBtn({ name, status, iconName }: IAttributeBtn) {
  return (
    <View
      className="flex min-w-[100px] flex-row items-center justify-center space-x-1 rounded-full px-2 py-1"
      style={{
        margin: 2,
        backgroundColor: "#0A2472",
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

export default function EditAttributes({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId,
  attrs,
  setAttrs,
}: ICreateUserAttrs) {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  if (!attrs) return null;
  return (
    <View className="flex space-y-1">
      <View>
        <DateTimePickerModal
          isVisible={open}
          mode="date"
          date={attrs.rentStartDate ?? new Date()}
          onConfirm={(date) => {
            setOpen(false);
            setAttrs({ ...attrs, rentStartDate: date });
          }}
          onCancel={() => setOpen(false)}
        />
        <DateTimePickerModal
          isVisible={open1}
          mode="date"
          date={attrs.rentEndDate ?? new Date()}
          onConfirm={(date) => {
            setOpen1(false);
            setAttrs({ ...attrs, rentEndDate: date });
          }}
          onCancel={() => setOpen1(false)}
        />
      </View>
      <View className="flex flex-row items-center justify-between">
        <Text className="text-base font-bold text-[#394867]">Location:</Text>
        <TextInput
          className="font-light"
          placeholder="Paris"
          defaultValue={attrs.location ?? ""}
          onChangeText={(text) => setAttrs({ ...attrs, location: text })}
        />
      </View>
      <View>
        <Text className="text-base font-bold text-[#394867]">Type:</Text>
        {/*<RNPickerSelect
          placeholder={{}}
          onValueChange={(itemValue) =>
            setAttrs({ ...attrs, homeType: itemValue })
          }
          items={[
            { label: "HOUSE", value: "HOUSE" },
            { label: "APARTMENT", value: "APARTMENT" },
          ]}
        />*/}
      </View>
      <View className="flex flex-row justify-around">
        <View className="min-w-[80px]">
          <Text className="text-center text-base font-bold text-[#0A2472]">
            Rent start
          </Text>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text className="py-1.5 text-center font-light leading-loose focus:border-blue-500">
              {attrs.rentStartDate?.toLocaleDateString() ??
                new Date().toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="min-w-[80px]">
          <Text className="text-center text-base font-bold text-[#0A2472]">
            Rent end
          </Text>
          <TouchableOpacity onPress={() => setOpen1(true)}>
            <Text className="py-1.5 text-center font-light leading-loose focus:border-blue-500">
              {attrs.rentEndDate?.toLocaleDateString() ??
                new Date().toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="">
        <Text className="text-base font-bold text-[#0A2472]">Budget:</Text>
        <View className="flex flex-row justify-evenly">
          <View className="flex min-w-[100px] flex-row items-center justify-center rounded-full bg-[#0A2472] px-2 py-0.5">
            <Text className="font-light text-white">Min: </Text>
            <TextInput
              inputMode="numeric"
              placeholder="0"
              className="font-light text-white"
              placeholderTextColor={"white"}
              onChangeText={(text) => {
                setAttrs({ ...attrs, minPrice: parseInt(text) });
              }}
              defaultValue={attrs.minPrice?.toString() ?? ""}
            />
            <Text className="font-light text-white"> €</Text>
          </View>
          <View className="flex min-w-[100px] flex-row items-center justify-center rounded-full bg-[#0A2472] px-2 py-0.5">
            <Text className="font-light text-white">Max: </Text>
            <TextInput
              inputMode="numeric"
              placeholder="0"
              className="font-light text-white"
              placeholderTextColor={"white"}
              onChangeText={(text) => {
                setAttrs({ ...attrs, maxPrice: parseInt(text) });
              }}
              defaultValue={attrs.maxPrice?.toString() ?? ""}
            />
            <Text className="font-light text-white"> €</Text>
          </View>
        </View>
      </View>
      <View className="">
        <Text className="text-base font-bold text-[#0A2472]">Size:</Text>
        <View className="flex flex-row justify-evenly">
          <View className="flex min-w-[100px] flex-row items-center justify-center rounded-full bg-[#0A2472] px-2 py-0.5">
            <Text className="font-light text-white">Min: </Text>
            <TextInput
              inputMode="numeric"
              placeholder="0"
              className="font-light text-white"
              placeholderTextColor={"white"}
              onChangeText={(text) => {
                setAttrs({ ...attrs, minSize: parseInt(text) });
              }}
              defaultValue={attrs.minSize?.toString() ?? ""}
            />
            <Text className="font-light text-white"> m²</Text>
          </View>
          <View className="flex min-w-[100px] flex-row items-center justify-center rounded-full bg-[#0A2472] px-2 py-0.5">
            <Text className="font-light text-white">Max: </Text>
            <TextInput
              inputMode="numeric"
              placeholder="0"
              className="font-light text-white"
              placeholderTextColor={"white"}
              onChangeText={(text) => {
                setAttrs({ ...attrs, maxSize: parseInt(text) });
              }}
              defaultValue={attrs.maxSize?.toString() ?? ""}
            />
            <Text className="font-light text-white"> m²</Text>
          </View>
        </View>
      </View>
      <View>
        <Text className="text-base font-bold text-[#0A2472]">Attributes:</Text>
        <View className="flex flex-row flex-wrap items-center justify-center">
          <TouchableOpacity
            onPress={() => {
              setAttrs({ ...attrs, furnished: !attrs.furnished ?? true });
            }}
          >
            <AttributeBtn
              name="Furnished"
              status={attrs.furnished}
              iconName="king-bed"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAttrs({ ...attrs, terrace: !attrs.terrace ?? true });
            }}
          >
            <AttributeBtn
              name="Terrace"
              status={attrs.terrace}
              iconName="deck"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAttrs({ ...attrs, pets: !attrs.pets ?? true });
            }}
          >
            <AttributeBtn name="Pets" status={attrs.pets} iconName="pets" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAttrs({ ...attrs, smoker: !attrs.smoker ?? true });
            }}
          >
            <AttributeBtn
              name="Smoker"
              status={attrs.smoker}
              iconName="smoking-rooms"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAttrs({ ...attrs, disability: !attrs.disability ?? true });
            }}
          >
            <AttributeBtn
              name="Disability"
              status={attrs.disability}
              iconName="accessible"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAttrs({ ...attrs, garden: !attrs.garden ?? true });
            }}
          >
            <AttributeBtn
              name="Garden"
              status={attrs.garden}
              iconName="local-florist"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAttrs({ ...attrs, parking: !attrs.parking ?? true });
            }}
          >
            <AttributeBtn
              name="Parking"
              status={attrs.parking}
              iconName="local-parking"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAttrs({ ...attrs, elevator: !attrs.elevator ?? true });
            }}
          >
            <AttributeBtn
              name="Elevator"
              status={attrs.elevator}
              iconName="elevator"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAttrs({ ...attrs, pool: !attrs.pool ?? true });
            }}
          >
            <AttributeBtn name="Pool" status={attrs.pool} iconName="pool" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
