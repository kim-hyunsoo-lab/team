import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios';
import { SERVER_URL } from '../../../constants/appConst';
import { useRouter } from 'expo-router'
import Button from '@/components/common/Button';
import * as SecureStore from 'expo-secure-store'

const ProductScreen = () => {
  //상품 정보를 저장할 state 변수
  const [newProductList, setNewProductList] = useState([]);
  const [popularProductList, setPopularProductList] = useState([]);
  const [discountProductList, setDiscountProductList] = useState([]);

  useEffect(() => {
    axios.get(`${SERVER_URL}/items`)
    .then(res => {
      console.log(res.data);
      // TODO: 실제 데이터 분류 로직 추가
      setNewProductList(res.data);
    })
    .catch(e => console.log(e));
  }, []);

  const renderProductCard = (product) => (
    <TouchableOpacity key={product.id} style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: product.image || 'https://via.placeholder.com/150' }}
          style={styles.productImage}
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productPrice}>{product.price?.toLocaleString()}원</Text>
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title, productList) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeMoreText}>더보기</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productListContainer}
      >
        {productList.map(product => renderProductCard(product))}
      </ScrollView>
    </View>
  );


    // 로그아웃 함수
  const logout = async () => {
    // SecureStore에 저장된 로그인 정보 삭제
    await SecureStore.deleteItemAsync('loginInfo');

    // 모든 스택 제거
    if (router.canDismiss()){ 
    router.dismissAll();} 

    // 첫 페이지로 이동
    router.replace('/product');
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>상품</Text>
        </View>

        {/* 신상품 섹션 */}
        {renderSection('신상품', newProductList)}

        {/* 인기상품 섹션 */}
        {renderSection('인기상품', popularProductList)}

        {/* 할인상품 섹션 */}
        {renderSection('할인상품', discountProductList)}
      </ScrollView>

      <Button title='로그아웃' onPress={()=>{logout()}} />
    </SafeAreaView>
  )
}

export default ProductScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeMoreText: {
    fontSize: 14,
    color: '#666',
  },
  productListContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  productCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  productInfo: {
    padding: 12,
    position: 'relative',
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
    color: '#2d9f5f',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
})