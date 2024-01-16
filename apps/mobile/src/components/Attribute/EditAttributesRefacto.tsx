import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Divider, Icon } from "react-native-elements";
import { IUserAttrs } from "../../types";

interface IAttributeBtn {
  name: string;
  status?: boolean;
  iconName: string;
  disabled?: boolean;
}

interface ICreateUserAttrs {
  userId: string;
  attrs: IUserAttrs | undefined;
  setAttrs: React.Dispatch<React.SetStateAction<IUserAttrs | undefined>>;
  onBoarding?: boolean;
  showErrorCallback?: boolean;
  showMinPriceErrorCallback?: boolean;
  showMaxPriceErrorCallback?: boolean;
  showMinSizeErrorCallback?: boolean;
  showMaxSizeErrorCallback?: boolean;
  showPriceErrorCallback?: boolean;
  showSizeErrorCallback?: boolean;
  showRentDateErrorCallback?: boolean;

  showMinBedErrorCallback?: boolean;
  showMaxBedErrorCallback?: boolean;
  showMinBathErrorCallback?: boolean;
  showMaxBathErrorCallback?: boolean;

  showBedErrorCallback?: boolean;
  showBathErrorCallback?: boolean;
}

function HouseTypeBtn({ name, iconName, disabled }: IAttributeBtn) {
  return (
    <View
      style={{
        margin: Platform.OS === "android" ? 2 : 3,
      }}
    >
      <View
        className="flex h-[38px] w-[150px] flex-row items-center justify-center rounded-md"
        style={{
          backgroundColor: disabled ? "#6466f1" : "#c7d2fe",
        }}
      >
        <Icon name={iconName} color={"white"} size={20} type="material-icons" />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 13,
            opacity: 1,
            color: "white",
            marginLeft: 10,
          }}
        >
          {name}
        </Text>
      </View>
    </View>
  );
}

export default function EditAttributesRefacto({
  attrs,
  setAttrs,
  onBoarding,
  showErrorCallback,
  showMinPriceErrorCallback,
  showMaxPriceErrorCallback,
  showMinSizeErrorCallback,
  showMaxSizeErrorCallback,
  showPriceErrorCallback,
  showSizeErrorCallback,
  showRentDateErrorCallback,

  showMinBedErrorCallback,
  showMaxBedErrorCallback,
  showMinBathErrorCallback,
  showMaxBathErrorCallback,
  showBedErrorCallback,
  showBathErrorCallback,
}: ICreateUserAttrs) {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  if (!attrs) return null;

  return (
    <>
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
      <View className={`flex space-y-4 ${onBoarding ? "" : "mx-5"}`}>
        <View className="flex flex-col space-y-1">
          <Text className="font-bold">Location</Text>
          <View className="relative">
            <TextInput
              className="border-indigo h-10 rounded-lg border pl-2"
              placeholder="Paris"
              defaultValue={attrs.location ?? ""}
              onChangeText={(text) => setAttrs({ ...attrs, location: text })}
            />
            {!attrs.location && showErrorCallback && (
              <Text
                className="text-light-red absolute -bottom-3"
                style={{ fontSize: 10 }}
              >
                Please select a valid location
              </Text>
            )}
          </View>
        </View>
        <View className="flex flex-col space-y-1">
          <Text className="font-bold">Type</Text>
          <View className="flex flex-row justify-between">
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
                name="Apartment"
                iconName="apartment"
                disabled={attrs.homeType == "APARTMENT"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row justify-between">
          <View className="flex min-w-[150px] flex-col space-y-1">
            <Text className="font-bold">Rent start</Text>
            <View className="relative">
              <TouchableOpacity onPress={() => setOpen(true)}>
                <TextInput
                  className="border-indigo h-10 rounded-lg border pl-2 text-black"
                  editable={false}
                >
                  {attrs.rentStartDate?.toLocaleDateString() ??
                    new Date().toLocaleDateString()}
                </TextInput>
              </TouchableOpacity>
              {showRentDateErrorCallback && (
                <Text
                  className="absolute -bottom-3 text-red-500"
                  style={{ fontSize: 10 }}
                >
                  Invalid rent dates
                </Text>
              )}
            </View>
          </View>
          <View className="flex min-w-[150px] flex-col space-y-1">
            <Text className="font-bold">Rent end</Text>
            <View className="relative">
              <TouchableOpacity onPress={() => setOpen1(true)}>
                <TextInput
                  className="border-indigo h-10 rounded-lg border pl-2 text-black"
                  editable={false}
                >
                  {attrs.rentEndDate?.toLocaleDateString() ??
                    new Date().toLocaleDateString()}
                </TextInput>
              </TouchableOpacity>
              {showRentDateErrorCallback && (
                <Text
                  className="absolute -bottom-3 text-red-500"
                  style={{ fontSize: 10 }}
                >
                  {"Invalid rent dates"}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View className="flex flex-row justify-between">
          <View className="flex min-w-[150px] flex-col space-y-1">
            <Text className="font-bold">Minimum (€)</Text>
            <View className="relative">
              <TextInput
                className="border-indigo h-10 rounded-lg border pl-2 text-black"
                inputMode="numeric"
                placeholder="0"
                onChangeText={(text) => {
                  setAttrs({ ...attrs, minPrice: parseInt(text) ?? 0 });
                }}
                defaultValue={attrs.minPrice ? attrs.minPrice.toString() : ""}
              ></TextInput>

              {isNaN(attrs.minPrice as number) && showMinPriceErrorCallback && (
                <Text
                  className="absolute -bottom-3 text-red-500"
                  style={{ fontSize: 10 }}
                >
                  {"Min price is required"}
                </Text>
              )}
            </View>
          </View>
          <View className="flex min-w-[150px] flex-col space-y-1">
            <Text className="font-bold">Maximum (€)</Text>
            <View className="relative">
              <TextInput
                className="border-indigo h-10 rounded-lg border pl-2 text-black"
                inputMode="numeric"
                placeholder="0"
                onChangeText={(text) => {
                  setAttrs({ ...attrs, maxPrice: parseInt(text) ?? 0 });
                }}
                defaultValue={attrs.maxPrice ? attrs.maxPrice.toString() : ""}
              ></TextInput>
              {isNaN(attrs.maxPrice as number) && showMaxPriceErrorCallback && (
                <Text
                  className="absolute -bottom-3 text-red-500"
                  style={{ fontSize: 10 }}
                >
                  {"Max price is required"}
                </Text>
              )}
            </View>
          </View>
          {showPriceErrorCallback && (
            <Text
              className="absolute -bottom-3 text-red-500"
              style={{ fontSize: 10 }}
            >
              {"Min price can't be higher than max price"}
            </Text>
          )}
        </View>

        <View className="flex flex-row justify-between">
          <View className="flex min-w-[150px] flex-col space-y-1">
            <Text className="font-bold">Minimum (m²)</Text>
            <View className="relative">
              <TextInput
                className="border-indigo h-10 rounded-lg border pl-2 text-black"
                inputMode="numeric"
                placeholder="0"
                onChangeText={(text) => {
                  setAttrs({ ...attrs, minSize: parseInt(text) ?? 0 });
                }}
                defaultValue={attrs.minSize ? attrs.minSize.toString() : ""}
              ></TextInput>
              {isNaN(attrs.minSize as number) && showMinSizeErrorCallback && (
                <Text
                  className="absolute -bottom-3 text-red-500"
                  style={{ fontSize: 10 }}
                >
                  {"Min size is required"}
                </Text>
              )}
            </View>
          </View>
          <View className="flex min-w-[150px] flex-col space-y-1">
            <Text className="font-bold">Maximum (m²)</Text>
            <View className="relative">
              <TextInput
                className="border-indigo h-10 rounded-lg border pl-2 text-black"
                inputMode="numeric"
                placeholder="0"
                onChangeText={(text) => {
                  setAttrs({ ...attrs, maxSize: parseInt(text) ?? 0 });
                }}
                defaultValue={attrs.maxSize ? attrs.maxSize.toString() : ""}
              ></TextInput>
              {isNaN(attrs.maxSize as number) && showMaxSizeErrorCallback && (
                <Text
                  className="absolute -bottom-3 text-red-500"
                  style={{ fontSize: 10 }}
                >
                  {"Max size is required"}
                </Text>
              )}
            </View>
          </View>
          {showSizeErrorCallback && (
            <Text
              className="absolute -bottom-3 text-red-500"
              style={{ fontSize: 10 }}
            >
              {"Min size can't be higher than max size"}
            </Text>
          )}
        </View>

        <View className="flex flex-row justify-between">
          <View className="flex min-w-[150px] flex-col space-y-1">
            <Text className="font-bold">Min bedrooms</Text>
            <View className="relative">
              <TextInput
                className="border-indigo h-10 rounded-lg border pl-2 text-black"
                inputMode="numeric"
                placeholder="0"
                onChangeText={(text) => {
                  setAttrs({ ...attrs, minBedrooms: parseInt(text) ?? 0 });
                }}
                defaultValue={
                  attrs.minBedrooms ? attrs.minBedrooms.toString() : ""
                }
              ></TextInput>
              {isNaN(attrs.minBedrooms as number) &&
                showMinBedErrorCallback && (
                  <Text
                    className="absolute -bottom-3 text-red-500"
                    style={{ fontSize: 10 }}
                  >
                    {"Min bedrooms is required"}
                  </Text>
                )}
            </View>
          </View>
          <View className="flex min-w-[150px] flex-col space-y-1">
            <Text className="font-bold">Max bedrooms</Text>
            <View className="relative">
              <TextInput
                className="border-indigo h-10 rounded-lg border pl-2 text-black"
                inputMode="numeric"
                placeholder="0"
                onChangeText={(text) => {
                  setAttrs({ ...attrs, maxBedrooms: parseInt(text) ?? 0 });
                }}
                defaultValue={
                  attrs.maxBedrooms ? attrs.maxBedrooms.toString() : ""
                }
              ></TextInput>
              {isNaN(attrs.maxBedrooms as number) &&
                showMaxBedErrorCallback && (
                  <Text
                    className="absolute -bottom-3 text-red-500"
                    style={{ fontSize: 10 }}
                  >
                    {"Max bedrooms is required"}
                  </Text>
                )}
            </View>
          </View>
          {showBedErrorCallback && (
            <Text
              className="absolute -bottom-3 text-red-500"
              style={{ fontSize: 10 }}
            >
              {"Min bedrooms can't be higher than max bedroooms"}
            </Text>
          )}
        </View>

        <View className="flex flex-row justify-between">
          <View className="flex min-w-[150px] flex-col space-y-1">
            <Text className="font-bold">Min bathrooms</Text>
            <View className="relative">
              <TextInput
                className="border-indigo h-10 rounded-lg border pl-2 text-black"
                inputMode="numeric"
                placeholder="0"
                onChangeText={(text) => {
                  setAttrs({ ...attrs, minBathrooms: parseInt(text) ?? 0 });
                }}
                defaultValue={
                  attrs.minBathrooms ? attrs.minBathrooms.toString() : ""
                }
              ></TextInput>
              {isNaN(attrs.minBathrooms as number) &&
                showMinBathErrorCallback && (
                  <Text
                    className="absolute -bottom-3 text-red-500"
                    style={{ fontSize: 10 }}
                  >
                    {"Min bathrooms is required"}
                  </Text>
                )}
            </View>
          </View>
          <View className="flex min-w-[150px] flex-col space-y-1">
            <Text className="font-bold">Max bathrooms</Text>
            <View className="relative">
              <TextInput
                className="border-indigo h-10 rounded-lg border pl-2 text-black"
                inputMode="numeric"
                placeholder="0"
                onChangeText={(text) => {
                  setAttrs({ ...attrs, maxBathrooms: parseInt(text) ?? 0 });
                }}
                defaultValue={
                  attrs.maxBathrooms ? attrs.maxBathrooms.toString() : ""
                }
              ></TextInput>
              {isNaN(attrs.maxBathrooms as number) &&
                showMaxBathErrorCallback && (
                  <Text
                    className="absolute -bottom-3 text-red-500"
                    style={{ fontSize: 10 }}
                  >
                    {"Max bathrooms is required"}
                  </Text>
                )}
            </View>
          </View>
          {showBathErrorCallback && (
            <Text
              className="absolute -bottom-3 text-red-500"
              style={{ fontSize: 10 }}
            >
              {"Min bathrooms can't be higher than max bathrooms"}
            </Text>
          )}
        </View>

        <View className="">
          <Text className="font-bold">Attributes</Text>
          <View className="flex flex-row flex-wrap justify-center gap-2">
            <TouchableOpacity
              onPress={() => {
                setAttrs({ ...attrs, furnished: !attrs.furnished ?? true });
              }}
            >
              <HouseTypeBtn
                name="Furnished"
                disabled={attrs.furnished}
                iconName="king-bed"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAttrs({ ...attrs, terrace: !attrs.terrace ?? true });
              }}
            >
              <HouseTypeBtn
                name="Terrace"
                disabled={attrs.terrace}
                iconName="deck"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAttrs({ ...attrs, pets: !attrs.pets ?? true });
              }}
            >
              <HouseTypeBtn name="Pets" disabled={attrs.pets} iconName="pets" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAttrs({ ...attrs, smoker: !attrs.smoker ?? true });
              }}
            >
              <HouseTypeBtn
                name="Smoker"
                disabled={attrs.smoker}
                iconName="smoking-rooms"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAttrs({ ...attrs, disability: !attrs.disability ?? true });
              }}
            >
              <HouseTypeBtn
                name="Disability"
                disabled={attrs.disability}
                iconName="accessible"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAttrs({ ...attrs, garden: !attrs.garden ?? true });
              }}
            >
              <HouseTypeBtn
                name="Garden"
                disabled={attrs.garden}
                iconName="local-florist"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAttrs({ ...attrs, parking: !attrs.parking ?? true });
              }}
            >
              <HouseTypeBtn
                name="Parking"
                disabled={attrs.parking}
                iconName="local-parking"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAttrs({ ...attrs, elevator: !attrs.elevator ?? true });
              }}
            >
              <HouseTypeBtn
                name="Elevator"
                disabled={attrs.elevator}
                iconName="elevator"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAttrs({ ...attrs, pool: !attrs.pool ?? true });
              }}
            >
              <HouseTypeBtn name="Pool" disabled={attrs.pool} iconName="pool" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setAttrs({
                  ...attrs,
                  securityAlarm: !attrs.securityAlarm ?? true,
                });
              }}
            >
              <HouseTypeBtn
                name="Security Alarm"
                disabled={attrs.securityAlarm}
                iconName="security"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAttrs({
                  ...attrs,
                  internetFiber: !attrs.internetFiber ?? true,
                });
              }}
            >
              <HouseTypeBtn
                name="Internet fiber"
                disabled={attrs.internetFiber}
                iconName="wifi"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
