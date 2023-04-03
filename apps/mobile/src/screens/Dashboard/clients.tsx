import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'

import { trpc } from '../../utils/trpc';
import { Icon } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabStackParamList } from '../../navigation/TabNavigator';
import ShowProfile from '../../components/ShowProfile';

const Clients = () => {

    const rs = trpc.relationship.getMatch.useQuery()

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (
        <ScrollView className='mt-20'>
            <View className="items-center">
                <View className="items-center mx-5 flex-col">
                    {rs.data ?
                        rs.data.map(item => {
                            return (
                                <View key={item.id} className="items-center border-2 mb-4 w-72">
                                    <View>
                                        <ShowProfile path={require("../../../assets/blank.png")} />
                                    </View>
                                    <View className="items-center">
                                        <Text className="font-bold text-xl mb-2">{item.post.createdBy.firstName} {item.post.createdBy.lastName}</Text>
                                        <Text className="font-bold text-xl mb-2">{item.post.createdBy.email}</Text>
                                    </View>
                                    <View className="items-center">

                                        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                                            <Icon size={20} name="comments" type='font-awesome' reverse={true} color="#999999" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            )
                        })
                        :
                        <View className="items-center justify-center right-0 left-0 top-80 bottom-80">
                            <Text className="text-3xl font-bold text-center items-center justify-center">No new friends</Text>
                        </View>
                    }
                </View>
            </View >
        </ScrollView >
    )
}

export default Clients