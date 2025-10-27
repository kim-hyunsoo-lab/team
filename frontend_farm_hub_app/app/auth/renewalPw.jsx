import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router';
import { TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import PageTitle from '@/components/common/PageTitle';
import { SERVER_URL } from '@/constants/appConst';
import axios from 'axios';
import { colors } from '@/constants/colorConstant';

const renewalPw = () => {
  const router = useRouter();
  const { memId } = useLocalSearchParams();

  useEffect(() => {
    if (!memId) {
      Alert.alert('오류', '잘못된 접근입니다', [
        {
          text: '확인',
          onPress: () => router.back()
        }
      ]);
    }
  }, [memId]);

  const [errorMsg, setErrorMsg] = useState({
    'memPw': '',
    'confirmPw': ''
    });

  const [newPw, setNewPw] = useState({
    'memPw': '',
    'confirmPw': ''    
  })

  const settingNewPw = (name, value) =>{
    setNewPw({
      ...newPw,
      [name]: value
    })
  }  

  
  const handleErrorMsg = (name, value, newPw) => {
    let errorStr = '';
    const memPwRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;

  switch(name) {
    case 'memPw':
      if (!value)
        errorStr = '비밀번호는 비워둘 수 없습니다'    
      else if(!memPwRegex.test(value))
        errorStr = '비밀번호는 영문과 숫자의 조합이어야 합니다'   
      else 
        errorStr = ''; 
      break;  
      
    case 'confirmPw':
      if(value !== newPw.memPw) {
        errorStr = '비밀번호가 일치하지 않습니다';
      }
      break;
  }     
  return errorStr;        
}

  const RenewingPw = async () => {
    try {
      await axios.put(`${SERVER_URL}/members/renewalPw`, {
        memId: memId,
        memPw: newPw.memPw
      });
      
      Alert.alert('완료', '비밀번호가 변경되었습니다. 다시 로그인해주세요', [
        {
          text: '확인',
          onPress: () => {
            if (router.canDismiss()) {
              router.dismissAll();
            }
            router.replace('/product');
          }
        }
      ]);
      } catch (error) {
      console.error('비밀번호 변경 에러:', error);
      Alert.alert('오류', '비밀번호 변경에 실패했습니다');
    }
  };

  if (!memId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>로딩중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <PageTitle title='비밀번호 변경' titleSize={200} />        

        <View style={[styles.container, { marginTop: 12 }]}>
          <View style={{marginBottom: 11}}>
            <Text style={styles.label}>
              아이디: {memId}
            </Text>
          </View>
          
          <View style={{marginBottom: 13}}>
            <Input 
              name="memPw"
              value={newPw.memPw}
              label="새 비밀번호"
              isPw={true}
              placeholder="새 비밀번호를 입력해주세요"
              onChangeText={(text)=>{
                settingNewPw('memPw', text);
                setErrorMsg({
                  ...errorMsg,
                  memPw: handleErrorMsg('memPw', text, newPw)
                });
              }} 
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}   
              />
              {errorMsg.memPw && <Text style={styles.errorText}>{errorMsg.memPw}</Text>}
          </View>

          <View style={{marginBottom: 13}}>
            <Input 
              name="confirmPw"
              value={newPw.confirmPw}
              label="비밀번호 확인"
              isPw={true}
              placeholder="비밀번호를 다시 입력하세요"
              onChangeText={(text) => {
                settingNewPw('confirmPw', text);
                setErrorMsg({
                  ...errorMsg,
                  confirmPw: handleErrorMsg('confirmPw', text, newPw)
                })
              }}
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}  
            />
             {errorMsg.confirmPw && <Text style={styles.errorText}>{errorMsg.confirmPw}</Text>}
          </View>

          <View>
            <Button 
              title="비밀번호 변경" 
              onPress={RenewingPw}
            />
          </View>

        </View>  

      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default renewalPw

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff', 
    paddingRight: 15,
    paddingLeft: 15,
  },
  label: { 
    fontSize: 16,
    color: colors.GRAY_700,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  }
})