import { View, Text, ScrollView } from 'react-native'
import React from 'react'

import { trpc } from '../../utils/trpc';

import ShowProfile from '../../components/ShowProfile';
import { ClientCard } from '../../components/Card';

const Clients = () => {

    const rs = trpc.relationship.getMatch.useQuery()


    return (
        <ScrollView className="mt-20 mx-5" showsVerticalScrollIndicator={false}>
            <View>
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-p font-bold text-3xl	text-custom mx-auto mb-10">CLIENTS</Text>
                    <ShowProfile path={require("../../../assets/blank.png")} />
                </View>
                {rs.data ?
                    rs.data.map(item => (
                        <View key={item.id} className="mb-2 items-center">
                            <ClientCard firstName={item.post.createdBy.firstName} lastName={item.post.createdBy.lastName} email={item.post.createdBy.email} image={require("../../../assets/blank.png")} />
                        </View>
                    ))
                    :
                    <></>
                }
            </View>
        </ScrollView>
    )
}

export default Clients