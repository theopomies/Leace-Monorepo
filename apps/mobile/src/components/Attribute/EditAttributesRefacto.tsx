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
  disabled?: boolean
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

function HouseTypeBtn({ name, iconName, disabled }: IAttributeBtn) {
  return (
    <View
      className="flex min-w-[150px] min-h-[50px] flex-row items-center justify-center space-x-1 rounded-lg px-2 py-1"
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
      textAlignVertical: 'center',
      height: 50,
      width: '100%',
      borderWidth: 1,
      borderRadius: 5,
    },
    small_input: {
      paddingLeft: 10,
      textAlignVertical: 'center',
      height: 40,
      width: '100%',
    }
  });

  function displayField(v: string) {

  }

  return (
    <View className="flex mx-5">
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
          className="text-lg font-light w-full h-full mb-9"
          style={styles.input}
          multiline={true}
          placeholder="Paris"
          defaultValue={attrs.location ?? ""}
          onChangeText={(text) => setAttrs({ ...attrs, location: text })}
        />
      </View>
      {!onBoarding && (<Divider width={1.5} color="black" className="mb-6"></Divider>)}

      <Text className="text-xl font-bold text-[#111827]">Type:</Text>


        <View className="flex flex-row justify-center mb-6">

          <TouchableOpacity
            disabled={attrs.homeType == "HOUSE"}
            onPress={() => {
              if (attrs.homeType == "APARTMENT" || !attrs.homeType)
                setAttrs({ ...attrs, homeType: "HOUSE" })
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
                setAttrs({ ...attrs, homeType: "APARTMENT" })
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
      < View className="flex flex-row space-x-4 justify-center items-center px-2 w-full h-16 mb-10">
        <View className="flex flex-col items-start align-middle w-1/2 h-16 rounded-xl">
          <Text className="text-base font-bold text-black">
            Rent start
          </Text>

          <TouchableOpacity onPress={() => setOpen(true)} className="w-[95%]">
            <View className="w-full border-[1px] border-black rounded-lg pl-2 py-1.5">
              <Text className="text-lg font-base text-black leading-loose focus:border-blue-500">
                {attrs.rentStartDate?.toLocaleDateString() ??
                  new Date().toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        < View className="flex flex-col items-start w-1/2 h-16 rounded-xl">
          <Text className="text-base font-bold text-black ml-1">
            Rent end
          </Text>
          <TouchableOpacity onPress={() => setOpen1(true)} className="w-[100%] ml-1">
            <View className="w-full border-[1px] border-black rounded-lg pl-2 py-1.5">

              <Text className="text-lg font-base text-black leading-loose focus:border-blue-500">
                {attrs.rentEndDate?.toLocaleDateString() ??
                  new Date().toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>



      <View>

        <Text className="text-start  text-xl font-bold">
          Price range:
        </Text>
        < View className="flex flex-row space-x-8 items-center w-full h-16 mb-8">
          <View className="flex flex-col items-start w-[45%] h-16 rounded-xl py-1">
            <Text className="text-center text-base font-bold text-black align-center">
              Minimum (€)
            </Text>

            <View className="flex flex-row justify-start w-full h-10 border rounded-md">
              <View className="w-full h-10">
                <TextInput
                  inputMode="numeric"
                  placeholder="0"
                  className="font-light text-black w-full"
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
          < View className="flex flex-col items-start w-[45%] h-16 rounded-xl py-1">

            <Text className="text-center text-base font-bold text-black">
              Maximum (€)
            </Text>
            <View className="flex flex-row justify-start w-full h-10 border rounded-md">
              <View className="w-full h-10">
                <TextInput
                  inputMode="numeric"
                  placeholder="0"
                  className="font-light text-black w-full"
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
        <Text className="text-start mb-2 text-xl font-bold">
          Size range:
        </Text>
        < View className="flex flex-row space-x-8 items-center w-full h-16">
          <View className="flex flex-col items-start w-[45%] h-16 rounded-xl py-1">
            <Text className="text-center text-base font-bold text-black align-center">
              Minimum (m²)
            </Text>
            <View className="flex flex-row justify-start w-full h-10 border rounded-md">
              <View className="w-full h-10">
                <TextInput
                  inputMode="numeric"
                  placeholder="0"
                  className="font-light text-black w-full"
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
          < View className="flex flex-col items-start w-[45%] h-16 rounded-xl py-1">

            <Text className="text-center text-base font-bold text-black">
              Maximum (m²)
            </Text>
            <View className="flex flex-row justify-start w-full h-10 border rounded-md">
              <View className="w-full h-10">
                <TextInput
                  inputMode="numeric"
                  placeholder="0"
                  className="font-light text-black w-full"
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




      <View className="pt-9 pb-4">
        <Text className="text-xl font-bold text-black mb-3">Attributes:</Text>
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
