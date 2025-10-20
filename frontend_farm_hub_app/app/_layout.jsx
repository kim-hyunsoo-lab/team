import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

//(tabs), auth 두 폴더를 stack 구조로 정의하는 파일
const RootLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}/>
  )
}

export default RootLayout

const styles = StyleSheet.create({})