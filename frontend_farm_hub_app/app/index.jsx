import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const loginInfo = await SecureStore.getItemAsync('loginInfo');
        
        if (loginInfo) {
          const loginData = JSON.parse(loginInfo);
          console.log('index.jsx - 로그인 정보:', loginData);
          
          if (loginData.memRole === 'ADMIN') {
            router.replace('/(tabs)/(home)');
          } else {
            router.replace('/(tabs)/product');
          }
        } else {
          router.replace('/(tabs)/product');
        }
      } catch (error) {
        console.error('index.jsx - 역할 확인 에러:', error);
        router.replace('/(tabs)/product');
      }
    };

    checkUserRole();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#8B4513" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});