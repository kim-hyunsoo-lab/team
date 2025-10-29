import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const CartLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown : false
      }}
    />
  )
}

export default CartLayout

const styles = StyleSheet.create({})