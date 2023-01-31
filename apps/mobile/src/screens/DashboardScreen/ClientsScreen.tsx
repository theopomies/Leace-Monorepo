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

    return (
        <ScrollView >
            <View className="items-center mt-20 mb-20">
                <View className="items-center mx-5 flex-col">
                    {rs.data.post ?
                        Object.values(rs?.data?.post).map((item) => (
                            <View key={item?.id} className="items-center border-2 mb-4 w-72">
                                <View>
                                    <TouchableOpacity>
                                        {item?.createBy?.image ?
                                            <Image
                                                source={{ uri: item.post?.createBy?.image }}
                                                className="mt-2 mb-2 h-14 w-14 mx-1.5" />
                                            :
                                            <Image
                                                source={require('../../../assets/blank.png')}
                                                className="mt-2 mb-2 h-14 w-16 mx-1.5" />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View className="items-center">
                                    <Text className="font-bold text-xl mb-2">{item?.createBy?.email}</Text>
                                    <Text className="font-bold text-xl mb-2">{item?.createdBy?.name}</Text>
                                    <Text className="font-bold text-xl mb-2">{item?.createdBy?.email}</Text>

                                </View>
                                <View className="items-center">

                                    <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                                        <Icon size={20} name="comments" type='font-awesome' reverse={true} color="#999999" tvParallaxProperties={undefined} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        ))
                        :
                        <></>
                    }

                </View>
            </View >
        </ScrollView >
    )
}