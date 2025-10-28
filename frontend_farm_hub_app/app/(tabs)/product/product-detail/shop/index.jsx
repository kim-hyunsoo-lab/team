import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageTitle from '../../../../../components/common/PageTitle'
import { SERVER_URL } from '../../../../../constants/appConst'

const CartScreen = () => {
  const [data, setData] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  // 로그인 정보 가져오기 및 장바구니 데이터 로드
  useEffect(() => {
    const getCartData = async () => {
      try {
        // SecureStore에서 로그인 정보 가져오기
        const loginInfo = await SecureStore.getItemAsync('loginInfo');

        if (loginInfo) {
          const parsedUserInfo = JSON.parse(loginInfo);
          setUserInfo(parsedUserInfo);
          console.log('로그인 정보:', parsedUserInfo);

          // 장바구니 데이터 가져오기
          const response = await axios.get(`${SERVER_URL}/carts/${parsedUserInfo.memId}`);
          console.log('장바구니 데이터:', response.data);
          setData(response.data);
        } else {
          console.log('로그인 정보가 없습니다');
        }
      } catch (error) {
        console.log('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    getCartData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <PageTitle title='장바구니' titleSize={200} />
          {userInfo && (
            <Text style={styles.userText}>
              {userInfo.memName}님의 장바구니
            </Text>
          )}
        </View>

        {/* 테이블 헤더 */}
        <View style={styles.tableHeader}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>선택</Text>
          </View>
          <View style={[styles.headerCell, styles.flex2]}>
            <Text style={styles.headerText}>상품정보</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>수량</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>가격</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>합계</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>삭제</Text>
          </View>
        </View>

        {/* 장바구니 아이템 */}
        {data.length > 0 ? (
          data.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <Text>{item.itemName}</Text>
              {/* 여기에 장바구니 아이템 상세 정보를 추가할 수 있습니다 */}
            </View>
          ))
        ) : (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyText}>장바구니가 비어있습니다</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default CartScreen

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
  header: {
    padding: 20,
  },
  userText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderTopWidth: 2,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  flex2: {
    flex: 2,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emptyCart: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
})