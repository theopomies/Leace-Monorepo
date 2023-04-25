import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DatePicker = ({ startLabel, endLabel, onChangeAttributesHandler }: {
    startLabel: string, endLabel: string, onChangeAttributesHandler: (name: string, date: Date) => void;
}) => {
    const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);

    const handleStartDatePicker = () => {
        setIsStartDatePickerVisible(true);
    };

    const handleEndDatePicker = () => {
        setIsEndDatePickerVisible(true);
    };

    const hideStartDatePicker = () => {
        setIsStartDatePickerVisible(false);
    };

    const hideEndDatePicker = () => {
        setIsEndDatePickerVisible(false);
    };

    return (
        <View className="flex-col justify-center mt-2 mb-3">
            <TouchableOpacity
                className="mx-20 py-4 px-10 bg-custom rounded font-semibold h-12 flex justify-center items-center mb-5"
                onPress={handleStartDatePicker}
            >
                <Text className="font-semibold text-white">{startLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="mx-20 py-4 px-10 bg-custom rounded font-semibold h-12 flex justify-center items-center mb-5"
                onPress={handleEndDatePicker}
            >
                <Text className="font-semibold text-white">{endLabel}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={(selectedDate) => {
                    onChangeAttributesHandler("rentStartDate", selectedDate);
                    hideStartDatePicker();
                }}
                onCancel={hideStartDatePicker}
            />
            <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                onConfirm={(selectedDate) => {
                    onChangeAttributesHandler("rentEndDate", selectedDate);
                    hideEndDatePicker();
                }}
                onCancel={hideEndDatePicker}
            />
        </View>
    );
};

export default DatePicker;
