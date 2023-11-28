import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import { Icon } from "react-native-elements";
//import { IUserAttrs } from "../../types";

interface IAttributeBtn {
  name: string;
  status?: boolean;
  iconName: string;
}

interface ICreateUserAttrs {
  userId: string;
  attrs: any | undefined;
  setAttrs: React.Dispatch<React.SetStateAction<any | undefined>>;
}

function AttributeBtn({ name, status, iconName }: IAttributeBtn) {
  return (
    <View
      className="flex min-w-[150px] min-h-[50px] flex-row items-center justify-center space-x-1 rounded-lg px-2 py-1"
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

export default function EditAttributesRefacto({
  userId,
  attrs,
  setAttrs,
}: ICreateUserAttrs) {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  if (!attrs) return null;
  return (
    <View className="flex space-y-4">
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

      < View className="flex flex-row items-center px-6 space-x-2 w-full h-16 bg-[#F1F5F9] rounded-xl shadow shadow-md shadow-gray-400 ">
        <Icon className="h-fit w-fit p-1 flex items-center justify-center rounded-full"
          name={"location-on"}
          color={"#111827"}
          size={40}
          type="material-icons"
        ></Icon>
        <TextInput
          className="text-lg font-light pb-2 mb-2"
          placeholder="Paris"
          defaultValue={attrs.location ?? ""}
          style={{ borderBlockColor: "black", borderBottomWidth: 1 }}
          onChangeText={(text) => setAttrs({ ...attrs, location: text })}
        />
      </View>


      {/* ICI */}
      < View className="flex flex-row items-center px-6 space-x-2 w-full h-16 bg-[#F1F5F9] rounded-xl shadow shadow-md shadow-gray-400 ">
        <Text className="text-xl font-bold text-[#111827]">Type:</Text>
        <View>
          <RNPickerSelect
            placeholder={{}}
            onValueChange={(itemValue) =>
              setAttrs({ ...attrs, homeType: itemValue })
            }
            items={[
              { label: "HOUSE", value: "HOUSE" },
              { label: "APARTMENT", value: "APARTMENT" },
            ]}
          />
        </View>
      </View>
      <View>

        <Text className="text-start mx-7 mb-2 text-xl font-bold text-[#111827]">
          Rent dates:
        </Text>
        < View className="flex flex-row space-x-4 justify-center items-center px-6 w-full h-16">
          <View className="flex flex-col items-center w-1/2 h-16 bg-[#6C47FF] rounded-xl py-1">
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Text className="text-center text-base font-bold text-white">
                Rent start
              </Text>
              <Text className="text-center text-lg font-base text-white leading-loose focus:border-blue-500">
                {attrs.rentStartDate?.toLocaleDateString() ??
                  new Date().toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
          < View className="flex flex-col items-center w-1/2 h-16 bg-[#6C47FF] rounded-xl py-1">
            <TouchableOpacity onPress={() => setOpen1(true)}>
              <Text className="text-center text-base font-bold text-white">
                Rent end
              </Text>
              <Text className="text-center text-lg font-base text-white leading-loose focus:border-blue-500">
                {attrs.rentEndDate?.toLocaleDateString() ??
                  new Date().toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>


      <View>

        <Text className="text-start mx-7 mb-2 text-xl font-bold text-[#111827]">
          Price range:
        </Text>
        < View className="flex flex-row space-x-4 justify-center items-center px-6 w-full h-16">
          <View className="flex flex-col items-center w-1/2 h-16 bg-[#6C47FF] rounded-xl py-1">

            <Text className="text-center text-base font-bold text-white">
              Minimum
            </Text>
            <View className="flex flex-row justify-center w-full h-10">
              <View className="w-1/4 h-10 ">
                <TextInput
                  inputMode="numeric"
                  placeholder="0"
                  className="font-light text-white"
                  placeholderTextColor={"white"}
                  style={{ borderColor: "black", borderBottomWidth: 1, fontSize: 18 }}
                  onChangeText={(text) => {
                    setAttrs({ ...attrs, minPrice: parseInt(text) ?? 0 });
                  }}
                  defaultValue={attrs.minPrice?.toString() ?? ""}
                />
              </View>
              <Text className="font-light text-white"> €</Text>
            </View>
          </View>
          < View className="flex flex-col items-center w-1/2 h-16 bg-[#6C47FF] rounded-xl py-1">

            <Text className="text-center text-base font-bold text-white">
              Maximum
            </Text>
            <View className="flex flex-row justify-center w-full h-10">
              <View className="w-1/4 h-10 ">
                <TextInput
                  // @ts-ignore
                  inputMode="numeric"
                  placeholder="0"
                  className="font-light text-white"
                  placeholderTextColor={"white"}
                  style={{ borderColor: "black", borderBottomWidth: 1, fontSize: 18 }}
                  onChangeText={(text) => {
                    setAttrs({ ...attrs, maxPrice: parseInt(text) });
                  }}
                  defaultValue={attrs.maxPrice?.toString() ?? ""}
                />
              </View>
              <Text className="font-light text-white"> €</Text>
            </View>
          </View>
        </View>
      </View>


      <View>

        <Text className="text-start mx-7 mb-2 text-xl font-bold text-[#111827]">
          Size range:
        </Text>
        < View className="flex flex-row space-x-4 justify-center items-center px-6 w-full h-16">
          <View className="flex flex-col items-center w-1/2 h-16 bg-[#6C47FF] rounded-xl py-1">

            <Text className="text-center text-base font-bold text-white">
              Minimum
            </Text>
            <View className="flex flex-row justify-center w-full h-10">
              <View className="w-1/4 h-10 ">
                <TextInput
                  inputMode="numeric"
                  placeholder="0"
                  className="font-light text-white"
                  placeholderTextColor={"white"}
                  style={{ borderColor: "black", borderBottomWidth: 1, fontSize: 18 }}
                  onChangeText={(text) => {
                    setAttrs({ ...attrs, minSize: parseInt(text) });
                  }}
                  defaultValue={attrs.minSize?.toString() ?? ""}
                />
              </View>
              <Text className="font-light text-white"> m²</Text>
            </View>
          </View>
          < View className="flex flex-col items-center w-1/2 h-16 bg-[#6C47FF] rounded-xl py-1">

            <Text className="text-center text-base font-bold text-white">
              Maximum
            </Text>
            <View className="flex flex-row justify-center w-full h-10">
              <View className="w-1/4 h-10 ">

                <TextInput
                  // @ts-ignore
                  inputMode="numeric"
                  placeholder="0"
                  className="font-light text-white"
                  placeholderTextColor={"white"}
                  style={{ borderColor: "black", borderBottomWidth: 1, fontSize: 18 }}
                  onChangeText={(text) => {
                    setAttrs({ ...attrs, maxSize: parseInt(text) });
                  }}
                  defaultValue={attrs.maxSize?.toString() ?? ""}
                />
              </View>
              <Text className="font-light text-white"> m²</Text>
            </View>
          </View>
        </View>
      </View>




      <View>
        <Text className="text-base font-bold text-[#10316B]">Attributes:</Text>
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
    </View >
  );
}
