import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colorConstant';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

const MyPageScreen = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  // 로그인 정보 가져오기
  useEffect(() => {
    const getLoginInfo = async () => {
      try {
        const loginInfo = await SecureStore.getItemAsync('loginInfo');
        if (loginInfo) {
          const loginData = JSON.parse(loginInfo);
          setUserInfo(loginData);
        } else {
          // 로그인 정보가 없으면 로그인 페이지로
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

  // 로그아웃
  const handleLogout = async () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          await SecureStore.deleteItemAsync('loginInfo');
          Alert.alert('알림', '로그아웃되었습니다.', [
            {
              text: '확인',
              onPress: () => router.push('/auth/login'),
            },
          ]);
        },
      },
    ]);
  };

// 메뉴 아이템 데이터
  const menuItems = [
    { id: 1, icon: <Ionicons name="receipt-outline" size={24} color="black" />, title: '주문목록', route: '/my-page/orders', disabled: false }, 
    { id: 2, icon: <Ionicons name="cart-outline" size={24} color="black" />, title: '장바구니', route: '/my-page/cart', disabled: true }, 
    { id: 3, icon: <Ionicons name="person-outline" size={24} color="black" />, title: '회원정보 수정', route: '/my-page/profile-edit', disabled: true },
    { id: 4, icon: <Ionicons name="location-outline" size={24} color="black" />, title: '배송지관리', route: '/my-page/address', disabled: true },
    { id: 5, icon: <AntDesign name="question-circle" size={24} color="black" />, title: '문의목록', route: '/my-page/qna', disabled: false },
    { id: 6, icon: <AntDesign name="message" size={24} color="black" />, title: '상품후기', route: '/my-page/reviews', disabled: false },
  ];

  // 메뉴 클릭 핸들러
  const handleMenuPress = (route) => {
    // Alert.alert('알림', `${route} 페이지로 이동합니다.\n(준비중)`);
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 사용자 정보 헤더 */}
        <View style={styles.userHeader}>
          <View style={styles.userIconContainer}>
            <Text style={styles.userIcon}>👤</Text>
          </View>
          <View style={styles.userInfoContainer}>
            {userInfo ? (
              <>
                <Text style={styles.userName}>{userInfo.memName || userInfo.memId}님</Text>
                <Text style={styles.userEmail}>{userInfo.memId}</Text>
              </>
            ) : (
              <Text style={styles.userName}>로그인이 필요합니다</Text>
            )}
          </View>
        </View>

        {/* 메뉴 그리드 (3x2) */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.route)}
            >
              <View style={styles.menuContent}>
                <View style={styles.menuIcon}>{item.icon}</View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  // 사용자 정보 헤더
  userHeader: {
    backgroundColor: colors.BROWN,
    padding: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  userIcon: {
    fontSize: 40,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  // 메뉴 그리드
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  menuItem: {
    width: '33.33%',
    aspectRatio: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingVertical: 30
  },
  menuContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  // 로그아웃 버튼
  logoutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logoutText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});