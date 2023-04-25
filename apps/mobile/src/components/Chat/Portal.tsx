import { View, Text } from 'react-native'
import React, { useState } from 'react'

import { ContractModal, ReportModal } from '../Modal';
import SearchBar from "./SearchBar"
import BottomBar from './BottomBar';

export const Portal = () => {

    const [value, setValue] = useState('');
    const [searchBar, setSearchBar] = useState(false);
    const [icon, setIcon] = useState(true);
    const [input, setInput] = useState('');
    const [selected, setSelected] = useState({ item: "" })

    const onSelect = (item: { item: string }) => {
        setSelected(item)
    }

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

            <SearchBar icon={icon} searchBar={searchBar} setIcon={setIcon} setSearchBar={setSearchBar} input={input} setInput={setInput} />

            {selected && selected.item === "Report" && <ReportModal cond={false} visible={true} />}

            {selected && selected.item === "Contract" && <ContractModal cond={false} visible={true} />}

            <View className="flex justify-between items-center absolute left-0 bottom-0 max-h-100 p-5 w-full">
                <BottomBar onSelect={onSelect} data={data} value={value} handleChange={handleChange} />
            </View>
        </>
    );
}