import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import { Divider, Icon } from "react-native-elements";
import { StyleSheet } from "react-native";
//import { IUserAttrs } from "../../types";

interface IAttributeBtn {
  name: string;
  status?: boolean;
  iconName: string;
  disabled?: boolean;
}

interface ICreateUserAttrs {
  userId: string;
  attrs: any | undefined;
  setAttrs: React.Dispatch<React.SetStateAction<any | undefined>>;
  onBoarding?: boolean;
}

function AttributeBtn({ name, status, iconName }: IAttributeBtn) {
  return (
    <View
      className="flex min-h-[50px] min-w-[150px] flex-row items-center justify-center space-x-1 rounded-lg px-2 py-1"
      style={{
        margin: 6,
        backgroundColor: "#6C47FF",
        opacity: status ? 1 : 0.5,
      }}
    >
      <Icon
        name={iconName}
        color={"white"}
        size={25}
        type="material-icons"
      ></Icon>
      <Text className="text-lg font-light text-white">{name}</Text>
    </View>
  );
}

function HouseTypeBtn({ name, iconName, disabled }: IAttributeBtn) {
  return (
    <View
      className="flex min-h-[50px] min-w-[150px] flex-row items-center justify-center space-x-1 rounded-lg px-2 py-1"
      style={{
        margin: 6,
        backgroundColor: !disabled ? "gray" : "#6C47FF",
        opacity: disabled ? 1 : 0.5,
      }}
    >
      <Icon
        name={iconName}
        color={"white"}
        size={25}
        type="material-icons"
      ></Icon>
      <Text className="text-lg font-light text-white">{name}</Text>
    </View>
  );
}

export default function EditAttributesRefacto({
  userId,
  attrs,
  setAttrs,
  onBoarding,
}: ICreateUserAttrs) {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  if (!attrs) return null;

  const styles = StyleSheet.create({
    input: {
      paddingLeft: 10,
      textAlignVertical: "center",
      height: 50,
      width: "100%",
      borderWidth: 1,
      borderRadius: 5,
    },
    small_input: {
      paddingLeft: 10,
      textAlignVertical: "center",
      height: 40,
      width: "100%",
    },
  });

  function displayField(v: string) {}

  return (
    <View className="mx-5 flex">
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
      <Text className="text-xl font-bold text-[#111827]">Location:</Text>
      <View>
        <TextInput
          className="mb-9 h-full w-full text-lg font-light"
          style={styles.input}
          multiline={true}
          placeholder="Paris"
          defaultValue={attrs.location ?? ""}
          onChangeText={(text) => setAttrs({ ...attrs, location: text })}
        />
      </View>
      {!onBoarding && (
        <Divider width={1.5} color="black" className="mb-6"></Divider>
      )}

      <Text className="text-xl font-bold text-[#111827]">Type:</Text>

      <View className="mb-6 flex flex-row justify-center">
        <TouchableOpacity
          disabled={attrs.homeType == "HOUSE"}
          onPress={() => {
            if (attrs.homeType == "APARTMENT" || !attrs.homeType)
              setAttrs({ ...attrs, homeType: "HOUSE" });
          }}
        >
          <HouseTypeBtn
            name="House"
            iconName="house"
            disabled={attrs.homeType == "HOUSE"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={attrs.homeType == "APARTMENT"}
          onPress={() => {
            if (attrs.homeType == "HOUSE" || !attrs.homeType)
              setAttrs({ ...attrs, homeType: "APARTMENT" });
          }}
        >
          <HouseTypeBtn
            name="Appartment"
            iconName="apartment"
            disabled={attrs.homeType == "APARTMENT"}
          />
        </TouchableOpacity>
      </View>

      <Text className="text-start text-xl font-bold text-[#111827]">
        Rent dates:
      </Text>
      <View className="mb-10 flex h-16 w-full flex-row items-center justify-center space-x-4 px-2">
        <View className="flex h-16 w-1/2 flex-col items-start rounded-xl align-middle">
          <Text className="text-base font-bold text-black">Rent start</Text>

          <TouchableOpacity onPress={() => setOpen(true)} className="w-[95%]">
            <View className="w-full rounded-lg border-[1px] border-black py-1.5 pl-2">
              <Text className="font-base text-lg leading-loose text-black focus:border-blue-500">
                {attrs.rentStartDate?.toLocaleDateString() ??
                  new Date().toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex h-16 w-1/2 flex-col items-start rounded-xl">
          <Text className="ml-1 text-base font-bold text-black">Rent end</Text>
          <TouchableOpacity
            onPress={() => setOpen1(true)}
            className="ml-1 w-[100%]"
          >
            <View className="w-full rounded-lg border-[1px] border-black py-1.5 pl-2">
              <Text className="font-base text-lg leading-loose text-black focus:border-blue-500">
                {attrs.rentEndDate?.toLocaleDateString() ??
                  new Date().toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text className="text-start  text-xl font-bold">Price range:</Text>
        <View className="mb-8 flex h-16 w-full flex-row items-center space-x-8">
          <View className="flex h-16 w-[45%] flex-col items-start rounded-xl py-1">
            <Text className="align-center text-center text-base font-bold text-black">
              Minimum (€)
            </Text>

            <View className="flex h-10 w-full flex-row justify-start rounded-md border">
              <View className="h-10 w-full">
                <TextInput
                  inputMode="numeric"
                  placeholder="0"
                  className="w-full font-light text-black"
                  placeholderTextColor={"black"}
                  style={styles.small_input}
                  onChangeText={(text) => {
                    setAttrs({ ...attrs, minPrice: parseInt(text) ?? 0 });
                  }}
                  defaultValue={attrs.minPrice ?? ""}
                />
              </View>
              {/* <Text className="font-light text-black"> €</Text> */}
            </View>
          </View>
          <View className="flex h-16 w-[45%] flex-col items-start rounded-xl py-1">
            <Text className="text-center text-base font-bold text-black">
              Maximum (€)
            </Text>
            <View className="flex h-10 w-full flex-row justify-start rounded-md border">
              <View className="h-10 w-full">
                <TextInput
                  inputMode="numeric"
                  placeholder="0"
                  className="w-full font-light text-black"
                  placeholderTextColor={"black"}
                  style={styles.small_input}
                  onChangeText={(text) => {
                    setAttrs({ ...attrs, maxPrice: parseInt(text) ?? 0 });
                  }}
                  defaultValue={attrs.maxPrice ?? ""}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="pt-2">
        <Text className="mb-2 text-start text-xl font-bold">Size range:</Text>
        <View className="flex h-16 w-full flex-row items-center space-x-8">
          <View className="flex h-16 w-[45%] flex-col items-start rounded-xl py-1">
            <Text className="align-center text-center text-base font-bold text-black">
              Minimum (m²)
            </Text>
            <View className="flex h-10 w-full flex-row justify-start rounded-md border">
              <View className="h-10 w-full">
                <TextInput
                  inputMode="numeric"
                  placeholder="0"
                  className="w-full font-light text-black"
                  placeholderTextColor={"black"}
                  style={styles.small_input}
                  onChangeText={(text) => {
                    setAttrs({ ...attrs, minSize: parseInt(text) ?? 0 });
                  }}
                  defaultValue={attrs.minSize ?? ""}
                />
              </View>
            </View>
          </View>
          <View className="flex h-16 w-[45%] flex-col items-start rounded-xl py-1">
            <Text className="text-center text-base font-bold text-black">
              Maximum (m²)
            </Text>
            <View className="flex h-10 w-full flex-row justify-start rounded-md border">
              <View className="h-10 w-full">
                <TextInput
                  inputMode="numeric"
                  placeholder="0"
                  className="w-full font-light text-black"
                  placeholderTextColor={"black"}
                  style={styles.small_input}
                  onChangeText={(text) => {
                    setAttrs({ ...attrs, maxSize: parseInt(text) ?? 0 });
                  }}
                  defaultValue={attrs.maxSize ?? ""}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="pb-4 pt-9">
        <Text className="mb-3 text-xl font-bold text-black">Attributes:</Text>
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
