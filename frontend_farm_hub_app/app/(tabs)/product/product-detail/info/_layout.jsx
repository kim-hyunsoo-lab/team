import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const InfoLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown : false
      }}
    />
  )
}

export default InfoLayout

const styles = StyleSheet.create({})