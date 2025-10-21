import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

// app/alarm/index.jsx
// alarm 탭을 터치하면 실행되는 페이지
const AlarmScreen = () => {
  return (
    <SafeAreaView>
      <Text>AlarmScreen 입니다</Text>
    </SafeAreaView>
  )
}

export default AlarmScreen

const styles = StyleSheet.create({})