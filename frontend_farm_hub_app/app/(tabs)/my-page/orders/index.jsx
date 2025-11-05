import { View, Text, StyleSheet, ScrollView, Alert, Keyboard, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import dayjs from 'dayjs';
import PageTitle from '@/components/common/PageTitle';
import Button from '@/components/common/Button';
import { SERVER_URL } from '@/constants/appConst';
import { TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BuyList = () => {
  const router = useRouter();
  const [buyList, setBuyList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [reloading, setReloading] = useState(0);

  // 로그인 정보 가져오기
  useEffect(() => {
    const getLoginInfo = async () => {
      try {
        const loginInfo = await SecureStore.getItemAsync('loginInfo');
        if (loginInfo) {
          const loginData = JSON.parse(loginInfo);
          setUserInfo(loginData);
        } else {
          Alert.alert('알림', '로그인이 필요합니다.', [
            {
              text: '확인',
              onPress: () => router.push('/auth/login'),
            },
          ]);
        }
      } catch (error) {
        console.error('로그인 정보 파싱 에러:', error);
      }
    };
    getLoginInfo();
  }, []);

  // 구매 목록 조회
  useEffect(() => {
    if (!userInfo?.memId) return;
    
    const fetchBuyList = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/buy/${userInfo.memId}`);
        setBuyList(res.data);
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchBuyList();
  }, [userInfo, reloading]);

  // 총 금액 계산
  const getTotalAmount = () => {
    return buyList.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  // 주문 취소
  const deleteBuyItem = (buyNum) => {
    Alert.alert("확인", "해당 주문을 취소하시겠습니까?", [
      { text: "아니오", style: "cancel" },
      {
        text: "예",
        style: "destructive",
        onPress: () => {
          axios
            .delete(`${SERVER_URL}/buy/${buyNum}`)
            .then(() => {
              Alert.alert("성공", "주문이 취소되었습니다.");
              setReloading(reloading+500)
            })
            .catch(() => {
              Alert.alert("오류", "삭제 중 오류가 발생했습니다.");
            });
        },
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <PageTitle title='주문목록' />        
          {/* 테이블 헤더 */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.nameCell]}>상품명</Text>
            <Text style={[styles.headerCell, styles.priceCell]}>가격</Text>
            <Text style={[styles.headerCell, styles.qtyCell]}>수량</Text>
            <Text style={[styles.headerCell, styles.totalCell]}>총 구매 가격</Text>
            <Text style={[styles.headerCell, styles.dateCell]}>구매일</Text>
            <Text style={[styles.headerCell, styles.cancelCell]}>주문취소</Text>
          </View>

          {/* 테이블 바디 */}
        <ScrollView style={styles.scrollView}>
          {buyList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>주문 내역이 없습니다.</Text>
            </View>
          ) : (
            buyList.map((e, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.cell, styles.nameCell]}>{e.itemDTO.itemName}</Text>
                <Text style={[styles.cell, styles.priceCell]}>
                  {e.itemDTO.price.toLocaleString()}원
                </Text>
                <Text style={[styles.cell, styles.qtyCell]}>{e.buyCnt}개</Text>
                <Text style={[styles.cell, styles.totalCell]}>
                  {e.totalPrice.toLocaleString()}원
                </Text>
                <Text style={[styles.cell, styles.dateCell]}>
                  {dayjs(e.buyDate).format('YYYY.MM.DD')}
                </Text>
                <View style={[styles.cancelCell]}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => deleteBuyItem(e.buyNum)}
                  >
                    <Text style={styles.cancelButtonText}>주문취소</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* 총 금액 - 고정 */}
        {buyList.length > 0 && (
          <View style={styles.totalSummary}>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>총 주문 금액</Text>
              <Text style={styles.totalAmount}>
                {getTotalAmount().toLocaleString()}원
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default BuyList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10, 
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 10, 
    borderBottomWidth: 2,
    borderBottomColor: '#dee2e6',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10, 
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cell: {
    fontSize: 11, 
    textAlign: 'center', 
    color: '#212529',
  },
  headerCell: {
    fontSize: 11, 
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center', 
  },
  nameCell: {
    flex: 2.1, 
    textAlign: 'left', 
    paddingRight: 5,
  },
  priceCell: {
    flex: 1.2,
    textAlign: 'center', 
  },
  qtyCell: {
    flex: 0.6, 
    textAlign: 'center',
  },
  totalCell: {
    flex: 1.2,
    textAlign: 'center',
  },
  dateCell: {
    flex: 1.4, 
    fontSize: 10, 
    textAlign: 'center',
  },
  cancelCell: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  totalSummary: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  totalBox: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#198754',
  },
  cancelButton: {
    width: 45, 
    height: 24, 
    backgroundColor: '#6c757d',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 10, 
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
});