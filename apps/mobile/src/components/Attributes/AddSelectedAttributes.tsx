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
        <View className="flex-wrap flex-row space-between">
            {data.map((item, index) => (
                <View key={item.label} className="w-2/4">
                    <CheckBox
                        title={item.label}
                        onPress={() => onChangeAttributesHandler(item.name, !item.checked)}
                        checked={item.checked}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, alignItems: index % 2 === 0 ? 'flex-end' : 'flex-start' }}
                        checkedColor="#002642"
                        iconRight={index % 2 === 0}
                        textStyle={{ color: '#002642' }}
                    />
                </View>
            ))}
        </View>

    );
};

export default AddSelectedAttributes;
