import { View } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabStackParamList } from '../../navigation/TabNavigator';


export const Match = () => {

  const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <View className="mt-20">
      <Button title="Chat"
        buttonStyle={{ backgroundColor: "#002642" }}
        className="mx-9 mt-5 rounded bg-blue-500  text-white hover:bg-blue-700" onPress={() => {
          navigation.navigate("MatchChat")
        }} />
    </View>
  )
}