import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

// app/(tabs)/(home)/_layout.jsx
// (home) 폴더 안의 index 파일의 구조 설정
const HomeLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}/>
  )
}

export default HomeLayout

const styles = StyleSheet.create({})