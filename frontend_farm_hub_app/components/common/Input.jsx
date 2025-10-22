import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../constants/colorConstant';

const Input = ({label='', isPW=false, ...props}) => {
  const [focus, setFocus] = useState(false);

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput 
        style={[styles.input, focus && styles.focused]} 
        onFocus={() => setFocus(true)}        
        onBlur={()=>setFocus(false)}
        secureTextEntry={isPW}
        {...props}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  input: {
    borderColor: colors.BROWN_LIGHT,
    borderWidth: 1,
    height: 42,
    borderRadius: 7,
    paddingHorizontal: 10
  },

  label: {
    marginBottom: 6,
    fontSize: 16,
    color: colors.GRAY_500
  },

  focused: {
    borderColor: colors.BROWN
  }
})