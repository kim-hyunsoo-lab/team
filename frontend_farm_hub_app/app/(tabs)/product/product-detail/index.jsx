import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { SERVER_URL } from '../../../../constants/appConst';
import { colors } from '../../../../constants/colorConstant';
import Input from '../../../../components/common/Input'
import Button from '../../../../components/common/Button'
import { router, useLocalSearchParams } from 'expo-router';
import PageTitle from '../../../../components/common/PageTitle';
import Info from './info';
import Review from './review';
import Qna from './qna';
import QnA from './qna';

const ProductDetail = () => {
  const navigation = useNavigation();
  const { itemNum } = useLocalSearchParams();

  const [itemDetail, setItemDetail] = useState({});
  const [cnt, setCnt] = useState('1');
  const [activeTab, setActiveTab] = useState('intro');
  const [loading, setLoading] = useState(true);

  // 로그인 체크 공통 함수 (SecureStore 사용)
  const checkLogin = async (message = '로그인이 필요한 서비스입니다.') => {
    try {
      const loginData = await SecureStore.getItemAsync('loginInfo');
      if (!loginData || JSON.parse(loginData) === null) {
        Alert.alert('알림', message, [
          {
            text: '확인',
            onPress: () => router.push('/auth/login'),
          },
        ]);
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // 장바구니 버튼 클릭
  const insertCart = async () => {
    if (!(await checkLogin('장바구니는 로그인이 필요한 서비스입니다.'))) return;

    try {
      const loginData = await SecureStore.getItemAsync('loginInfo');
      const memId = JSON.parse(loginData).memId;

      const response = await axios.post(`${SERVER_URL}/carts`, {
        itemNum,
        cartCnt: parseInt(cnt),
        memId,
      });

      console.log(response.data);
      Alert.alert(
        '장바구니',
        '장바구니에 상품을 담았습니다.\n장바구니 페이지로 이동할까요?',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '확인',
            onPress: () => navigation.navigate('ShopCart'),
          },
        ]
      );
    } catch (error) {
      console.log(error);
      Alert.alert('오류', error.response?.data || '장바구니 추가 실패');
    }
  };

  // 구매 버튼 클릭
  const buyItem = async () => {
    if (!(await checkLogin('로그인해 주세요.'))) return;

    Alert.alert('구매 확인', '상품을 구매하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          try {
            const loginData = await SecureStore.getItemAsync('loginInfo');
            const memId = JSON.parse(loginData).memId;

            await axios.post(`${SERVER_URL}/buy`, {
              itemNum,
              memId,
              buyCnt: parseInt(cnt),
            });

            Alert.alert('구매 완료', '구매가 완료되었습니다.', [
              {
                text: '확인',
                onPress: () => navigation.navigate('BuyList'),
              },
            ]);
          } catch (error) {
            console.log(error);
            Alert.alert('오류', error.response?.data || '구매 실패');
          }
        },
      },
    ]);
  };

  // 상품 정보 가져오기
  const getItem = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/items/${itemNum}`);
      console.log(response.data);
      setItemDetail(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getItem();
  }, [itemNum]);

  // 메인 이미지 찾기
  const getMainImage = () => {
    if (itemDetail.imgList) {
      const mainImg = itemDetail.imgList.find((img) => img.isMain === 'Y');
      return mainImg
        ? `${SERVER_URL}/upload/${mainImg.attachedImgName}`
        : null;
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
      {/* 상품 정보 영역 */}
      <View style={styles.itemInfo}>
        <View style={styles.titleDiv}>
          <PageTitle title='상품 상세정보' titleSize={180} />
        </View>
        {/* 메인 이미지 */}
        <View style={styles.mainImgDiv}>
          {getMainImage() ? (
            <Image source={{ uri: getMainImage() }} style={styles.mainImg} />
          ) : (
            <View style={styles.noImage}>
              <Text>이미지 없음</Text>
            </View>
          )}
        </View>

        {/* 상품 소개 */}
        <View style={styles.itemIntro}>
          <Text style={styles.itemTitle}>{itemDetail.itemName}</Text>

          {/* 상품 정보 테이블 */}
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>판매가</Text>
              <Text style={styles.infoValue}>
                {itemDetail.price?.toLocaleString()}원
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>부위</Text>
              <Text style={styles.infoValue}>{itemDetail.part}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>원산지</Text>
              <Text style={styles.infoValue}>{itemDetail.origin}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>만족도 평균</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={18} color="#ffc107" />
                <Text style={styles.infoValue}> {itemDetail.reviewAvg}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>판매자</Text>
              <Text style={styles.infoValue}>{itemDetail.seller}</Text>
            </View>
          </View>

          {/* 수량 입력 */}
          <View style={styles.cartCnt}>
            <Input
              keyboardType="number-pad"
              value={cnt}
              onChangeText={setCnt}
            />
          </View>

          {/* 버튼들 */}
          <View style={styles.btns}>
            {/* 찜한상품 버튼 - 회색 */}
            <Button
              title='찜한상품'
              bgColor={colors.GRAY_500}
              style={styles.button}
            />
            {/* 장바구니 버튼 - 갈색 */}
            <Button
              title='장바구니'
              bgColor={colors.BROWN}
              onPress={insertCart}
              style={styles.button}
            />
            {/* 구매하기 버튼 - 녹색 */}
            <Button
              title='구매하기'
              bgColor={colors.GREEN}
              onPress={buyItem}
              style={styles.button}
            />
          </View>
        </View>
      </View>

      {/* 탭 메뉴 */}
      <View style={styles.detailMenuDiv}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'intro' && styles.activeTab]}
          onPress={() => setActiveTab('intro')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'intro' && styles.activeTabText,
            ]}
          >
            상품정보
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'review' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('review')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'review' && styles.activeTabText,
            ]}
          >
            이용후기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'qna' && styles.activeTab]}
          onPress={() => setActiveTab('qna')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'qna' && styles.activeTabText,
            ]}
          >
            상품문의
          </Text>
        </TouchableOpacity>
      </View>

      {/* 상세 내용 */}
      <View style={styles.details}>
        {activeTab === 'intro' && (
          <View style={styles.detailContent}>
            <Info itemDetail={itemDetail} />
          </View>
        )}
        {activeTab === 'review' && (
          <View style={styles.detailContent}>
            <Review />
          </View>
        )}
        {activeTab === 'qna' && (
          <View style={styles.detailContent}>
            <QnA />
          </View>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    padding: 20,
  },
  mainImgDiv: {
    width: '100%',
    height: 350,
    marginBottom: 20,
  },
  mainImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  noImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  itemIntro: {
    width: '100%',
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoTable: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingVertical: 15,
  },
  infoLabel: {
    width: '30%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoValue: {
    width: '70%',
    fontSize: 16,
    color: '#666',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  cartCnt: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  btns: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 45,
  },
  detailMenuDiv: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#eeeeee',
    borderBottomWidth: 2,
    borderBottomColor: colors.BROWN,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopColor: colors.BROWN,
    borderLeftColor: colors.BROWN,
    borderRightColor: colors.BROWN,
    borderBottomWidth: 0,
  },
  tabText: {
    fontSize: 16,
    color: colors.BROWN,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  details: {
    padding: 20,
    minHeight: 200,
  },
  detailContent: {
    paddingVertical: 20,
  },
  // detailTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 15,
  //   color: '#333',
  // },
  titleDiv: {
    marginBottom: 15
  }
});

export default ProductDetail;