import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
} from "react-native";
import React from "react";
import { Icon } from "react-native-elements";
import { IDefaultAttributes } from "../../types";

interface ICreateAttributes {
  attrs: IDefaultAttributes | undefined;
  setAttrs: React.Dispatch<
    React.SetStateAction<IDefaultAttributes | undefined>
  >;
  locationError: string;
  priceError: string;
  sizeError: string;
  bedroomsError: string;
  bathroomsError: string;
  setLocationError: (error: string) => void;
  setPriceError: (error: string) => void;
  setSizeError: (error: string) => void;
  setBedroomsError: (error: string) => void;
  setBathroomsError: (error: string) => void;
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
          backgroundColor: status ? "#6466f1" : "#c7d2fe",
          padding: 9,
          borderRadius: 5,
          width: 150,
          height: 38,
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

export default function CreateAttributes({
  attrs,
  setAttrs,
  locationError,
  priceError,
  sizeError,
  bedroomsError,
  bathroomsError,
  setLocationError,
  setPriceError,
  setSizeError,
  setBedroomsError,
  setBathroomsError,
}: ICreateAttributes) {
  if (!attrs) return null;
  return (
    <KeyboardAvoidingView behavior="position">
      <View className={`flex space-y-${Platform.OS === "android" ? 20 : 10}`}>
        <View>
          <Text className="mb-1 text-lg font-semibold	 text-slate-500">
            Location
          </Text>
          <TextInput
            style={{
              padding: 4,
              borderRadius: 5,
              width: "100%",
              height: 38,
            }}
            className={`rounded-md border p-2 font-light leading-loose focus:border-indigo-500`}
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
              marginTop: 30,
              justifyContent: "center",
            }}
          >
            <Text className="text-base font-bold text-slate-500">
              Home Type
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: Platform.OS === "android" ? 10 : 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor:
                  attrs.homeType === "HOUSE" ? "#6466f1" : "#c7d2fe",
                padding: 10,
                marginRight: 10,
                width: 150,
                height: 38,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setAttrs((a) => ({ ...a, homeType: "HOUSE" }));
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
                backgroundColor:
                  attrs.homeType === "APARTMENT" ? "#6466f1" : "#c7d2fe",
                padding: 10,
                borderRadius: 5,
                width: 150,
                height: 38,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setAttrs((a) => ({ ...a, homeType: "APARTMENT" }));
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
                flexDirection: "column",
                marginBottom: 30,

                justifyContent: "space-between",
              }}
            >
              <View
                className=""
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{ margin: 2 }}
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
                  style={{ margin: 2 }}
                  onPress={() =>
                    setAttrs({ ...attrs, terrace: !attrs.terrace })
                  }
                >
                  <AttributeBtn
                    name="Terrace"
                    status={attrs.terrace}
                    iconName="deck"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{ margin: 2 }}
                  onPress={() => setAttrs({ ...attrs, pets: !attrs.pets })}
                >
                  <AttributeBtn
                    name="Pets"
                    status={attrs.pets}
                    iconName="pets"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ margin: 2 }}
                  onPress={() => setAttrs({ ...attrs, smoker: !attrs.smoker })}
                >
                  <AttributeBtn
                    name="Smoker"
                    status={attrs.smoker}
                    iconName="smoking-rooms"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{ margin: 2 }}
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
                  style={{ margin: 2 }}
                  onPress={() => setAttrs({ ...attrs, garden: !attrs.garden })}
                >
                  <AttributeBtn
                    name="Garden"
                    status={attrs.garden}
                    iconName="local-florist"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{ margin: 2 }}
                  onPress={() =>
                    setAttrs({ ...attrs, parking: !attrs.parking })
                  }
                >
                  <AttributeBtn
                    name="Parking"
                    status={attrs.parking}
                    iconName="local-parking"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ margin: 2 }}
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
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{ margin: 2 }}
                  onPress={() => setAttrs({ ...attrs, pool: !attrs.pool })}
                >
                  <AttributeBtn
                    name="Pool"
                    status={attrs.pool}
                    iconName="poll"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ margin: 2 }}
                  onPress={() =>
                    setAttrs({ ...attrs, securityAlarm: !attrs.securityAlarm })
                  }
                >
                  <AttributeBtn
                    name="Security alarm"
                    status={attrs.securityAlarm}
                    iconName="security"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{ margin: 2 }}
                  onPress={() =>
                    setAttrs({ ...attrs, internetFiber: !attrs.internetFiber })
                  }
                >
                  <AttributeBtn
                    name="Internet fiber"
                    status={attrs.internetFiber}
                    iconName="wifi"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                marginBottom: 50,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: Platform.OS === "android" ? 0 : 50,
                }}
              >
                <View style={{ width: 150, marginRight: 10 }}>
                  <Text
                    style={{
                      marginBottom: 1,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#666666",
                    }}
                  >
                    Price
                  </Text>
                  <TextInput
                    style={{
                      width: 150,
                      height: 38,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: Platform.OS === "android" ? 2 : 2,
                      fontSize: 16,
                    }}
                    inputMode="numeric"
                    defaultValue={String(attrs.price)}
                    onChangeText={(text) => {
                      const parsedValue =
                        text.trim() !== "" ? parseInt(text) : 0;
                      setAttrs({ ...attrs, price: parsedValue });
                      setPriceError("");
                    }}
                  />
                  {priceError ? (
                    <Text style={{ fontSize: 12, color: "#D84654" }}>
                      {priceError}
                    </Text>
                  ) : null}
                </View>
                <View style={{ width: 150 }}>
                  <Text
                    style={{
                      marginBottom: 1,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#666666",
                    }}
                  >
                    Size
                  </Text>
                  <TextInput
                    style={{
                      width: 150,
                      height: 38,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: Platform.OS === "android" ? 2 : 2,
                      fontSize: 16,
                    }}
                    inputMode="numeric"
                    placeholder="0"
                    defaultValue={String(attrs.size)}
                    onChangeText={(text) => {
                      const parsedValue =
                        text.trim() !== "" ? parseInt(text) : 0;
                      setAttrs({ ...attrs, size: parsedValue });
                      setSizeError("");
                    }}
                  />
                  {sizeError ? (
                    <Text style={{ fontSize: 12, color: "#D84654" }}>
                      {sizeError}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={{ width: 150, marginRight: 10 }}>
                  <Text
                    style={{
                      marginBottom: 1,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#666666",
                    }}
                  >
                    Bedroom(s)
                  </Text>
                  <TextInput
                    style={{
                      width: 150,
                      height: 38,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: Platform.OS === "android" ? 2 : 2,
                      fontSize: 16,
                    }}
                    inputMode="numeric"
                    defaultValue={String(attrs.bedrooms)}
                    onChangeText={(text) => {
                      const parsedValue =
                        text.trim() !== "" ? parseInt(text) : 0;
                      setAttrs({ ...attrs, bedrooms: parsedValue });
                      setBedroomsError("");
                    }}
                  />
                  {bedroomsError ? (
                    <Text style={{ fontSize: 12, color: "#D84654" }}>
                      {bedroomsError}
                    </Text>
                  ) : null}
                </View>
                <View style={{ width: 150 }}>
                  <Text
                    style={{
                      marginBottom: 1,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#666666",
                    }}
                  >
                    Bathroom(s)
                  </Text>
                  <TextInput
                    style={{
                      width: 150,
                      height: 38,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: Platform.OS === "android" ? 2 : 2,
                      fontSize: 16,
                    }}
                    inputMode="numeric"
                    defaultValue={String(attrs.bathrooms)}
                    onChangeText={(text) => {
                      const parsedValue =
                        text.trim() !== "" ? parseInt(text) : 0;
                      setAttrs({ ...attrs, bathrooms: parsedValue });
                      setBathroomsError("");
                    }}
                  />
                  {bathroomsError ? (
                    <Text style={{ fontSize: 12, color: "#D84654" }}>
                      {bathroomsError}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
