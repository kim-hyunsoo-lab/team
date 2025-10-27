import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import axios from 'axios';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import PageTitle from '@/components/common/PageTitle';
import { TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SERVER_URL } from '@/constants/appConst';
import { Picker } from '@react-native-picker/picker';
import { Keyboard } from 'react-native';
import { colors } from '@/constants/colorConstant';
import { Pressable } from 'react-native';

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


const setNewPw = async () => {
  // 필수 입력값 검증
  const requiredFields = [
    { key: 'memId', label: '아이디' },
    { key: 'memName', label: '이름' },
    { key: 'memEmail', label: '이메일' },
    { key: 'pwKey', label: '비밀번호 찾기 질문' },
    { key: 'pwAnswer', label: '비밀번호 찾기 답변' }
  ];

  for (const field of requiredFields) {
    const value = userProfile[field.key];
    if (!value || (typeof value === 'string' && !value.trim())) {
      Alert.alert('입력 오류', `${field.label}을(를) 입력해주세요`);
      return;
    }
  }

  try {
    const res = await axios.get(`${SERVER_URL}/members/forgotPw/${userProfile.memId}`);
    
    const isMatch = ['memId', 'memName', 'memEmail', 'pwKey', 'pwAnswer']
      .every(key => res.data[key] == userProfile[key]);    
    if (isMatch) {
      Alert.alert(
        '정보 확인 완료', 
        '비밀번호 변경 페이지로 이동합니다',
        [
          {
            text: '확인',
            onPress: () => {
              router.push({
                pathname: '/auth/renewalPw',
                params: { memId: userProfile.memId }
              });
            }
          }
        ]
      );
    } else {
      Alert.alert('오류', '입력하신 정보가 일치하지 않습니다');
    } 
  } catch (error) {
    console.error('비밀번호 찾기 에러:', error);
    
    if (error.response?.status === 404) {
      Alert.alert('오류', '해당 정보로 등록된 회원을 찾을 수 없습니다');
    } else if (error.response) {
      Alert.alert('오류', error.response.data?.message || '요청 처리에 실패했습니다');
    } else {
      Alert.alert('오류', '서버와의 연결에 실패했습니다');
    }
  }
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <PageTitle title='비밀번호 찾기' titleSize={200} />

        <View style={{ marginTop: 12 }}>  

          <View style={{ marginBottom: 12 }}>
            <Input 
              name="memId" 
              value={userProfile.memId}  
              label='아이디'
              placeholder="아이디를 입력하세요"
              onChangeText={(text) => {
                handleInputChange('memId', text);              
              }}
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}
            />  
          </View>   

          <View style={{ marginBottom: 12 }}>
            <Input 
              name="memName" 
              value={userProfile.memName} 
              label='성명'
              placeholder="이름를 입력하세요"
              onChangeText={(text) => {
                handleInputChange('memName', text);              
              }}
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}
            /> 
          </View> 

          <View style={{ marginBottom: 12 }}>            
            <Text style={styles.label}>이메일</Text>
            <View style={styles.telContainer}>
              <View style={styles.telInput}>
                <Input 
                  name='firstEmail'
                  label=''
                  value={userProfile.firstEmail}
                  onChangeText={(text) => {
                    handleFirstEmailChange(text);              
                  }}
                  returnKeyType="next"
                  placeholder="이메일을 입력하세요"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}             
                  />
              </View>
              <Text style={styles.telSeparator}>@</Text>
              <View style={styles.emailPicker}>
                <Picker
                  selectedValue={userProfile.secondEmail}
                  onValueChange={(value) => handleSecondEmailChange(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="선택" value="" />
                  <Picker.Item label="gmail.com" value="@gmail.com" />
                  <Picker.Item label="naver.com" value="@naver.com" />
                  <Picker.Item label="hanmail.net" value="@hanmail.net" />
                </Picker>
              </View>
            </View>          
          </View>  


          
          <View style={{ marginBottom: 12 }}>
          {/* 비밀번호 찾기 */}
            <Text style={styles.label}>비밀번호 찾기 질문</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={userProfile.pwKey}
                  onValueChange={(value) => {
                    handleInputChange('pwKey', value);
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="선택" value="" />
                  {pwQ.map((item, index) => (
                    <Picker.Item 
                      key={index} 
                      label={item.pwQuestion} 
                      value={item.pwKey} 
                    />
                  ))}
                </Picker>
              </View>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Input
              label="비밀번호 찾기 답변"
              value={userProfile.pwAnswer}
              onChangeText={(text) => {
                handleInputChange('pwAnswer', text);
              }}
              placeholder="답변을 입력하세요"/>        
          </View>

          <View style={{ marginBottom: 5 }}>
            <Button onPress={setNewPw} title='비밀번호 찾기' />
          </View>

          <Pressable style={styles.joinLink} 
            onPress={()=>{if (router.canDismiss()) {
            router.dismissAll();}
            router.replace('/product');}}>
            <Text style={styles.joinText}>메인화면</Text>
          </Pressable>   

        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default forgotPw

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff', 
    paddingRight: 15,
    paddingLeft: 15,
  },
  label: { 
    marginBottom: 4,
    fontSize: 16,
    color: colors.GRAY_700,
    fontWeight: '600'
  },
  emailPicker: {
    flex: 1,
    borderColor: colors.BROWN_LIGHT,
    borderWidth: 1,
    borderRadius: 7,
    height: 42,
    justifyContent: 'center',
  },
  pickerWrapper: {
    borderColor: colors.BROWN_LIGHT,
    borderWidth: 1,
    borderRadius: 7,
    height: 42,
    justifyContent: 'center',
    marginBottom: 8,
  },
  telSeparator: {
    fontSize: 16,
    color: colors.GRAY_500,
    paddingBottom: 8,
  },
  telContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  telInput: {
    flex: 1,
  },
  joinLink: {
    alignItems: 'flex-end',
  },
  joinText: {
    textDecorationLine: 'underline'
  }
})