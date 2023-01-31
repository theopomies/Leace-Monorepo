import { useState } from "react";
import { ScrollView, TextInput, View, Text } from "react-native";
import { Button, CheckBox } from "react-native-elements";
import { DatePickerIOS } from 'react-native'
import { RouteProp, useNavigation } from '@react-navigation/native';

import { trpc } from "../../utils/trpc";

import { RouterInputs } from '../../../../web/src/utils/trpc';
import { TabStackParamList } from "../../navigation/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const CreatePostAttributesScreen = ({ route }: { route: RouteProp<TabStackParamList, "CreatePostAttributes"> }) => {

    const params = route.params;

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    const attributes = trpc.attribute.updatePostAtt.useMutation()

    const [data, setData] = useState<RouterInputs["attribute"]["updatePostAtt"]>({
        id: "",
        location: "",
        price: 0,
        size: 0,
        rentStartDate: new Date(),
        rentEndDate: new Date(),
        furnished: false,
        house: false,
        appartment: false,
        terrace: false,
        pets: false,
        smoker: false,
        disability: false,
        garden: false,
        parking: false,
        elevator: false,
        pool: false,
    })

    const onChangeAttributesHandler = (key: string, value: string | number | boolean | Date) => {

        if (!key) return

        if (!params) return

        setData(prop => ({
            ...prop,
            [key]: value,
            id: params.postId
        }))
    }

    const updateAttributesButton = async () => {
        if (!data) return
        const attributesId = await attributes.mutateAsync(data);
        if (attributesId) navigation.navigate("ViewPost");
    }

    return (
        <ScrollView className="mt-20">
            <View>
                <Text className="font-bold text-2xl text-center">Attributes</Text>
                <TextInput className="h-10 m-3 border p-2.5" onChangeText={text => onChangeAttributesHandler("location", text)} value={data.location} placeholder="location" />

                <TextInput className="h-10 m-3 border p-2.5" onChangeText={text => onChangeAttributesHandler("price", parseInt(text))} value={data.price?.toString()} placeholder="Price" />

                <TextInput className="h-10 m-3 border p-2.5" onChangeText={text => onChangeAttributesHandler("size", parseInt(text))} value={data.size?.toString()} placeholder="Size" />

                <Text className="font-bold text-2xl text-center mt-5">Start Date</Text>

                <DatePickerIOS
                    className="h-15 w-100 border m-3 mb-12 p-2.5"
                    date={data.rentStartDate}
                    mode="date"
                    onDateChange={(date) => { onChangeAttributesHandler("rentStartDate", date) }}
                />

                <Text className="font-bold text-2xl text-center mt-5">End Date</Text>

                <DatePickerIOS
                    className="h-15 w-100 border m-3 mb-12 p-2.5"
                    date={data.rentEndDate}
                    mode="date"
                    onDateChange={(date) => { onChangeAttributesHandler("rentEndDate", date) }}
                />

                <CheckBox title="Furnished" onPress={() => { onChangeAttributesHandler("furnished", !(data.furnished)) }} checked={data.furnished} />
                <CheckBox title="House" onPress={() => { onChangeAttributesHandler("house", !(data.house)) }} checked={data.house} />
                <CheckBox title="Appartment" onPress={() => { onChangeAttributesHandler("appartment", !(data.appartment)) }} checked={data.appartment} />
                <CheckBox title="Terrace" onPress={() => { onChangeAttributesHandler("terrace", !(data.terrace)) }} checked={data.terrace} />
                <CheckBox title="Pets" onPress={() => { onChangeAttributesHandler("pets", !(data.pets)) }} checked={data.pets} />
                <CheckBox title="Smoker" onPress={() => { onChangeAttributesHandler("smoker", !(data.smoker)) }} checked={data?.smoker} />
                <CheckBox title="Disability" onPress={() => { onChangeAttributesHandler("disability", !(data.disability)) }} checked={data?.disability} />
                <CheckBox title="Garden" onPress={() => { onChangeAttributesHandler("garden", !(data.garden)) }} checked={data.garden} />
                <CheckBox title="Parking" onPress={() => { onChangeAttributesHandler("parking", !(data.parking)) }} checked={data.parking} />
                <CheckBox title="Elevator" onPress={() => { onChangeAttributesHandler("elevator", !(data.elevator)) }} checked={data.elevator} />
                <CheckBox title="Pool" onPress={() => { onChangeAttributesHandler("pool", !(data.pool)) }} checked={data.pool} />

                <Button title="Submit" className="mx-9 mb-4 mt-4 rounded bg-blue-500 py-1 px-4 font-bold text-white hover:bg-blue-700" onPress={updateAttributesButton} />

            </View>
        </ScrollView >
    );


}