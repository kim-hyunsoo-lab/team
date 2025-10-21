import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

// app/(tabs)/alarm/_layout.jsx
// alarm 폴더 안의 jsx 파일의 구조 설정
const AlarmLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}/>
  )
}

export default AlarmLayout

const styles = StyleSheet.create({})