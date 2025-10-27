import { Keyboard, StyleSheet, Switch, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import axios from 'axios'
import { SERVER_URL } from '../constants/appConst'


const fanControl = () => {

  //지정 온도를 저장할 state 변수
  const [temperature, setTemperature] = useState('');

  //지정 공기질을 저장할 state 변수
  const [airQuality, setAirQuality] = useState('');

  //지정 온도 저장 버튼 클릭 시 실행함수
  const regTemp = () => {
    console.log(1)
    axios.post(`${SERVER_URL}/decideTemp/${temperature}`)
    .then(res => alert('온도가 저장되었습니다.'))
    .catch((e) => console.log(e));
  }

  //지정 공기질 저장 버튼 클릭 시 실행함수
  const regAir = () => {
    console.log(1);
    axios.post()
    .then(res => alert('공기질이 저장되었습니다.'))
    .catch((e) => console.log(e));
  }

  //스위치의 on/off 상태를 관리하는 state 변수
  const [isEnabled, setIsEnabled] = useState(false);

  //스위치를 누를 때마다 현재 상태를 반전시키는 함수
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>상세 설정</Text>

        <View style={styles.card}>
          <Text style={styles.label}>선풍기를 돌릴 온도를 입력해주세요.</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Input 
                placeholder="온도 (°C)" 
                value={temperature}
                onChangeText={(text) => setTemperature(text)}  
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button 
                title='저장' 
                style={styles.button}
                onPress={() => regTemp()}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>환풍기를 돌릴 공기질을 입력해주세요.</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Input 
                placeholder="공기질 (ppm)" 
                value={airQuality}
                onChangeText={(text) => setAirQuality(text)}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button 
                title='저장' 
                style={styles.button} 
                onPress={() => regAir()}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.sectionTitle}>환기 팬 강제 제어</Text>
              <Text style={styles.switchSubtext}>
                {isEnabled ? '팬이 작동 중입니다' : '팬이 정지되어 있습니다'}
              </Text>
            </View>
            <Switch
              trackColor={{false: '#d1d5db', true: '#be5050ff'}}
              thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
              ios_backgroundColor="#d1d5db"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={styles.switch}
            />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default fanControl

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    color: '#4a5568',
    marginBottom: 12,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    height: 42,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchSubtext: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
})