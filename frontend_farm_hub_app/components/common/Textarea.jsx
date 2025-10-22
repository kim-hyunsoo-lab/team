import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../constants/colorConstant';

// 야매로 만든 Textarea 
const Textarea = ({
  label = '', 
  placeholder = '',
  numberOfLines = 5,
  maxLength = 500,
  showCounter = false,
  ...props  
}) => {
  const [focus, setFocus] = useState(false);  

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}            
      <TextInput 
        multiline
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        style={[styles.textarea, focus && styles.focused]} 
        onFocus={() => setFocus(true)}        
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        textAlignVertical="top"
        {...props} 
      />
      
      {showCounter && props.value && (
        <Text style={styles.counter}>
          {props.value.length} / {maxLength}
        </Text>
      )}
    </View>
  )
}

export default Textarea

const styles = StyleSheet.create({
  textarea: {
    borderColor: colors.BROWN_LIGHT,
    borderWidth: 1,
    height: 120,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
  },

  label: {
    marginBottom: 6,
    fontSize: 16,
    color: colors.GRAY_500
  },

  focused: {
    borderColor: colors.BROWN
  },

  counter: {
    textAlign: 'right',
    fontSize: 12,
    color: colors.GRAY_500,
    marginTop: 4
  }
})