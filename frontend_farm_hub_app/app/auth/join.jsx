import { Alert, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router';
import Button from '@/components/common/Button';
import axios from 'axios';
import { SERVER_URL } from '@/constants/appConst';
import Input from '../../components/common/Input';
import Postcode from 'react-native-daum-postcode';

const join = () => {
  // 다음 주소록 npx expo install react-native-daum-postcode react-native-webview

  // 유효성 검사 결과 에러 메세지를 출력할 state 변수 
  const [errorMsg, setErrorMsg] = useState({
    'memId': '',
    'memPw': '',
    'confirmPw': '',
    'pwKey':'',
    'pwAnswer':''
  });

  // 회원가입 버튼 활성화 여부
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);

  // 회원가입시 입력한 내용을 저장할 변수
  const [newShopMember, setNewShopMember] = useState({
    'memId': '', // 아이디
    'memPw': '', // 비밀번호
    'confirmPw':'', // 비번확인

    'memName': '', // 이름
    'memTelArr':['', '', ''], // 연락처

    'firstEmail':'', // 이메일
    'secondEmail':'',
    'memEmail':'',

    'memAddr':'', // 주소
    'addrDetail':'',

    'pwKey': '',
    'pwAnswer':''
  })
  
  // 비밀번호 찾기 질문 목록 변수
  const [pwQ, setPwQ] = useState([]);

  // 이메일 앞부분 변경
  const handleFirstEmailChange = (text) => {
    setNewShopMember({
      ...newShopMember,
      firstEmail: text,
      memEmail: text + newShopMember.secondEmail
    });
  };

  // 이메일 뒷부분 변경
  const handleSecondEmailChange = (text) => {
    setNewShopMember({
      ...newShopMember,
      secondEmail: text,
      memEmail: newShopMember.firstEmail + text
    });
  };

  // 일반 필드 변경
  const handleInputChange = (name, value) => {
    setNewShopMember({
      ...newShopMember,
      [name]: value
    });
  };

  const regNewShopMember = async () => {
    try {
      const res = await axios.post(`${SERVER_URL}/members`, newShopMember);      
      if (res.data) {
        Alert.alert('회원가입 완료', '회원으로 등록되었습니다');        
        setNewShopMember({
          'memId': '',
          'memPw': '',
          'confirmPw': '',
          'memName': '',
          'memTelArr': ['', '', ''],
          'firstEmail': '',
          'secondEmail': '',
          'memEmail': '',
          'memAddr': '',
          'addrDetail': '',
          'pwKey': '',
          'pwAnswer': ''
        });
        
        if (router.canDismiss()) {
          router.dismissAll();
        }
        router.replace('/product');
      }
    } 
    catch (error) {
      console.error('회원가입 에러:', error);
      console.error('에러 상세:', error.response?.data);
      if (error.response) {
        Alert.alert('회원가입 실패', error.response.data?.message || '회원가입에 실패했습니다');
      } else {
        Alert.alert('오류', '서버와의 연결에 실패했습니다');
      }
    }
  };  
  
    // 아이디 중복여부 확인
  const checkId = async () => {
    if (!newShopMember.memId) {
      Alert.alert('입력 오류', '아이디를 입력해주세요');
      return;}

    try {
      const res = await axios.get(`${SERVER_URL}/members/${newShopMember.memId}`);
      
      if (res.data) {
        Alert.alert('사용 가능', '사용가능한 아이디입니다');
        setIsDisabledBtn(false);
      } else {
        Alert.alert('사용 불가', '사용할 수 없는 아이디입니다');
        setIsDisabledBtn(true);
      }
    } catch (error) {
      console.error('아이디 체크 에러:', error);
      
      if (error.response?.status === 404) {
        Alert.alert('사용 가능', '사용가능한 아이디입니다');
        setIsDisabledBtn(false);
      } else {
        Alert.alert('확인 실패', '아이디 확인에 실패했습니다');
        setIsDisabledBtn(true);
      }
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const getAddressBook = () => {
    setIsModalVisible(true);
  };

  const handleAddressComplete = (data) => {
    setNewShopMember({
      ...newShopMember,
      memAddr: data.address
    });
    setIsModalVisible(false);
  };

   useEffect(() => {
    const fetchPwQuestions = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/members/pw-question`);
        console.log(res.data);
        setPwQ(res.data);
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchPwQuestions();
  }, []);
  
  return (
    <TouchableWithoutFeedback>
      <SafeAreaView>
        <View>          
          <Input 
            name="memId" 
            value={newShopMember.memId} 
            label='아이디'
            placeholder="아이디를 입력하세요"
            onChangeText={(text) => {
              setLoginData({...loginData, memId: text});
            }}
            onSubmitEditing={() => {}} 
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
          />
            {/* 주소 입력 필드 */}
          <TouchableOpacity onPress={getAddressBook}>
            <Input
              label="주소"
              value={newShopMember.memAddr}
              editable={false}
              placeholder="주소를 검색하세요"
              pointerEvents="none"
            />
          </TouchableOpacity>

          {/* 상세 주소 */}
          <Input
            label="상세 주소"
            value={newShopMember.addrDetail}
            onChangeText={(text) => shopMemberReg('addrDetail', text)}
            placeholder="상세 주소를 입력하세요"
          />

          {/* 주소 검색 모달 */}
          <Modal
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.headerText}>주소 검색</Text>
                <TouchableOpacity 
                  onPress={() => setIsModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Postcode
                style={styles.postcode}
                jsOptions={{ animation: true }}
                onSelected={handleAddressComplete}
                onError={(error) => {
                  console.error('주소 검색 에러:', error);
                  Alert.alert('오류', '주소 검색에 실패했습니다');
                }}
              />
            </View>
          </Modal>

        </View>
        <View>
          <Button disabled={isDisabledBtn} onPress={regNewShopMember} title='회원가입' />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default join

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: '#dee2e6',
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    closeButton: {
      padding: 8,
    },
    closeText: {
      fontSize: 24,
      color: '#666',
    },
    postcode: {
      flex: 1,
    }
  });