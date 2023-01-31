import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import { Button, CheckBox } from "react-native-elements"
import { TabStackParamList } from "../../navigation/TabNavigator";
// import { Carousel } from '../../components/Carousel/Carousel'


export const PostAttributeCard = ({
    title,
    desc,
    content,
    location,
    price,
    size,
    rentStartDate,
    rentEndDate,
    furnished,
    house,
    appartment,
    terrace,
    pets,
    smoker,
    disability,
    garden,
    parking,
    elevator,
    pool
}: {
    title: string | undefined,
    desc: string | undefined,
    content: string | undefined,
    location: string | undefined,
    price: number | undefined,
    size: number | undefined,
    rentStartDate: Date | undefined,
    rentEndDate: Date | undefined,
    furnished: boolean | undefined,
    house: boolean | undefined,
    appartment: boolean | undefined,
    terrace: boolean | undefined,
    pets: boolean | undefined,
    smoker: boolean | undefined,
    disability: boolean | undefined,
    garden: boolean | undefined,
    parking: boolean | undefined,
    elevator: boolean | undefined,
    pool: boolean | undefined
}) => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (

        <View className="bg-gray-300 max-w-sm rounded-lg overflow-hidden border-2 mx-2">
            {/* <Carousel value={params.images} /> */}
            <Image source={require('../../../assets/immeuble.webp')} className="max-w-sm h-80" />
            <View className="ml-5 mt-5">
                <Text className="font-bold text-xl mb-2">{title}</Text>
                <Text className="text-gray-700 text-base mb-0.5">
                    {desc}
                </Text>
                <Text className="text-gray-700 text-base">
                    {content}
                </Text>
                <Text className="text-gray-700 text-base">
                    {location}
                </Text>
                <Text className="text-gray-700 text-base">
                    {price}
                </Text>
                <Text className="text-gray-700 text-base">
                    {size}
                </Text>
                <Text className="text-gray-700 text-base">
                    {rentStartDate?.toDateString()}
                </Text>
                <Text className="text-gray-700 text-base">
                    {rentEndDate?.toDateString()}
                </Text>
                {furnished ? <CheckBox Component={TouchableWithoutFeedback} title="furnished" checked={furnished} /> : <CheckBox Component={TouchableWithoutFeedback} title="furnished" checked={false} />}
                {house ? <CheckBox Component={TouchableWithoutFeedback} title="house" checked={house} /> : <CheckBox Component={TouchableWithoutFeedback} title="house" checked={false} />}
                {appartment ? <CheckBox Component={TouchableWithoutFeedback} title="appartment" checked={appartment} /> : <CheckBox Component={TouchableWithoutFeedback} title="appartment" checked={false} />}
                {terrace ? <CheckBox Component={TouchableWithoutFeedback} title="terrace" checked={terrace} /> : <CheckBox Component={TouchableWithoutFeedback} title="terrace" checked={false} />}
                {pets ? <CheckBox Component={TouchableWithoutFeedback} title="pets" checked={pets} /> : <CheckBox Component={TouchableWithoutFeedback} title="pets" checked={false} />}
                {smoker ? <CheckBox Component={TouchableWithoutFeedback} title="smoker" checked={smoker} /> : <CheckBox Component={TouchableWithoutFeedback} title="smoker" checked={false} />}
                {disability ? <CheckBox Component={TouchableWithoutFeedback} title="disability" checked={disability} /> : <CheckBox Component={TouchableWithoutFeedback} title="disability" checked={false} />}
                {garden ? <CheckBox Component={TouchableWithoutFeedback} title="garden" checked={garden} /> : <CheckBox Component={TouchableWithoutFeedback} title="garden" checked={false} />}
                {parking ? <CheckBox Component={TouchableWithoutFeedback} title="parking" checked={parking} /> : <CheckBox Component={TouchableWithoutFeedback} title="parking" checked={false} />}
                {elevator ? <CheckBox Component={TouchableWithoutFeedback} title="elevator" checked={elevator} /> : <CheckBox Component={TouchableWithoutFeedback} title="elevator" checked={false} />}
                {pool ? <CheckBox Component={TouchableWithoutFeedback} title="pool" checked={pool} /> : <CheckBox Component={TouchableWithoutFeedback} title="pool" checked={false} />}
            </View>
            <View className="pt-6 pb-4 px-6">
                <Button
                    onPress={() => {
                        navigation.navigate("ViewPost");
                    }}
                    title="Return to ads" />
            </View>
        </View>
    )
};

