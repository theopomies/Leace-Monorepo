import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";

export const Dropdown = ({
  data,
  onSelect = (item: { item: string }) => {
    item;
  },
  setShowOptions,
  showOptions,
}: {
  data: Array<{ item: string }>;
  onSelect: (item: { item: string }) => void;
  showOptions: boolean;
  setShowOptions: (bool: boolean) => void;
}) => {
  const onSelectedItem = (value: { item: string }) => {
    setShowOptions(false);
    onSelect(value);
  };

  const toggleDropdown = () => {
    setShowOptions(!showOptions);
  };

  return (
    <View className="relative">
      {showOptions ? (
        <View className="fixed inset-0 z-50 flex items-center justify-center">
          <View className="ml-5 w-80 items-center justify-center rounded-lg bg-white shadow-lg">
            {data.map((value: { item: string }, i: number) => {
              return (
                <TouchableOpacity
                  className="flex w-full flex-row items-center justify-center border-b border-gray-300 px-4 py-2"
                  onPress={() => {
                    onSelectedItem(value);
                  }}
                  key={String(i)}
                >
                  <View
                    className={`flex h-8 w-8 flex-row items-start justify-start rounded-lg`}
                  >
                    {value.item === "Lease" ? (
                      <Icon
                        size={18}
                        name="file-document-edit-outline"
                        type="material-community"
                        color="#002642"
                      />
                    ) : value.item === "Photo & Video" ? (
                      <Icon
                        size={18}
                        name="file-document-edit-outline"
                        type="material-community"
                        color="#002642"
                      />
                    ) : value.item === "Document" ? (
                      <Icon
                        size={18}
                        name="attachment"
                        type="entypo"
                        color="#002642"
                      />
                    ) : value.item === "Report" ? (
                      <Icon
                        size={18}
                        name="attachment"
                        type="entypo"
                        color="#002642"
                      />
                    ) : null}
                  </View>
                  <Text className="ml-4 text-base">{value.item}</Text>
                </TouchableOpacity>
              );
            })}
            <View className="w-full bg-gray-200">
              <Text className="ml-4 text-base"></Text>
            </View>
            <TouchableOpacity
              className="flex w-full flex-row items-center justify-center border-b border-gray-300 px-4 py-2"
              onPress={toggleDropdown}
            >
              <Text className="ml-4 text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      <TouchableOpacity onPress={toggleDropdown}>
        <View className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          {!showOptions && (
            <Icon size={25} name="plus-a" type="fontisto" color="#002642" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
