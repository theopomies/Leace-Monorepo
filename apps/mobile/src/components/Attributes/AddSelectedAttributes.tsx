import React from 'react';
import { View } from 'react-native';
import { CheckBox } from 'react-native-elements';

type CheckboxItem = {
    name: string;
    label: string;
    checked: boolean | undefined;
}

type CheckboxGroupProps = {
    data: CheckboxItem[];
    onChangeAttributesHandler: (name: string, checked: boolean) => void;
}

const AddSelectedAttributes = ({ data, onChangeAttributesHandler }: CheckboxGroupProps) => {
    return (
        <>
            {data.map((item) => (
                <View key={item.label} className="flex-row justify-between items-center">
                    <View className=" flex-1 flex items-end">
                        <CheckBox
                            title={item.label}
                            onPress={() => onChangeAttributesHandler(item.name, !item.checked)}
                            checked={item.checked}
                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                            checkedColor="#002642"
                            iconRight
                            textStyle={{ color: '#002642' }}
                        />
                    </View>
                </View>
            ))}
        </>
    );
};

export default AddSelectedAttributes;
