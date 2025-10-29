import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';

// (home), alarm, control 폴더를 tab 구조롤 설정하는 파일
const TabLayout = () => {
  return (
    <Tabs screenOptions={{headerShown : false}}>
      {/* 관리자 홈 화면 */}
      <Tabs.Screen 
        name='(home)'
        options={{
          title : 'Home',
          tabBarIcon : () => <FontAwesome name="home" size={24} color="black" />
        }}
      />

      {/* 관리자 축사 알림 */}
      <Tabs.Screen 
        name='alarm'
        options={{
          title : 'Alarm',
          tabBarIcon : () => <FontAwesome name="bell" size={24} color="black" />
        }}
      />
      
      {/* 관리자 축사 관리 */}
      <Tabs.Screen 
        name='control'
        options={{
          title : 'Control',
          tabBarIcon : () => <FontAwesome name="gear" size={24} color="black" />
        }}
      />

      {/* 소비자 홈 화면 */}
      <Tabs.Screen 
        name='product'
        options={{
          title : 'Home',
          tabBarIcon : () => <FontAwesome name="home" size={24} color="black" />
        }}
      />
      
      {/* 소비자 마이페이지 */}
      <Tabs.Screen
        name='my-page'
        options={{
          title : 'My Page',
          tabBarIcon : () => <FontAwesome name='user' size={24} color="black" />
        }}
      />


    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})