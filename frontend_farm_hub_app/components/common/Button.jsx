import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '@/constants/colorConstant'

const Button = ({title='버튼', size='large', onPress, disabled=false, ...props}) => {
  return (
    <Pressable 
      style={({pressed})=>[
        styles.buttonContainer, 
        styles[size], 
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled
      ]}
      onPress={disabled ? null : onPress}
      disabled={disabled}
      {...props}
    >
      <Text style={[
        styles.btnTitle,
        disabled && styles.disabledText
      ]}>
        {title}
      </Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.BROWN,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,    
    marginTop: 5    
  },
  btnTitle:{
    color: 'white', 
    fontSize: 14.5   
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
  },
  disabled:{
    backgroundColor: '#cccccc',
    opacity: 0.6
  },
  disabledText:{
    color: '#666666'
  }
})