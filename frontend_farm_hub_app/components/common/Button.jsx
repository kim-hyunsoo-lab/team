import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '@/constants/colorConstant'

const Button = ({title='버튼', size='large', onPress, ...props}) => {
  return (
    <Pressable 
      style={({pressed})=>[
        styles.buttonContainer, 
        styles.large, 
        styles[size], 
        pressed && styles.pressed
      ]}
      onPress={()=>onPress()}
      {...props}
    >
      <Text style={styles.btnTitle}>{title}</Text>
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
  }
})