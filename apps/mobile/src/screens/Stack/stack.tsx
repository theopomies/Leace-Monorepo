import { View, ScrollView } from 'react-native'
import React from 'react'

import { ReportModal } from '../../components/Modal'

export const Stack = () => {

  return (
    <ScrollView className='mt-20'>
      <View>
        <ReportModal cond={true} visible={true} />
      </View>
    </ScrollView>
  )
}