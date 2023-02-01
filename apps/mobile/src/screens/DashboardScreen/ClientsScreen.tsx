import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import { trpc } from '../../utils/trpc';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabStackParamList } from '../../navigation/TabNavigator';

export const ClientsScreen = () => {

    const rs = trpc.relationShip.getMatch.useQuery()

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    console.log(rs?.data)
    return (
        <ScrollView >
            <View className="items-center mt-20 mb-20">
                <View className="items-center mx-5 flex-col">
                    {rs.data ?
                        rs.data.map(item => {
                            return (
                                <View key={item?.id} className="items-center border-2 mb-4 w-72">
                                    <View>
                                        <TouchableOpacity>
                                            {item?.post?.createBy?.image ?
                                                <Image
                                                    source={{ uri: item.post?.createBy?.image }}
                                                    className="mt-2 mb-2 h-14 w-16 mx-1.5" />
                                                :
                                                <Image
                                                    source={require('../../../assets/blank.png')}
                                                    className="mt-2 mb-2 h-14 w-16 mx-1.5" />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View className="items-center">
                                        <Text className="font-bold text-xl mb-2">{item.post?.createBy?.email}</Text>
                                        <Text className="font-bold text-xl mb-2">{item.post?.createdBy?.name}</Text>
                                        <Text className="font-bold text-xl mb-2">{item.post?.createdBy?.email}</Text>

                                    </View>
                                    <View className="items-center">

                                        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                                            <Icon size={20} name="comments" type='font-awesome' reverse={true} color="#999999" tvParallaxProperties={undefined} />
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