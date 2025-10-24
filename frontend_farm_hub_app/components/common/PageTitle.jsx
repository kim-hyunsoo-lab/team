import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const PageTitle = ({title='제목', titleSize=150}) => {
  return (
    <View
      style={[styles.pageTitleContainer, {width : titleSize}]}
    >
      <Text style={styles.pageTitle}>
        <FontAwesome6 name="cow" size={20} color="brown" /> {title}
      </Text>
    </View>
  )
}

export default PageTitle

const styles = StyleSheet.create({
  pageTitleContainer: {
    borderTopColor: 'brown',
    borderTopWidth: 2,
    paddingTop: 5,
  },
  pageTitle: {
    color: 'brown',
    fontSize: 20,
    paddingLeft: 5,
  }
})