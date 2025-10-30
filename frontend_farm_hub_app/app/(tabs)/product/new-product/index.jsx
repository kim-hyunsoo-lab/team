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

  // 할인가 계산 함수
  const calculateDiscountedPrice = (price, discountRate) => {
    return Math.floor(price * (1 - discountRate / 100))
  }

  // 상품 카드 렌더링
  const renderProductCard = ({ item }) => {
    const imageUrl = item.imgList?.[0]?.attachedImgName
      ? `${SERVER_URL}/upload/${item.imgList[0].attachedImgName}`
      : null

    const discountedPrice = calculateDiscountedPrice(item.price, item.discountRate || 0)

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
          {/* 할인율 배지 */}
          {item.isOnSale && item.discountRate > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{item.discountRate}% 할인</Text>
            </View>
          )}
        </View>
        {/* 상품 정보 */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.itemName}</Text>
          {/* 할인가와 원가 표시 */}
          <View style={styles.priceContainer}>
            {item.isOnSale && item.discountRate > 0 ? (
              <>
                <Text style={styles.originalPrice}>{item.price?.toLocaleString()}원</Text>
                <Text style={styles.productPrice}>{discountedPrice.toLocaleString()}원</Text>
              </>
            ) : (
              <Text style={styles.productPrice}>{item.price?.toLocaleString()}원</Text>
            )}
          </View>
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
    position: 'relative',
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
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  priceContainer: {
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'brown',
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