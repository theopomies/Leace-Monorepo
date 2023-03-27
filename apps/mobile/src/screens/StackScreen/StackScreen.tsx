import { Button, View, ScrollView } from 'react-native'
import React from 'react'

import { ReportModal } from '../../components/Modal'

import { useAuth } from "@clerk/clerk-expo";


const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

export const StackScreen = () => {

  return (
    <ScrollView className='mt-20'>
      <View>
        <ReportModal cond={true} visible={true} />
      </View>
      <SignOut />
    </ScrollView>
  )
}