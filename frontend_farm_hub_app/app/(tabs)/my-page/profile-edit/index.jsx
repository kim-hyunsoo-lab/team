import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import PageTitle from '@/components/common/PageTitle';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { SERVER_URL } from '@/constants/appConst';
import { TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { colors } from '@/constants/colorConstant';

const ProfileEditPage = () => {
  const router = useRouter(); 
  const [userInfo, setUserInfo] = useState(null);
  const [update, setUpdate] = useState(0);
  
  // 로그인 정보 가져오기
  useEffect(() => {
    const getLoginInfo = async () => {
      try {
        const loginInfo = await SecureStore.getItemAsync('loginInfo');
        if (loginInfo) {
          const loginData = JSON.parse(loginInfo);
          setUserInfo(loginData);
        } else {
          Alert.alert('알림', '로그인이 필요합니다.', [
            {
              text: '확인',
              onPress: () => router.push('/auth/login'),
            },
          ]);
        }
      } catch (error) {
        console.error('로그인 정보 파싱 에러:', error);
      }
    };
    getLoginInfo();
  }, []);

  // 회원정보 조회 결과를 저장할 state 변수
  const [selectMember, setSelectMember] = useState({
    memName: "",
    memPw: "",
    confirmPw: "",
    memTel: ["", "", ""],
    memAddr: "",
    addrDetail: "",
    memEmail: "",
    firstEmail: "",
    secondEmail: "",
  });

  // 회원 정보 조회
  useEffect(() => {
    if (!userInfo?.memId) return;
    
    const fetchProfileList = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/members/select/${userInfo.memId}`);        
        console.log(res.data);
        // 연락처와 이메일을 분리하여 state에 저장
        const phone = res.data.memTel.split("-");
        const email = res.data.memEmail.split("@");

        setSelectMember({
          ...res.data,
          memTel: phone,
          firstEmail: email[0],
          secondEmail: "@" + email[1],
          confirmPw: "",
        });      
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchProfileList();
  }, [userInfo, update]);

  // 유효성 검사 결과 에러 메세지를 출력할 state 변수
  const [errorMsg, setErrorMsg] = useState({
    memPw: "",
    confirmPw: "",
    memTel: "",
    memEmail: "",
    memAddr: "",
  });

  // 각 필드별 실시간 검증 함수
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "memPw":
        if (!value) {
          error = "비밀번호를 입력해주세요.";
        } else if (value.length < 8 || value.length > 12) {
          error = "비밀번호는 8-12자 사이여야 합니다.";
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(value)) {
          error = "영문과 숫자를 모두 포함해야 합니다.";
        }
        break;

      case "confirmPw":
        if (!value) {
          error = "비밀번호 확인을 입력해주세요.";
        } else if (value !== selectMember.memPw) {
          error = "비밀번호가 일치하지 않습니다.";
        }
        break;

      case "firstEmail":
        if (!value) {
          error = "이메일을 입력해주세요.";
        }
        break;

      case "secondEmail":
        if (!value) {
          error = "이메일 도메인을 선택해주세요.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // onChange 핸들러 - 일반 input
  const handleInputChange = (name, value) => {
    setSelectMember({ ...selectMember, [name]: value });

    // 실시간 검증
    const error = validateField(name, value);
    setErrorMsg({ ...errorMsg, [name]: error });

    // 비밀번호 변경 시 confirmPw도 다시 검증
    if (name === 'memPw' && selectMember.confirmPw) {
      const confirmError =
        value !== selectMember.confirmPw ? '비밀번호가 일치하지 않습니다.' : '';
      setErrorMsg((prev) => ({
        ...prev,
        memPw: error,
        confirmPw: confirmError,
      }));
    }
  };

  // 연락처 변경 핸들러
  const handleTelChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');

    const newTel = [...selectMember.memTel];
    newTel[index] = numericValue;
    setSelectMember({ ...selectMember, memTel: newTel });

    let error = '';
    if (newTel.some((part) => part === '')) {
      error = '연락처를 모두 입력해주세요.';
    }
    setErrorMsg({ ...errorMsg, memTel: error });
  };

  // 취소 버튼
  const handleCancel = () => {
    Alert.alert('확인', '수정을 취소하시겠습니까?', [
      { text: '아니오', style: 'cancel' },
      {
        text: '예',
        onPress: () => {
          router.back(); 
        },
      },
    ]);
  };

  // 확인 버튼
  const handleConfirm = () => {
    // 최종 유효성 검사
    const errors = {};

    if (!selectMember.memPw) {
      errors.memPw = '비밀번호를 입력해주세요.';
    }
    if (!selectMember.confirmPw) {
      errors.confirmPw = '비밀번호 확인을 입력해주세요.';
    }
    if (selectMember.memPw !== selectMember.confirmPw) {
      errors.confirmPw = '비밀번호가 일치하지 않습니다.';
    }
    if (selectMember.memTel.some((part) => part === '')) {
      errors.memTel = '연락처를 모두 입력해주세요.';
    }
    if (!selectMember.firstEmail || !selectMember.secondEmail) {
      errors.memEmail = '이메일을 입력해주세요.';
    }

    if (Object.keys(errors).length > 0) {
      setErrorMsg({ ...errorMsg, ...errors });
      Alert.alert('오류', '입력값을 확인해주세요.');
      return;
    }

    // 서버로 전송할 데이터 준비
    const updatedMember = {
      ...selectMember,
      memTel: selectMember.memTel.join('-'),
      memEmail: selectMember.firstEmail + selectMember.secondEmail,
    };

    axios
      .put(`${SERVER_URL}/members/update/${userInfo.memId}`, updatedMember)
      .then((res) => {
        console.log('수정 성공:', res.data);
        Alert.alert('완료', '회원정보가 수정되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              router.push('/my-page');
            }
          }
        ]);
      })
      .catch((error) => {
        console.log('수정 실패:', error);
        Alert.alert('오류', '회원정보 수정에 실패했습니다.');
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView style={styles.scrollView}>
            <PageTitle title="나의 정보" />

            {/* 안내 문구 */}
            <View style={styles.header}>
              <Text style={styles.headerText}>
                안전한 배송 안내를 위하여 연락처와 이메일 주소를 필히 확인 부탁드립니다.
              </Text>
              <Text style={styles.subTitle}>필수 회원 정보</Text>
            </View>

            {/* 회원 정보 폼 */}
            <View style={styles.formContainer}>
              {/* 이름 */}
              <View style={styles.row}>
                <Text style={styles.label}>이름</Text>
                <Text style={styles.value}>{userInfo?.memName}</Text>
              </View>

              {/* 아이디 */}
              <View style={styles.row}>
                <Text style={styles.label}>아이디</Text>
                <Text style={styles.value}>{userInfo?.memId}</Text>
              </View>

              {/* 비밀번호 */}
              <View style={styles.row}>
                <Text style={styles.label}>비밀번호</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    name="memPw"
                    value={selectMember.memPw}
                    onChangeText={(text) => handleInputChange('memPw', text)}
                    placeholder="비밀번호 입력"
                    isPw={true}
                  />
                  <Text style={styles.hint}>영문과 숫자 12자리 이하만 가능합니다.</Text>
                  {errorMsg.memPw && <Text style={styles.errorText}>{errorMsg.memPw}</Text>}
                </View>
              </View>

              {/* 비밀번호 확인 */}
              <View style={styles.row}>
                <Text style={styles.label}>비밀번호 확인</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    name="confirmPw"
                    value={selectMember.confirmPw}
                    onChangeText={(text) => handleInputChange('confirmPw', text)}
                    placeholder="비밀번호 재입력"
                    isPw={true}
                  />
                  <Text style={styles.hint}>비밀번호를 한번 더 입력해주세요.</Text>
                  {errorMsg.confirmPw && <Text style={styles.errorText}>{errorMsg.confirmPw}</Text>}
                </View>
              </View>

              {/* 연락처 */}
              <View style={styles.row}>
                <Text style={styles.label}>연락처</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.telContainer}>
                    <Input
                      containerStyle={{ flex: 1 }}
                      value={selectMember.memTel[0]}
                      onChangeText={(text) => handleTelChange(0, text)}
                      placeholder="010"
                      keyboardType="number-pad"
                      maxLength={3}
                    />
                    <Text style={styles.dash}>-</Text>
                    <Input
                      containerStyle={{ flex: 1 }}
                      value={selectMember.memTel[1]}
                      onChangeText={(text) => handleTelChange(1, text)}
                      placeholder="1234"
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                    <Text style={styles.dash}>-</Text>
                    <Input
                      containerStyle={{ flex: 1 }}
                      value={selectMember.memTel[2]}
                      onChangeText={(text) => handleTelChange(2, text)}
                      placeholder="5678"
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                  </View>
                  <Text style={styles.hint}>숫자만 입력 가능합니다.</Text>
                  {errorMsg.memTel && <Text style={styles.errorText}>{errorMsg.memTel}</Text>}
                </View>
              </View>

              {/* 이메일 */}
              <View style={styles.row}>
                <Text style={styles.label}>이메일</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.emailContainer}>
                    <Input
                      containerStyle={{ flex: 1.2 }}
                      name="firstEmail"
                      value={selectMember.firstEmail}
                      onChangeText={(text) => handleInputChange('firstEmail', text)}
                      placeholder="이메일"
                    />
                    <Text style={styles.at}>@</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={selectMember.secondEmail}
                        onValueChange={(value) => handleInputChange('secondEmail', value)}
                        style={styles.picker}
                      >
                        <Picker.Item label="선택" value="" />
                        <Picker.Item label="gmail.com" value="@gmail.com" />
                        <Picker.Item label="naver.com" value="@naver.com" />
                        <Picker.Item label="hanmail.net" value="@hanmail.net" />
                      </Picker>
                    </View>
                  </View>
                  {errorMsg.memEmail && <Text style={styles.errorText}>{errorMsg.memEmail}</Text>}
                </View>
              </View>

              {/* 주소 */}
              <View style={styles.row}>
                <Text style={styles.label}>주소</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.addressContainer}>
                    <Input
                      style={styles.addressInput}
                      value={selectMember.memAddr}
                      placeholder="주소 검색"
                      editable={false}
                    />
                    <Button 
                      title="검색" 
                      onPress={() => Alert.alert('알림', '주소 검색 기능은 준비중입니다.')}
                      style={styles.searchButton}
                    />
                  </View>
                </View>
              </View>

              {/* 상세주소 */}
              <View style={styles.row}>
                <Text style={styles.label}>상세주소</Text>
                <View style={styles.inputWrapper}>
                  <Input
                    name="addrDetail"
                    value={selectMember.addrDetail}
                    onChangeText={(text) => handleInputChange('addrDetail', text)}
                    placeholder="상세주소 입력"
                  />
                </View>
              </View>
            </View>

            {/* 버튼 */}
            <View style={styles.buttonContainer}>
              <View style={styles.buttonWrapper}>
                <Button title="취소" onPress={handleCancel} bgColor="#6c757d" />
              </View>
              <View style={styles.buttonWrapper}>
                <Button title="확인" onPress={handleConfirm} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default ProfileEditPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
  },
  label: {
    width: 100,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    paddingTop: 12,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    paddingTop: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  hint: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
  },
  errorText: {
    fontSize: 11,
    color: 'red',
    marginTop: 4,
  },
  telContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  telInput: {
    flex: 1,
  },
  dash: {
    fontSize: 16,
    color: '#333',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailInput: {
    flex: 1.2,
  },
  at: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    height: 45,
    justifyContent: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressInput: {
    flex: 1,
  },
  searchButton: {
    width: 70,
    height: 45,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 32,
    marginBottom: 40,
  },
  buttonWrapper: {
    flex: 1,
  },
});