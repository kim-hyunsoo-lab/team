import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

//app의 폴더들을 stack 구조로 정의하는 파일
const RootLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}/>
  )
}

export default RootLayout

const styles = StyleSheet.create({})