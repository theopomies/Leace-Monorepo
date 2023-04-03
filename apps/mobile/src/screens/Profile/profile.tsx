import React from 'react'
import { View, ScrollView } from 'react-native'
import { Button } from "react-native-elements"
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabStackParamList } from '../../navigation/TabNavigator';
import { useAuth } from "@clerk/clerk-expo";

const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Button
        className="mx-9 mt-5 rounded bg-custom  text-white"
        title="Sign Out"
        buttonStyle={{ backgroundColor: "#002642" }}
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

export const Profile = () => {

  const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <ScrollView className='mt-20'>
      <View>
        <Button title="Create Post"
          buttonStyle={{ backgroundColor: "#002642" }}
          className="mx-9 mt-5 rounded bg-custom  text-white"
          onPress={() => {
            navigation.navigate("CreatePost")
          }} />
        <SignOut />
      </View>
    </ScrollView>
  )
}