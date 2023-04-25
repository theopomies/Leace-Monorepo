import { View, Image, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native-elements'
import Modal from './Modal'

const ContractModal = ({ cond, visible }: { cond: boolean, visible: boolean }) => {

    const [isOpened, setIsOpened] = useState(false);

    return (
        <View>
            {cond ? <Button title="Report" className="mx-9 mt-5 rounded bg-blue-500  text-white hover:bg-blue-700" onPress={() => {
                setIsOpened(true);
            }} /> : <></>}
            {isOpened && visible ?
                <Modal aspect={false} visible={isOpened}>
                    <View className="items-center">
                        <TouchableOpacity onPress={() => setIsOpened(false)}>
                            <Image source={require('../../../assets/x.png')} className="h-8 w-8 mb-5" />
                        </TouchableOpacity>

                        <Text className="text-3xl font-bold text-center items-center justify-center mt-5">This is your contract</Text>

                        <View className="flex-row">
                            <Button
                                title="Accept"
                                buttonStyle={{ backgroundColor: 'rgb(34 197 94 / var(--tw-bg-opacity))' }}
                                className="mt-20 mx-9 mb-4 rounded bg-green-500 py-1 px-4 font-bold text-white"
                                onPress={() => setIsOpened(false)}
                            />
                            <Button
                                title="Decline"
                                buttonStyle={{ backgroundColor: 'rgb(239 68 68 / var(--tw-bg-opacity))' }}
                                className="mt-20 mx-9 mb-4 rounded bg-red-500 py-1 px-4 font-bold text-white"
                                onPress={() => setIsOpened(false)}
                            />
                        </View>
                    </View>
                </Modal>
                : <></>}
        </View>
    )
}

export default ContractModal