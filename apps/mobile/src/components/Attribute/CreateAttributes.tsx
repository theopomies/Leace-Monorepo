import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { IDefaulAttributes } from "../../types";
import { Icon } from "react-native-elements";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

interface ICreateAttributes {
  attrs: IDefaulAttributes;
  setAttrs: React.Dispatch<React.SetStateAction<IDefaulAttributes | undefined>>;
}
interface IAttributeBtn {
  name: string;
  status: boolean | undefined;
  iconName: string;
}

function AttributeBtn({ name, status, iconName }: IAttributeBtn) {
  return (
    <View
      className="flex min-w-[100px] flex-row items-center justify-center space-x-1 rounded-full px-2 py-1"
      style={{
        margin: 2,
        backgroundColor: `rgba(16, 49, 107, ${status ? "1" : "0.25"})`,
      }}
    >
      <Icon name={iconName} color={"white"} size={20} type="material-icons" />
      <Text className="font-light text-white" style={{ opacity: 1 }}>
        {name}
      </Text>
    </View>
  );
}

export default function CreateAttributes({
  attrs,
  setAttrs,
}: ICreateAttributes) {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [reason, setReason] = useState<"HOUSE" | "APPARTMENT">("HOUSE");

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    setOpen(false);
    setAttrs({ ...attrs, rentStartDate: date });
  };

  const onChange1 = (event: DateTimePickerEvent, date?: Date) => {
    setOpen1(false);
    setAttrs({ ...attrs, rentEndDate: date });
  };

  return (
    <View className="flex space-y-2">
      {open && (
        <DateTimePicker
          testID="dateTimePicker"
          value={attrs.rentStartDate || new Date()}
          mode={"date"}
          onChange={onChange}
        />
      )}

      {open1 && (
        <DateTimePicker
          testID="dateTimePicker"
          value={attrs.rentEndDate || new Date()}
          mode={"date"}
          onChange={onChange1}
        />
      )}
      <View>
        <Text className="text-base font-bold text-[#10316B]">Type</Text>
        <Picker
          selectedValue={reason}
          onValueChange={(itemValue) => {
            setReason(itemValue);
            if (itemValue === "HOUSE")
              setAttrs({ ...attrs, house: true, appartment: false });
            else setAttrs({ ...attrs, house: false, appartment: true });
          }}
        >
          <Picker.Item label="HOUSE" value={"HOUSE"} />
          <Picker.Item label="APPARTMENT" value={"APPARTMENT"} />
        </Picker>
      </View>
      <View>
        <Text className="text-base font-bold text-[#10316B]">Location</Text>
        <TextInput
          className="border-b border-[#D3D3D3] py-1.5 font-light leading-loose focus:border-blue-500"
          placeholder="Paris"
          defaultValue={attrs.location}
          onChangeText={(text) => setAttrs({ ...attrs, location: text })}
        ></TextInput>
      </View>
      <View className="flex flex-row justify-around">
        <View className="min-w-[80px]">
          <Text className="text-center text-base font-bold text-[#10316B]">
            Rent start
          </Text>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text className="py-1.5 text-center font-light leading-loose focus:border-blue-500">
              {attrs.rentStartDate?.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="min-w-[80px]">
          <Text className="text-center text-base font-bold text-[#10316B]">
            Rent end
          </Text>
          <TouchableOpacity onPress={() => setOpen1(true)}>
            <Text className="py-1.5 text-center font-light leading-loose focus:border-blue-500">
              {attrs.rentEndDate?.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row justify-around">
        <View className="min-w-[80px]">
          <Text className="text-center text-base font-bold text-[#10316B]">
            Price
          </Text>
          <TextInput
            className="border-b border-[#D3D3D3] py-1.5 text-center font-light leading-loose focus:border-blue-500"
            // @ts-ignore
            inputMode="numeric"
            placeholder="0 €"
            onChangeText={(text) =>
              setAttrs({ ...attrs, price: parseInt(text) })
            }
          />
        </View>
        <View className="min-w-[80px]">
          <Text className="text-center text-base font-bold text-[#10316B]">
            Size
          </Text>
          <TextInput
            className="border-b border-[#D3D3D3] py-1.5 text-center font-light leading-loose focus:border-blue-500"
            // @ts-ignore
            inputMode="numeric"
            placeholder="0 m²"
            onChangeText={(text) =>
              setAttrs({ ...attrs, size: parseInt(text) })
            }
          />
        </View>
      </View>
      <Text className="text-base font-bold text-[#10316B]">Attributes</Text>
      <View className="flex flex-row flex-wrap items-center justify-center">
        <TouchableOpacity
          onPress={() => setAttrs({ ...attrs, furnished: !attrs.furnished })}
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
          <AttributeBtn name="Terrace" status={attrs.terrace} iconName="deck" />
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
          onPress={() => setAttrs({ ...attrs, disability: !attrs.disability })}
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
          onPress={() => setAttrs({ ...attrs, elevator: !attrs.elevator })}
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
      </View>
    </View>
  );
}
