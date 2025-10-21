import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';

// (home), alarm, control 폴더를 tab 구조롤 설정하는 파일
const TabLayout = () => {
  return (
    <Tabs screenOptions={{headerShown : false}}>
      <Tabs.Screen 
        name='(home)'
        options={{
          title : 'Home',
          tabBarIcon : () => <FontAwesome name="home" size={24} color="black" />
        }}
      />

      <Tabs.Screen 
        name='alarm'
        options={{
          title : 'Alarm',
          tabBarIcon : () => <FontAwesome name="bell" size={24} color="black" />
        }}
      />
      
      <Tabs.Screen 
        name='control'
        options={{
          title : 'Control',
          tabBarIcon : () => <FontAwesome name="gear" size={24} color="black" />
        }}
      />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})