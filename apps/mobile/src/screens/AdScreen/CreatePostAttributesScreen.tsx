import { useState } from "react";
import { ScrollView, TextInput, View, Text, TouchableOpacity, Image } from "react-native";
import { CheckBox } from "react-native-elements";
import { RouteProp, useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { trpc } from "../../utils/trpc";

import { RouterInputs } from '../../../../web/src/utils/trpc';
import { TabStackParamList } from "../../navigation/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const CreatePostAttributesScreen = ({ route }: { route: RouteProp<TabStackParamList, "CreatePostAttributes"> }) => {

    const params = route.params;

    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);


    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    const attributes = trpc.attribute.updatePostAtt.useMutation()

    const [data, setData] = useState<RouterInputs["attribute"]["updatePostAtt"]>({
        id: "",
        location: "",
        price: undefined,
        size: undefined,
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

    const handleStartDatePicker = () => {
        setStartDatePickerVisible(true);
    };

    const handleEndDatePicker = () => {
        setEndDatePickerVisible(true);
    };

    const hideStartDatePicker = () => {
        setStartDatePickerVisible(false);
    };

    const hideEndDatePicker = () => {
        setEndDatePickerVisible(false);
    };

    const onChangeAttributesHandler = (key: string, value: string | number | boolean | Date) => {

        if (!key) return

        if (!params) return

        setData(prevState => ({
            ...prevState,
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
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-p font-bold text-3xl	text-custom mx-auto mb-10">ATTRIBUTES</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Image
                            source={require('../../../assets/blank.png')}
                            className="mt-2 mb-10 h-10 w-12 mr-1" />
                    </TouchableOpacity>
                </View>
                <Text className='text-custom font-semibold ml-3'>Location</Text>
                <TextInput
                    className="h-12 m-3 mb-5 border rounded p-2.5"
                    onChangeText={text => onChangeAttributesHandler("location", text)}
                    value={data.location}
                    multiline={true}
                    placeholder="Enter location..."
                />
                <Text className='text-custom font-semibold ml-3'>Price</Text>
                <TextInput
                    className="h-12 m-3 mb-5 border rounded p-2.5"
                    onChangeText={text => onChangeAttributesHandler("price", parseInt(text))}
                    value={data.price?.toString()}
                    placeholder="Enter price..."
                />
                <Text className='text-custom font-semibold ml-3'>Size</Text>
                <TextInput
                    className="h-12 m-3 mb-5 border rounded p-2.5"
                    onChangeText={text => onChangeAttributesHandler("size", parseInt(text))}
                    value={data.size?.toString()}
                    placeholder="Enter size..."
                />
            </View>

            <View className="flex-col justify-center mt-2 mb-3">
                <TouchableOpacity
                    className="mx-20 py-4 px-10 bg-custom rounded font-semibold h-12 flex justify-center items-center mb-5"
                    onPress={handleStartDatePicker}
                >
                    <Text className="font-semibold text-white">Select Start Date</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="mx-20 py-4 px-10 bg-custom rounded font-semibold h-12 flex justify-center items-center"
                    onPress={handleEndDatePicker}
                >
                    <Text className="font-semibold text-white">Select End Date</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isStartDatePickerVisible}
                    mode="date"
                    onConfirm={(selectedDate) => {
                        onChangeAttributesHandler("rentStartDate", selectedDate);
                        hideStartDatePicker();
                    }}
                    onCancel={hideStartDatePicker}
                />
                <DateTimePickerModal
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    onConfirm={(selectedDate) => {
                        onChangeAttributesHandler("rentEndDate", selectedDate);
                        hideEndDatePicker();
                    }}
                    onCancel={hideEndDatePicker}
                />
            </View>

            <View className="flex-row justify-between flex-end">
                <View className="flex-1 flex items-end">
                    <CheckBox title="Furnished" onPress={() => { onChangeAttributesHandler("furnished", !(data.furnished)) }} checked={data.furnished} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" iconRight textStyle={{ color: "#002642" }} />
                </View>
                <View className="flex-1">
                    <CheckBox title="House" onPress={() => { onChangeAttributesHandler("house", !(data.house)) }} checked={data.house} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" textStyle={{ color: "#002642" }} />
                </View>
            </View>
            <View className="flex-row justify-between flex-start">
                <View className=" flex-1 flex items-end">
                    <CheckBox title="Appartment" onPress={() => { onChangeAttributesHandler("appartment", !(data.appartment)) }} checked={data.appartment} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" iconRight textStyle={{ color: "#002642" }} />
                </View>
                <View className=" flex-1">
                    <CheckBox title="Terrace" onPress={() => { onChangeAttributesHandler("terrace", !(data.terrace)) }} checked={data.terrace} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" textStyle={{ color: "#002642" }} />
                </View>
            </View>
            <View className="flex-row justify-between">
                <View className=" flex-1 flex items-end">
                    <CheckBox title="Pets" onPress={() => { onChangeAttributesHandler("pets", !(data.pets)) }} checked={data.pets} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" iconRight textStyle={{ color: "#002642" }} />
                </View>
                <View className=" flex-1">
                    <CheckBox title="Smoker" onPress={() => { onChangeAttributesHandler("smoker", !(data.smoker)) }} checked={data?.smoker} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" textStyle={{ color: "#002642" }} />
                </View>
            </View>
            <View className="flex-row justify-between">
                <View className=" flex-1 flex items-end">
                    <CheckBox title="Disability" onPress={() => { onChangeAttributesHandler("disability", !(data.disability)) }} checked={data?.disability} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" iconRight textStyle={{ color: "#002642" }} />
                </View>
                <View className=" flex-1">
                    <CheckBox title="Garden" onPress={() => { onChangeAttributesHandler("garden", !(data.garden)) }} checked={data.garden} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" />
                </View>
            </View>
            <View className="flex-row justify-between items-center">
                <View className=" flex-1 flex items-end">
                    <CheckBox title="Parking" onPress={() => { onChangeAttributesHandler("parking", !(data.parking)) }} checked={data.parking} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" iconRight textStyle={{ color: "#002642" }} />
                </View>
                <View className=" flex-1">
                    <CheckBox title="Elevator" onPress={() => { onChangeAttributesHandler("elevator", !(data.elevator)) }} checked={data.elevator} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" textStyle={{ color: "#002642" }} />
                </View>
            </View>
            <View className="flex-row justify-between items-center">
                <View className=" flex-1 flex items-end">
                    <CheckBox title="Pool" onPress={() => { onChangeAttributesHandler("pool", !(data.pool)) }} checked={data.pool} containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        checkedColor="#002642" iconRight textStyle={{ color: "#002642" }} />
                </View>
                <View className=" flex-1" />
            </View>

            <View className="flex-row justify-center mb-10 mt-10">
                <TouchableOpacity
                    className="mx-3 py-4 px-10 border border-custom rounded text-white font-semibold mr-10 w-32 h-12 flex justify-center items-center"
                    onPress={() => {
                        navigation.navigate("Stack");
                    }}
                >
                    <Text className="font-semibold text-custom">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="mx-3 py-4 px-10 bg-custom rounded text-white font-semibold w-32 h-12 flex justify-center items-center"
                    onPress={() => {
                        updateAttributesButton();
                    }}
                >
                    <Text className="font-semibold text-white">Next</Text>
                </TouchableOpacity>
            </View>

        </ScrollView >
    );
}