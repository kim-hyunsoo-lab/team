import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Button from '@/components/common/Button';
import * as SecureStore from 'expo-secure-store'

// app/alarm/index.jsx
// alarm 탭을 터치하면 실행되는 페이지
const AlarmScreen = () => {
  const router = useRouter(); 

  return (
  
    <SafeAreaView>
      <Text>AlarmScreen 입니다</Text>
      <Pressable onPress={()=>{router.push('/auth/login')}}>
        <Text>로그인 페이지로 이동</Text>
      </Pressable>
      <Pressable onPress={()=>{router.push('/auth/join')}}>
        <Text>회원가입 페이지로 이동</Text>
      </Pressable>
        
    </SafeAreaView>
  )
}

export default AlarmScreen

const styles = StyleSheet.create({})