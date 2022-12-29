import React from 'react';
import { View, Text, ScrollView } from 'react-native'
import { Card, Button, Icon } from 'react-native-elements'
import { Carousel } from '../../components/Carousel/Carousel'
import { useNavigation } from "@react-navigation/native";

export const ViewAdScreen = ({ route }) => {

    const navigation = useNavigation();

    const params = route.params

    return (
        <ScrollView>
            <View>
                <Card>
                    <Card.Title>{params.name}</Card.Title>
                    <Card.Title>{params.email}</Card.Title>
                    <Card.Divider />
                    <Carousel value={params.images} />
                    <Text className="mb-2 text-center font-bold " >
                        {params.description}
                    </Text>
                    <Button
                        icon={<Icon className="mr-2" name='more' color='#ffffff' tvParallaxProperties={undefined} />}
                        className="mb-5 mt-3"
                        title='View more'
                        onPress={() => {
                            navigation.navigate("AdDetailsScreen", params)
                        }} />
                    <Button
                        icon={<Icon className="mr-2" name='edit' color='#ffffff' tvParallaxProperties={undefined} />}
                        className="mb-5"
                        title='Edit ad' />
                    <Button
                        icon={<Icon className="mr-2" name='delete' color='#ffffff' tvParallaxProperties={undefined} />}
                        className="mb-5"
                        title='Delete ad' />
                </Card>
            </View>
        </ScrollView>
    );
}