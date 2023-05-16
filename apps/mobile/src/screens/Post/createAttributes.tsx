import { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { RouteProp, useNavigation } from '@react-navigation/native';

import { trpc } from "../../utils/trpc";

import { RouterInputs } from '../../../../web/src/utils/trpc';
import { TabStackParamList } from "../../navigation/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ShowProfile from "../../components/ShowProfile";
import { Button } from "../../components/Button"
import { DatePicker, AddSelectedAttributes } from "../../components/Attributes";
import CustomInput from "../../components/CustomInput/CustomInput";

const CreateAttributes = ({ route }: { route: RouteProp<TabStackParamList, "CreatePostAttributes"> }) => {

    const params = route.params;


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
                    <Text className="text-center font-poppins text-3xl text-custom mx-auto mb-10">ATTRIBUTES</Text>
                    <ShowProfile path={require("../../../assets/blank.png")} />
                </View>
                <CustomInput
                    label="Location"
                    value={data.location}
                    category="location"
                    onChangeAttributesHandler={onChangeAttributesHandler}
                    multiline={true}
                    placeholder="Enter location..." />
                <CustomInput
                    label="Price"
                    category="price"
                    value={data.price?.toString()}
                    onChangeAttributesHandler={onChangeAttributesHandler}
                    multiline={false}
                    placeholder="Enter price..." />
                <CustomInput
                    label="Size"
                    category="size"
                    value={data.size?.toString()}
                    onChangeAttributesHandler={onChangeAttributesHandler}
                    multiline={false}
                    placeholder="Enter size..." />
            </View>
            <DatePicker startLabel={"Start Date"} endLabel={"End date"} onChangeAttributesHandler={onChangeAttributesHandler} />
            <AddSelectedAttributes
                data={[
                    { name: 'furnished', label: 'Furnished', checked: data.furnished },
                    { name: 'house', label: 'House', checked: data.house },
                    { name: 'appartment', label: 'Appartment', checked: data.appartment },
                    { name: 'terrace', label: 'Terrace', checked: data.terrace },
                    { name: 'pets', label: 'Pets', checked: data.pets },
                    { name: 'smoker', label: 'Smoker', checked: data.smoker },
                    { name: 'disability', label: 'Disability', checked: data.disability },
                    { name: 'garden', label: 'Garden', checked: data.garden },
                    { name: 'parking', label: 'Parking', checked: data.parking },
                    { name: 'elevator', label: 'Elevator', checked: data.elevator },
                    { name: 'pool', label: 'Pool', checked: data.pool },
                ]}
                onChangeAttributesHandler={onChangeAttributesHandler} />
            <View className="flex-row justify-center mb-10 mt-10">
                <View className="mr-10">
                    <Button title={'Cancel'} color={'custom'} onPress={() => navigation.navigate("Stack")} />
                </View>
                <View>
                    <Button title={'Next'} color={'custom'} onPress={() => updateAttributesButton()} />
                </View>
            </View>

        </ScrollView >
    );
}

export default CreateAttributes