import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import axios from 'axios';
import Input from '@/components/common/Input';
import PageTitle from '@/components/common/PageTitle';
import Button from '@/components/common/Button';
import { TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const forgotPw = () => {
  const router = useRouter();
  
  // 비밀번호 찾기 질문 목록 변수
  const [pwQ, setPwQ] = useState([]) 

  const [userProfile, setUserProfile] = useState({
    'memId': '', // 아이디
    'memName': '', // 이름
    'firstEmail':'', // 이메일
    'secondEmail':'',
    'memEmail':'',
    'pwKey': '',
    'pwAnswer':''
  })

  const [realMemId, setRealMemId] = useState('')

  useEffect(() => {
    const fetchPwQuestions = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/members/pw-question`);
        setPwQ(res.data);
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchPwQuestions();
  }, []);

    // 이메일 앞부분 변경
  const handleFirstEmailChange = (text) => {
    setUserProfile({
      ...userProfile,
      firstEmail: text,
      memEmail: text + userProfile.secondEmail
    });
  };

  // 이메일 뒷부분 변경
  const handleSecondEmailChange = (text) => {
    setUserProfile({
      ...userProfile,
      secondEmail: text,
      memEmail: userProfile.firstEmail + text
    });
  };

  // 일반 항목
  const handleInputChange = (name, value) => {
    setUserProfile({
      ...userProfile,
      [name]: value
    });
  };
  


  return (
    <TouchableWithoutFeedback>
      <SafeAreaView>
        <PageTitle title='비밀번호찾기' />


        <View>      
          <Text>forgotPw</Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default forgotPw

const styles = StyleSheet.create({})