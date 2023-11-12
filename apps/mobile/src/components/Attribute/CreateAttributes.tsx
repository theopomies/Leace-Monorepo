import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import { IDefaulAttributes } from "../../types";

interface ICreateAttributes {
  attrs: IDefaulAttributes | undefined;
  setAttrs: React.Dispatch<React.SetStateAction<IDefaulAttributes | undefined>>;
  locationError: string;
  priceError: string;
  sizeError: string;
  securityAlarm: boolean;
  internetFiber: boolean;
  setLocationError: (error: string) => void;
  setPriceError: (error: string) => void;
  setSizeError: (error: string) => void;
  setSecurityAlarm: (error: string) => void;
  setInternetFiber: (error: string) => void;
}
interface IAttributeBtn {
  name: string;
  status: boolean | undefined;
  iconName: string;
}

function AttributeBtn({ name, status, iconName }: IAttributeBtn) {
  return (
    <View
      style={{
        margin: Platform.OS === "android" ? 2 : 3,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          backgroundColor: status ? "#6466f1" : "#c7d2fe",
          borderRadius: 5,
        }}
      >
        <Icon name={iconName} color={"white"} size={20} type="material-icons" />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 13,
            opacity: 1,
            color: "white",
          }}
        >
          {name}
        </Text>
      </View>
    </View>
  );
}

export default function CreateAttributes({
  attrs,
  setAttrs,
  locationError,
  priceError,
  sizeError,
  securityAlarm,
  internetFiber,
  setLocationError,
  setPriceError,
  setSizeError,
  setSecurityAlarm,
  setInternetFiber,
}: ICreateAttributes) {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [reason, setReason] = useState<"HOUSE" | "APARTMENT">("HOUSE");

  if (!attrs) return null;

  function handlePicker(itemValue: "HOUSE" | "APARTMENT") {
    if (!attrs) return;
    setReason(itemValue);
    setAttrs({ ...attrs, homeType: itemValue });
  }

  return (
    <View className={`flex space-y-${Platform.OS === "android" ? 20 : 10}`}>
      <View>
        <Text className="text-sm font-semibold	 text-slate-500">Location</Text>
        <TextInput
          style={{ borderColor: locationError ? "#D84654" : "black" }}
          className={`rounded-xl border p-${
            Platform.OS === "ios" ? 4 : 2
          } font-light leading-loose focus:border-indigo-500`}
          placeholder="Paris"
          defaultValue={attrs.location}
          onChangeText={(text) => {
            setAttrs({ ...attrs, location: text });
            setLocationError("");
          }}
        ></TextInput>
        {locationError ? (
          <Text className="text-xs text-[#D84654]">{locationError}</Text>
        ) : null}
      </View>
      <View>
        <View
          style={{
            alignItems: "center",
            marginBottom: 10,
            marginTop: 10,
            justifyContent: "center",
          }}
        >
          <Text className="text-base font-bold text-slate-500">Home Type</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: Platform.OS === "android" ? 10 : 50,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: reason === "HOUSE" ? "#6466f1" : "#c7d2fe",
              padding: 10,
              marginRight: 10,
              borderRadius: 5,
            }}
            onPress={() => {
              handlePicker("HOUSE");
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 13,
                color: "white",
              }}
            >
              HOUSE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: reason === "APARTMENT" ? "#6466f1" : "#c7d2fe",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={() => {
              handlePicker("APARTMENT");
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 13,
                color: "white",
              }}
            >
              APARTMENT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text className="text-base font-bold text-slate-500">Criteria</Text>
        </View>
        <View className="flex flex-row flex-wrap items-center justify-center">
          <View
            style={{
              marginBottom: Platform.OS === "android" ? 5 : 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setAttrs({ ...attrs, furnished: !attrs.furnished })
                }
              >
                <AttributeBtn
                  name="Furnished"
                  status={attrs.furnished}
                  iconName="king-bed"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAttrs({ ...attrs, terrace: !attrs.terrace })}
              >
                <AttributeBtn
                  name="Terrace"
                  status={attrs.terrace}
                  iconName="deck"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAttrs({ ...attrs, pets: !attrs.pets })}
              >
                <AttributeBtn name="Pets" status={attrs.pets} iconName="pets" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAttrs({ ...attrs, smoker: !attrs.smoker })}
              >
                <AttributeBtn
                  name="Smoker"
                  status={attrs.smoker}
                  iconName="smoking-rooms"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setAttrs({ ...attrs, disability: !attrs.disability })
                }
              >
                <AttributeBtn
                  name="Disability"
                  status={attrs.disability}
                  iconName="accessible"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAttrs({ ...attrs, garden: !attrs.garden })}
              >
                <AttributeBtn
                  name="Garden"
                  status={attrs.garden}
                  iconName="local-florist"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAttrs({ ...attrs, parking: !attrs.parking })}
              >
                <AttributeBtn
                  name="Parking"
                  status={attrs.parking}
                  iconName="local-parking"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setAttrs({ ...attrs, elevator: !attrs.elevator })
                }
              >
                <AttributeBtn
                  name="Elevator"
                  status={attrs.elevator}
                  iconName="elevator"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAttrs({ ...attrs, pool: !attrs.pool })}
              >
                <AttributeBtn name="Pool" status={attrs.pool} iconName="poll" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <AttributeBtn
                  name="Security alarm"
                  status={attrs.elevator}
                  iconName="security"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <AttributeBtn
                  name="Internet fiber"
                  status={attrs.elevator}
                  iconName="wifi"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-row justify-around">
            <View className="w-36">
              <Text className="text-sm font-semibold text-[#666666]">
                Price
              </Text>
              <TextInput
                style={{
                  height: 40,
                  borderColor: priceError ? "#D84654" : "black",
                }}
                className={`rounded-xl border p-${
                  Platform.OS === "android" ? 2 : 2
                } font-light leading-loose focus:border-[#6466f1]`} // @ts-ignore
                inputMode="numeric"
                placeholder="0 €"
                onChangeText={(text) => {
                  setAttrs({ ...attrs, price: parseInt(text) });
                  setPriceError("");
                }}
              />
              {priceError ? (
                <Text className="text-xs text-[#D84654]">{priceError}</Text>
              ) : null}
            </View>
            <View className="w-36">
              <Text className="text-sm font-semibold text-[#666666]">Size</Text>
              <TextInput
                style={{
                  height: 40,
                  borderColor: sizeError ? "#D84654" : "black",
                }}
                className={`rounded-xl border p-${
                  Platform.OS === "android" ? 2 : 2
                } font-light leading-loose focus:border-[#6466f1]`}
                // @ts-ignore
                inputMode="numeric"
                placeholder="0 m²"
                onChangeText={(text) => {
                  setAttrs({ ...attrs, size: parseInt(text) });
                  setSizeError("");
                }}
              />
              {sizeError ? (
                <Text className="text-xs text-[#D84654]">{sizeError}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
