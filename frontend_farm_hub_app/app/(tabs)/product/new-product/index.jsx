import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { router } from 'expo-router'
import { SERVER_URL } from '../../../../constants/appConst'
import Menu from '../../../../components/Menu'
import { colors } from '../../../../constants/colorConstant'
import PageTitle from '../../../../components/common/PageTitle'

const NewProductList = () => {
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 서버에서 상품 데이터 가져오기
    axios.get(`${SERVER_URL}/items`)
      .then(res => {
        // 최근 등록순으로 정렬 (regDate 기준 내림차순)
        const sortedByDate = [...res.data].sort((a, b) => new Date(b.regDate) - new Date(a.regDate))
        setProductList(sortedByDate)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        setLoading(false)
      })
  }, [])

  // 상품 카드 렌더링
  const renderProductCard = ({ item }) => {
    const imageUrl = item.imgList?.[0]?.attachedImgName
      ? `${SERVER_URL}/upload/${item.imgList[0].attachedImgName}`
      : null

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/product-detail?itemNum=${item.itemNum}`)}
      >
        {/* 상품 이미지 */}
        <View style={styles.productImageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.productImage} />
          ) : (
            <View style={styles.noImage}>
              <Text style={{ color: '#999' }}>이미지 없음</Text>
            </View>
          )}
        </View>
        {/* 상품 정보 */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.itemName}</Text>
          <Text style={styles.productPrice}>{item.price?.toLocaleString()}원</Text>
          {item.reviewAvg > 0 && (
            <Text style={styles.rating}>
              ⭐ {item.reviewAvg.toFixed(1)} ({item.reviewCnt || 0})
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Menu activeMenu="new-product" />
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.BROWN} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Menu activeMenu="new-product" />
      <View style={styles.titleWrapper}>
        <PageTitle title='신상품' />
      </View>
      <FlatList
        data={productList}
        renderItem={renderProductCard}
        keyExtractor={item => item.itemNum.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  )
}

export default NewProductList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: 'rgb(255, 240, 220)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'brown',
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    paddingTop: 5,
    backgroundColor: '#fff',
  },
})