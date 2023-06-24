import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DatePicker = ({
  startLabel,
  endLabel,
  onChangeAttributesHandler,
}: {
  startLabel: string;
  endLabel: string;
  onChangeAttributesHandler: (name: string, date: Date) => void;
}) => {
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] =
    useState(false);
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
    <View className="mb-3 mt-2 flex-col justify-center">
      <TouchableOpacity
        className="bg-custom mx-20 mb-5 flex h-12 items-center justify-center rounded px-10 py-4 font-semibold"
        onPress={handleStartDatePicker}
      >
        <Text className="font-semibold text-white">{startLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-custom mx-20 mb-5 flex h-12 items-center justify-center rounded px-10 py-4 font-semibold"
        onPress={handleEndDatePicker}
      >
        <Text className="font-semibold text-white">{endLabel}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={(selectedDate) => {
          onChangeAttributesHandler("startDate", selectedDate);
          onChangeAttributesHandler("rentStartDate", selectedDate);

          hideStartDatePicker();
        }}
        onCancel={hideStartDatePicker}
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={(selectedDate) => {
          onChangeAttributesHandler("endDate", selectedDate);
          onChangeAttributesHandler("rentEndDate", selectedDate);
          hideEndDatePicker();
        }}
        onCancel={hideEndDatePicker}
      />
    </View>
  );
};

export default DatePicker;
