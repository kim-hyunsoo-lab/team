import { Alert, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useRouter } from 'expo-router';
import Button from '@/components/common/Button';
import axios from 'axios';
import { SERVER_URL } from '@/constants/appConst';
import Input from '../../components/common/Input';
import Postcode from 'react-native-daum-postcode';
import { Keyboard } from 'react-native';
import handleErrorMsg from '@/validate/joinValidate';
import { colors } from '@/constants/colorConstant';
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from 'react-native';
import PageTitle from '@/components/common/PageTitle';
import { Pressable } from 'react-native';

const join = () => {
  const router = useRouter();
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

  // 일반 항목
  const handleInputChange = (name, value) => {
    setNewShopMember({
      ...newShopMember,
      [name]: value
    });
  };

  const regNewShopMember = async () => {
    try {
      const res = await axios.post(`${SERVER_URL}/members`, newShopMember); 
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
        setPwQ(res.data);
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchPwQuestions();
  }, []);
  
  return ( 
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <PageTitle title='회원가입' />
        <Pressable style={styles.joinLink} 
        onPress={()=>{if (router.canDismiss()) {
          router.dismissAll();}
          router.replace('/product');}}>
          <Text style={styles.joinText}>홈페이지</Text>
        </Pressable>
        <ScrollView style={{ flex: 5 , marginTop: 13}}>      
        <View>
          <View style={{flexDirection: 'row', gap: 10 , alignItems: 'flex-end' , marginBottom: 12}}>
            <View style={{ flex: 1 }}>              
              <Input                 
                name="memId" 
                value={newShopMember.memId} 
                label='아이디'
                placeholder="아이디를 입력하세요"
                onChangeText={(text) => {
                  setIsDisabledBtn(true);
                  handleInputChange('memId', text);
                  setErrorMsg({
                    ...errorMsg, 
                    memId: handleErrorMsg('memId', text, newShopMember)
                  });
                }}
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
              />     
            </View>
            <Button style={{ width: '30%', marginBottom: 5 }}   title='중복확인' onPress={checkId}/>
          </View>
            {errorMsg.memId ? <Text style={styles.errorText}>{errorMsg.memId}</Text> : null}
        <View style={{ marginBottom: 12 }}>
          <Input             
            name="memPw" 
            value={newShopMember.memPw} 
            label='비밀번호'
            isPw={true}
            placeholder="비밀번호를 입력하세요"
            onChangeText={(text) => {
              setIsDisabledBtn(true);
              handleInputChange('memPw', text);
              setErrorMsg({
                ...errorMsg, 
                memPw: handleErrorMsg('memPw', text, newShopMember)
              });
            }}
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}  
          />
          {errorMsg.memPw ? <Text style={styles.errorText}>{errorMsg.memPw}</Text> : null}
        </View>
        
        <View style={{ marginBottom: 12 }}>
          <Input 
            name="confirmPw" 
            value={newShopMember.confirmPw} 
            label='비밀번호 확인'
            isPw={true}
            placeholder="비밀번호를 다시 입력하세요"
            onChangeText={(text) => {
              handleInputChange('confirmPw', text);
              setErrorMsg({
                ...errorMsg, 
                confirmPw: handleErrorMsg('confirmPw', text, newShopMember)
              });
            }}
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}  
          />
          {errorMsg.confirmPw ? <Text style={styles.errorText}>{errorMsg.confirmPw}</Text> : null}
        </View>

        <View style={{ marginBottom: 12 }}>
          <Input 
            name="memName" 
            value={newShopMember.memName} 
            label='회원명'
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
          <Text style={styles.label}>연락처</Text>
          <View style={styles.telContainer}>
            <View style={styles.telInput}>
              <Input 
                name='memTelArr'
                label=''
                value={newShopMember.memTelArr[0]}
                onChangeText={(text) => {
                  setNewShopMember({
                    ...newShopMember,
                    memTelArr: [text, newShopMember.memTelArr[1], newShopMember.memTelArr[2]]
                  });
                }}
                placeholder="010"
                keyboardType="phone-pad"
                maxLength={3}              
                />
            </View>

            <Text style={styles.telSeparator}>-</Text>
            <View style={styles.telInput}>
              <Input 
                name='memTelArr'
                label=''
                value={newShopMember.memTelArr[1]}
                onChangeText={(text) => {
                  setNewShopMember({
                    ...newShopMember,
                    memTelArr: [newShopMember.memTelArr[0], text, newShopMember.memTelArr[2]]
                  });
                }}
                placeholder="1234"
                keyboardType="phone-pad"
                maxLength={4}
                />
            </View>

            <Text style={styles.telSeparator}>-</Text>
            <View style={styles.telInput}>
              <Input 
                name='memTelArr'
                label=''
                value={newShopMember.memTelArr[2]}
                onChangeText={(text) => {
                  setNewShopMember({
                    ...newShopMember,
                    memTelArr: [newShopMember.memTelArr[0], newShopMember.memTelArr[1], text]
                  });
                }}
                placeholder="5678"
                keyboardType="phone-pad"
                maxLength={4}
                />
            </View>
          </View>
        </View>


        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>이메일</Text>
          <View style={styles.telContainer}>
            <View style={styles.telInput}>
              <Input 
                name='firstEmail'
                label=''
                value={newShopMember.firstEmail}
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
                selectedValue={newShopMember.secondEmail}
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

            {/* 주소 입력 필드 */}
          <View style={{flexDirection: 'row', gap: 10 , alignItems: 'flex-end' , marginBottom: 12}}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={getAddressBook}>
                <Input
                  label="주소"
                  value={newShopMember.memAddr}
                  editable={false}
                  placeholder="주소를 검색하세요"
                  pointerEvents="none"
                  />
              </TouchableOpacity>
            </View>
            <Button style={{ width: '30%', marginBottom: 5 }}   title='검색' onPress={getAddressBook}/>
          </View>

        <View style={{ marginBottom: 12 }}>
          {/* 상세 주소 */}
          <Input
            label="상세 주소"
            value={newShopMember.addrDetail}
            onChangeText={(text) => handleInputChange('addrDetail', text)}
            placeholder="상세 주소를 입력하세요"
          />
        </View>

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

        <View style={{ marginBottom: 12 }}>
          {/* 비밀번호 찾기 */}
            <Text style={styles.label}>비밀번호 찾기 질문</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={newShopMember.pwKey}
                  onValueChange={(value) => {
                    handleInputChange('pwKey', value);
                    setIsDisabledBtn(true);
                    setErrorMsg({
                      ...errorMsg,
                      pwKey: handleErrorMsg('pwKey', value, newShopMember)
                    });
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
              {errorMsg.pwKey ? (
                <Text style={styles.errorText}>{errorMsg.pwKey}</Text>) : null}
          </View>

          <View style={{ marginBottom: 12 }}>
            <Input
              label="비밀번호 찾기 답변"
              value={newShopMember.pwAnswer}
              onChangeText={(text) => {
                handleInputChange('pwAnswer', text);
                setIsDisabledBtn(true);
                setErrorMsg({
                  ...errorMsg,
                  pwAnswer: handleErrorMsg('pwAnswer', text, newShopMember)
                });
              }}
              placeholder="답변을 입력하세요"/>            
            {errorMsg.pwAnswer ? (
              <Text style={styles.errorText}>{errorMsg.pwAnswer}</Text>
            ) : null}
            </View>
          </View>
        </ScrollView>
        <View style={{ flex: 0.15 }}>
          <Button disabled={isDisabledBtn} onPress={regNewShopMember} title='회원가입' />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default join

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#fff', 
      paddingRight: 15,
      paddingLeft: 15,
    },
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
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 4,
      marginBottom: 8,
    },
    label: { 
      marginBottom: 4,
      fontSize: 16,
      color: colors.GRAY_700,
      fontWeight: '600'
    },
    telContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    telInput: {
      flex: 1,
    },
    telSeparator: {
      fontSize: 16,
      color: colors.GRAY_500,
      paddingBottom: 8,
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
    joinLink: {
      alignItems: 'flex-end',
    },
    joinText: {
      textDecorationLine: 'underline'
    }

});