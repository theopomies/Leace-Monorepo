import { View, ScrollView } from 'react-native'
import { Button } from "react-native-elements";
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabStackParamList } from '../../navigation/TabNavigator';

export const ProfileScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <ScrollView className='mt-20'>
      <View>
        <Button title="Create Post" className="mx-9 mt-5 rounded bg-blue-500  text-white hover:bg-blue-700" onPress={() => {
          navigation.navigate("CreatePost")
        }}>
        </Button>
      </View>
    </ScrollView>
  )
}