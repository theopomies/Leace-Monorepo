import { View, ScrollView } from 'react-native'
import React from 'react'


import { Report } from '../../components/Report/Report'

export const StackScreen = () => {

  return (
    <ScrollView className='mt-20'>
      <View>
        <Report cond={true} />
      </View>
    </ScrollView>
  )
}