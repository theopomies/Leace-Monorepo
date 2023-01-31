import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { Icon, Button } from 'react-native-elements';
import { Dropdown } from '../Dropdown/Dropdown';

import { Picker } from '@react-native-picker/picker';
import { Reason } from '../../utils/enum';
import { ModalPopup } from '../Modal/Modal';
import { trpc } from '../../utils/trpc';

export const Chat = () => {

    const reportUser = trpc.report.reportUser.useMutation()

    const [value, setValue] = useState('');
    const [modal, setModal] = useState(false);
    const [contract, setContract] = useState(false);
    const [searchBar, setSearchBar] = useState(false);
    const [icon, setIcon] = useState(true);
    const [input, setInput] = useState('');
    const [selectedValue, setSelectedValue] = useState<Reason>(Reason.SPAM);
    const [selected, setSelected] = useState({ item: "" })

    const onSelect = (item: { item: string }) => {
        setSelected(item)

        if (item.item === "Report") setModal(true)
        if (item.item === "Contract") setContract(true)
    }

    const reportButton = (reason: Reason) => {
        reportUser.mutate({ userId: "cldfh7fo50000rrzi4lcne0jd", reason: reason });
    };

    const handleChange = (text: string) => {
        setValue(text);
    };

    const data = [
        { item: 'Contract', color: "bg-blue-500" },
        { item: 'Upload', color: "bg-blue-500" },
        { item: 'Report', color: "bg-red-500" },
    ];

    return (
        <>
            <Text className="mt-16 text-3xl font-bold text-center">
                Chat
            </Text>

            <View className="mb-14">
                <TouchableOpacity className="items-end absolute top-0 right-0" onPress={() => { setSearchBar(!searchBar); setIcon(!icon) }}>
                    {icon ? <Icon className="" size={15} name="search" reverse={true} color="#1461b4fa" tvParallaxProperties={undefined} /> : <></>}
                </TouchableOpacity>
            </View>

            {searchBar &&
                <View className="flex justify-center items-center">
                    <View className="h-10 w-80 flex-row bg-white rounded-lg items-center">

                        <TouchableOpacity>
                            <Icon className="ml-1" size={20} name="search" reverse={false} color="#1461b4fa" tvParallaxProperties={undefined} />
                        </TouchableOpacity>

                        <TextInput className='h-full px-10 text-xl' multiline onChangeText={(text) => { setInput(text) }} value={input} placeholder="Search..." />

                        <TouchableOpacity className="items-end absolute top-0 right-0 mr-2 mt-2" onPress={() => { setSearchBar(!searchBar); setIcon(!icon); setInput("") }}>
                            <Icon className="ml-1" size={20} name="times" type="font-awesome" reverse={false} color="#1461b4fa" tvParallaxProperties={undefined} />
                        </TouchableOpacity>
                    </View>
                </View>

            }

            {
                selected && selected.item === "Report" && <ModalPopup aspect={false} visible={modal}>
                    <View className="items-center">
                        <TouchableOpacity onPress={() => {
                            setModal(false);
                        }}>
                            <Image
                                source={require('../../../assets/x.png')}
                                className="h-8 w-8 mb-5"
                            />
                        </TouchableOpacity>
                        <Picker
                            selectedValue={selectedValue}
                            style={{ height: 50, width: 300, marginBottom: 200 }}
                            onValueChange={(itemValue) => setSelectedValue(itemValue as Reason)}

                        >
                            <Picker.Item label="SPAM" value={Reason.SPAM} />
                            <Picker.Item label="SCAM" value={Reason.SCAM} />
                            <Picker.Item label="INAPPROPRIATE" value={Reason.INAPPROPRIATE} />
                            <Picker.Item label="OTHER" value={Reason.OTHER} />
                        </Picker>

                        <Button title="Submit" className="mt-20 mx-9 mb-4 rounded bg-blue-500 py-1 px-4 font-bold text-white hover:bg-blue-700" onPress={() => { reportButton(selectedValue); setModal(false); }} />

                    </View>
                </ModalPopup>
            }

            {
                selected && selected.item === "Contract" && <ModalPopup aspect={false} visible={contract}>
                    <View className="items-center">
                        <TouchableOpacity onPress={() => {
                            setContract(false);
                        }}>
                            <Image
                                source={require('../../../assets/x.png')}
                                className="h-8 w-8 mb-5"
                            />
                        </TouchableOpacity>

                        <Text className="text-3xl font-bold text-center items-center justify-center mt-5">This is your contract</Text>

                        <View className="flex-row">
                            <Button title="Accept" buttonStyle={{ backgroundColor: "rgb(34 197 94 / var(--tw-bg-opacity))" }} className="mt-20 mx-9 mb-4 rounded bg-green-500 py-1 px-4 font-bold text-white" onPress={() => { setContract(false); }} />
                            <Button title="Decline" buttonStyle={{ backgroundColor: "rgb(239 68 68 / var(--tw-bg-opacity))" }} className="mt-20 mx-9 mb-4 rounded bg-red-500 py-1 px-4 font-bold text-white" onPress={() => { setContract(false); }} />
                        </View>
                    </View>
                </ModalPopup>
            }



            <View className="flex justify-between items-center absolute left-0 bottom-0 max-h-100 p-5 w-full">
                <View className='absolute left-2 bottom-4 flex justify-center items-center w-10 h-10 rounded-full'>
                    <Dropdown onSelect={onSelect} data={data} />
                </View>
                <View className='bg-white w-4/5 rounded-lg'>
                    <TextInput
                        value={value}
                        onChangeText={handleChange}
                        className='h-full px-10 text-xl'
                        multiline
                        placeholder="Enter message..." />
                </View>

                <TouchableOpacity className='absolute right-2 bottom-4 flex justify-center items-center w-10 h-10 rounded-full'>
                    {value ?
                        <Icon size={15} name="send" reverse={true} color="#1461b4fa" tvParallaxProperties={undefined} />
                        :
                        <></>}
                </TouchableOpacity>
            </View>
        </>
    );
}