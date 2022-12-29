import { useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, SafeAreaView, Image } from 'react-native'
import { Button } from 'react-native-elements'

export const AdDetailsScreen = ({ route }) => {

    const navigation = useNavigation();

    const params = route.params;

    return (
        <SafeAreaView>
            <ScrollView>
                {/* <Image
                    source={}
                /> */}
                <View className="p-4">
                    <Text className="font-bold text-lg mb-5">{params.name}, {params.email}</Text>
                    <Text className="text-base font-semibold mb-2">{params.address}</Text>
                    <Text className="text-base font-semibold mb-2">{params.type}</Text>
                    <Text className="text-base font-semibold mb-2">{params.price} pour {params.area}</Text>
                    <Text className="text-base font-semibold mb-2">Disponible le {params.date}</Text>
                    <Text className="text-base font-semibold mb-2">Charges supplémentaires {params.charges}</Text>
                    <Text className="text-base font-normal mb-4 text-stone-600">{params.description}</Text>
                    <Button
                        onPress={() => {
                            navigation.navigate("ViewAdScreen", params);
                        }}
                        title="Return to ads"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
