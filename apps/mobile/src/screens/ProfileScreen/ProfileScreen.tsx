import { View, ScrollView } from 'react-native'
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import React from 'react'


export const ProfileScreen = () => {

  const navigation = useNavigation();

  return (
    <ScrollView>
      <View>
        <Button title="CreateAdScreen" className="mx-9 mt-5 rounded bg-blue-500  text-white hover:bg-blue-700" onPress={() => {
          navigation.navigate("CreateAdScreen")
        }}>
        </Button>
      </View>
    </ScrollView>
  )
}