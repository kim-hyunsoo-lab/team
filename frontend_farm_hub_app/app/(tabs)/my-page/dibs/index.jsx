import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import { useIsFocused } from '@react-navigation/native';

// ✅ 컨텍스트 루트 제거: 호스트만 남깁니다.
const HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://192.168.0.50:8080';

axios.defaults.baseURL = HOST;
axios.defaults.timeout = 10000;
// 세션 기반이면 필요 (백엔드 CORS에 allowCredentials 설정 필요)
axios.defaults.withCredentials = true;

const DibsScreen = ({ navigation }) => {
  const [dibsList, setDibsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) fetchDibsList();
  }, [isFocused]);

  const fetchDibsList = async () => {
    try {
      setLoading(true);
      // 🟢 GET /dibs (컨트롤러 @RequestMapping("/dibs"))
      const res = await axios.get('/dibs');
      setDibsList(res.data);
    } catch (error) {
      console.error('찜 목록 불러오기 오류:', error?.response || error);
      Alert.alert('오류', '찜 목록을 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckItem = (dibsNum) => {
    setCheckedItems((prev) =>
      prev.includes(dibsNum) ? prev.filter((n) => n !== dibsNum) : [...prev, dibsNum],
    );
  };

  const handleSelectAll = () => {
    if (checkedItems.length === dibsList.length) {
      setCheckedItems([]);
    } else {
      setCheckedItems(dibsList.map((item) => item.dibsNum));
    }
  };

  // 🟢 선택 삭제: DELETE /dibs?dibsNumList=1&dibsNumList=2...
  const handleDeleteSelected = async () => {
    if (checkedItems.length === 0) {
      Alert.alert('알림', '삭제할 항목을 선택하세요.');
      return;
    }
    try {
      const params = new URLSearchParams();
      checkedItems.forEach((num) => params.append('dibsNumList', num));
      await axios.delete(`/dibs?${params.toString()}`);
      Alert.alert('성공', '선택한 항목이 삭제되었습니다.');
      await fetchDibsList();
      setCheckedItems([]);
    } catch (error) {
      console.error('선택삭제 오류:', error?.response || error);
      Alert.alert('오류', '선택한 항목 삭제 중 문제가 발생했습니다.');
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      // 프로젝트별 장바구니 경로 확인 필요 (임시: 기존대로)
      await axios.post('/api/carts', { itemNum: item.itemDTO.itemNum, itemCnt: 1 });
      Alert.alert('성공', '상품이 장바구니에 담겼습니다.');
    } catch (error) {
      console.error('장바구니 추가 오류:', error?.response || error);
      Alert.alert('오류', '장바구니 추가 중 문제가 발생했습니다.');
    }
  };

  const renderItem = ({ item }) => {
    const imageUrl = item.itemDTO?.imgList?.[0]
      ? `${HOST}/upload/${item.itemDTO.imgList[0].attachedImgName}`
      : null;

    return (
      <View style={styles.itemContainer}>
        <Checkbox
          value={checkedItems.includes(item.dibsNum)}
          onValueChange={() => handleCheckItem(item.dibsNum)}
          style={styles.checkbox}
        />
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.itemImage} />}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.itemDTO.itemName}</Text>
          <Text style={styles.itemPrice}>{item.itemDTO.price.toLocaleString()}원</Text>
          <View style={styles.itemButtons}>
            <TouchableOpacity style={styles.cartButton} onPress={() => handleMoveToCart(item)}>
              <Text style={styles.buttonText}>장바구니</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={async () => {
                try {
                  // 🟢 개별 삭제: DELETE /dibs/{dibsNum}
                  await axios.delete(`/dibs/${item.dibsNum}`);
                  await fetchDibsList();
                } catch (error) {
                  console.error('개별 삭제 오류:', error?.response || error);
                }
              }}
            >
              <Text style={styles.buttonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dibsList}
        keyExtractor={(item) => item.dibsNum.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.selectAllContainer}>
            <Checkbox
              value={checkedItems.length === dibsList.length && dibsList.length > 0}
              onValueChange={handleSelectAll}
            />
            <Text style={styles.selectAllText}>전체 선택</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.actions}>
            <TouchableOpacity style={styles.deleteButtonLarge} onPress={handleDeleteSelected}>
              <Text style={styles.buttonText}>선택 삭제</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default DibsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  selectAllContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  selectAllText: { marginLeft: 5 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10,
  },
  itemImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { marginTop: 4, color: '#555' },
  itemButtons: { flexDirection: 'row', marginTop: 6 },
  cartButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 5, marginRight: 8 },
  deleteButton: { backgroundColor: '#E53935', padding: 8, borderRadius: 5 },
  deleteButtonLarge: { backgroundColor: '#E53935', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  checkbox: { marginRight: 8 },
  actions: { marginTop: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
