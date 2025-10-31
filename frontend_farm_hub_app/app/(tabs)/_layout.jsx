import { StyleSheet, ActivityIndicator, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { Tabs, useFocusEffect, useRouter } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SecureStore from 'expo-secure-store';

const TabLayout = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [initialRouteSet, setInitialRouteSet] = useState(false);

  const getUserRole = useCallback(async () => {
    setIsLoading(true);
    try {
      const loginInfo = await SecureStore.getItemAsync('loginInfo');
      if (loginInfo) {
        const loginData = JSON.parse(loginInfo);
        console.log('_layout - 로그인 정보:', loginData);
        setUserRole(loginData.memRole);
      } else {
        console.log('_layout - 로그인 안 함 - USER로 설정');
        setUserRole('USER');
      }
    } catch (error) {
      console.error('_layout - 역할 확인 에러:', error);
      setUserRole('USER');
    } finally {
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await getUserRole();
      setInitialRouteSet(true);
    };
    initialize();
  }, [getUserRole]);

  useFocusEffect(
    useCallback(() => {
      if (initialRouteSet) {
        console.log('useFocusEffect 실행 (초기 설정 완료 후)');
        getUserRole();
      }
    }, [getUserRole, initialRouteSet])
  );

  if (!initialRouteSet || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  const isAdmin = userRole === 'ADMIN';
  console.log('현재 탭 상태 - userRole:', userRole, 'isAdmin:', isAdmin);


  return (
    <Tabs 
      screenOptions={{ headerShown: false }}
      // ✅ 초기 라우트 명시적 설정
      initialRouteName={isAdmin ? '(home)' : 'product'}
    >
      {/* 관리자 전용 탭 */}
      <Tabs.Screen 
        name='(home)'
        options={{
          href: isAdmin ? undefined : null, 
          title: 'Home',
          tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />
        }}
      />
      <Tabs.Screen 
        name='control'
        options={{
          href: isAdmin ? undefined : null, 
          title: 'Control',
          tabBarIcon: () => <FontAwesome name="gear" size={24} color="black" />
        }}
      />

      {/* alarm 탭 숨김 */}
      <Tabs.Screen 
        name='alarm'
        options={{
          href: null, // 완전히 숨김
        }}
      />

      {/* 공통 탭 (관리자 + 일반 유저) */}
      <Tabs.Screen 
        name='product'
        options={{
          title: 'Product',
          tabBarIcon: () => <FontAwesome name="shopping-cart" size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name='my-page'
        options={{
          title: 'My Page',
          tabBarIcon: () => <FontAwesome name='user' size={24} color="black" />
        }}
      />
    </Tabs>
  );
}

export default TabLayout;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});