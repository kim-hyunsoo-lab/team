import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import dayjs from 'dayjs'
import { SERVER_URL } from '../../../../../constants/appConst'

const Info = ({ itemDetail }) => {
  // 서브 이미지들 필터링 (메인이 아닌 이미지)
  const subImages = itemDetail?.imgList?.filter(img => img.isMain === 'N') || []

  return (
    <View style={styles.container}>
      {/* 서브 이미지들 */}
      <View style={styles.imgDiv}>
        {subImages.map((img, i) => (
          <Image
            key={i}
            source={{ uri: `${SERVER_URL}/upload/${img.attachedImgName}` }}
            style={styles.subImg}
          />
        ))}
      </View>

      {/* 상품 상세설명 제목 */}
      <Text style={styles.sectionTitle}>상품 상세설명</Text>

      {/* 상세 정보 테이블 */}
      <View style={styles.detailTable}>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableLabelText}>상품명</Text>
          </View>
          <View style={styles.tableValueCell}>
            <Text style={styles.tableValueText}>{itemDetail?.itemName}</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableLabelText}>상품 소개</Text>
          </View>
          <View style={styles.tableValueCell}>
            <Text style={styles.tableValueText}>{itemDetail?.itemIntro}</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableLabelText}>등록일</Text>
          </View>
          <View style={styles.tableValueCell}>
            <Text style={styles.tableValueText}>
              {itemDetail?.regDate ? dayjs(itemDetail.regDate).format('YYYY년 MM월 DD일') : ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Info

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgDiv: {
    marginBottom: 25,
  },
  subImg: {
    width: '100%',
    height: 1500,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 25,
  },
  detailTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#aaaaaa',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#aaaaaa',
  },
  tableCell: {
    flex: 3,
    backgroundColor: '#eeeeee',
    padding: 15,
    borderRightWidth: 1,
    borderRightColor: '#aaaaaa',
  },
  tableLabelText: {
    fontSize: 15,
    fontWeight: '500',
  },
  tableValueCell: {
    flex: 7,
    padding: 15,
  },
  tableValueText: {
    fontSize: 15,
  },
})