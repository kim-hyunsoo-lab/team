import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

// (home), alarm, control 폴더를 tab 구조롤 설정하는 파일
const TabLayout = () => {
  return (
    <Tabs screenOptions={{headerShown : false}}>
      <Tabs.Screen 
        name='(home)'
        options={{
          title : 'Home'
        }}
      />

      <Tabs.Screen 
        name='alarm'
        options={{
          title : 'Alarm'
        }}
      />
      
      <Tabs.Screen 
        name='control'
        options={{
          title : 'Control'
        }}
      />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})