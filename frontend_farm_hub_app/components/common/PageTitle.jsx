import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const PageTitle = ({title='제목'}) => {
  return (
    <Text
      style={styles.pageTitle}
    >
      <FontAwesome6 name="cow" size={20} color="brown" /> {title}
    </Text>
  )
}

export default PageTitle

const styles = StyleSheet.create({
  pageTitle : {
    borderTopColor : 'brown',
    borderTopWidth : 2,
    width : 150,
    marginHorizontal : 0,
    marginVertical : 15,
    paddingLeft : 5,
    color : 'brown',
    paddingTop : 5,
    fontSize : 20
  }
})