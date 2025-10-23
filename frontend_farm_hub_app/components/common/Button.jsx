import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '@/constants/colorConstant'

// title: 버튼 텍스트
// size: 버튼 크기 ('large' | 'normal')
// bgColor: 배경색 (기본값: colors.BROWN)
// textColor: 텍스트 색상 (기본값: 'white')
// onPress: 클릭 시 실행할 함수
const Button = ({title='버튼', size='large', bgColor, textColor='white', onPress, style, ...props}) => {
  return (
    <Pressable
      style={({pressed})=>[
        styles.buttonContainer,
        styles[size],
        { backgroundColor: bgColor || colors.BROWN }, // props로 받은 색상 적용
        pressed && styles.pressed,
        style // 외부에서 전달된 추가 스타일
      ]}
      onPress={onPress}
      {...props}
    >
      <Text style={[styles.btnTitle, { color: textColor }]}>{title}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.BROWN,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnTitle:{
    fontSize: 14.5,
    fontWeight: '600'
  },
  large:{
    width: '100%',
    height: 34
  },
  normal:{
    width: '70%',
    height: 30
  },
  pressed:{
    opacity: 0.8
  }
})