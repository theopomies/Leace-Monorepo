import { View, ScrollView } from 'react-native'
import React from 'react'


import { Report } from '../../components/Report/Report'

export const StackScreen = () => {

  return (
    <ScrollView>
      <View>
        <Report cond={true} />
      </View>
    </ScrollView>
  )
}