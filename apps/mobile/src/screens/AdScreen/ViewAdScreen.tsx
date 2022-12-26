import { View, Text, ScrollView, Image } from 'react-native'
import { Card, Button, Icon } from 'react-native-elements'

export const ViewAdScreen = ({ route }) => {

    const params = route.params

    return (
        <ScrollView>
            <View>
                <Card>
                    <Card.Title>{params.name}</Card.Title>
                    <Card.Title>{params.email}</Card.Title>
                    <Card.Divider />
                    {/* <Image
                        className="h-20 w-11/12 mb-5 items-center justify-center"
                        source={require('../../../assets/toto.jpg')}
                    /> */}
                    <Text className="mb-2 text-center font-bold " >
                        {params.description}
                    </Text>
                    <Button
                        icon={<Icon className="mr-2" name='more' color='#ffffff' />}
                        className="mb-5 mt-3"
                        title='View more' />
                    <Button
                        icon={<Icon className="mr-2" name='edit' color='#ffffff' />}
                        className="mb-5"
                        title='Edit ad' />
                    <Button
                        icon={<Icon className="mr-2" name='delete' color='#ffffff' />}
                        className="mb-5"
                        title='Delete ad' />
                </Card>
            </View>
        </ScrollView>


    );
}