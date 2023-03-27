import React from 'react'
import { TouchableOpacity, View, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';

const SearchBar = ({ icon, searchBar, setSearchBar, setIcon, input, setInput }: { icon: boolean, searchBar: boolean, setIcon: (bool: boolean) => void, setSearchBar: (bool: boolean) => void, input: string, setInput: (string: string) => void }) => {
    return (
        <>
            <TouchableOpacity className="items-end absolute top-0 right-0" onPress={() => { setSearchBar(!searchBar); setIcon(!icon) }}>
                {icon ? <Icon className="" size={15} name="search" reverse={true} color="#1461b4fa" /> : <></>}
            </TouchableOpacity>

            {searchBar &&
                <View className="flex justify-center items-center">
                    <View className="h-10 w-80 flex-row bg-white rounded-lg items-center">

                        <TouchableOpacity>
                            <Icon className="ml-1" size={20} name="search" reverse={false} color="#1461b4fa" />
                        </TouchableOpacity>

                        <TextInput className='h-full px-10 text-xl' multiline onChangeText={(text) => { setInput(text) }} value={input} placeholder="Search..." />

                        <TouchableOpacity className="items-end absolute top-0 right-0 mr-2 mt-2" onPress={() => { setSearchBar(!searchBar); setIcon(!icon); setInput("") }}>
                            <Icon className="ml-1" size={20} name="times" type="font-awesome" reverse={false} color="#1461b4fa" />
                        </TouchableOpacity>
                    </View>
                </View>

            }
        </>
    )
}

export default SearchBar