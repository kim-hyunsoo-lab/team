import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageTitle from "@/components/common/PageTitle";

const CartScreen = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 로그인 정보 가져오기 및 장바구니 데이터 로드
  useEffect(() => {
    const getCartData = async () => {
      try {
        // SecureStore에서 로그인 정보 가져오기
        const loginInfo = await SecureStore.getItemAsync("loginInfo");

        if (loginInfo) {
          const parsedUserInfo = JSON.parse(loginInfo);
          setUserInfo(parsedUserInfo);
          console.log("로그인 정보:", parsedUserInfo);

          // 장바구니 데이터 가져오기
          const response = await 
          axios.get(`api/carts/${parsedUserInfo.memId}`);
          console.log("장바구니 데이터:", response.data);
          setData(response.data);
        } else {
          console.log("로그인 정보가 없습니다");
          Alert.alert(
            "로그인 필요",
            "장바구니를 이용하려면 로그인이 필요합니다.",
            [
              {
                text: "로그인하기",
                onPress: () => router.push("/auth/login"),
              },
              {
                text: "취소",
                onPress: () => router.back(),
                style: "cancel",
              },
            ]
          );
        }
      } catch (error) {
        console.log("데이터 로드 실패:", error);

        // 401 에러 (인증 실패)인 경우 로그인 페이지로 이동
        if (error.response && error.response.status === 401) {
          Alert.alert(
            "인증 만료",
            "로그인이 만료되었습니다. 다시 로그인해주세요.",
            [
              {
                text: "로그인하기",
                onPress: () => {
                  // 만료된 로그인 정보 삭제
                  SecureStore.deleteItemAsync("loginInfo");
                  router.push("/auth/login");
                },
              },
            ]
          );
        } else {
          Alert.alert("오류", "장바구니 데이터를 불러오는데 실패했습니다.");
        }
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
          <PageTitle title="장바구니" titleSize={200} />
          {userInfo && (
            <Text style={styles.userText}>{userInfo.memName}님의 장바구니</Text>
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
              <View style={styles.itemRow}>
                <View style={styles.headerCell}>
                  <Text>☐</Text>
                </View>
                <View style={[styles.headerCell, styles.flex2]}>
                  <Text style={styles.itemName}>{item.itemName}</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text>{item.cartCnt || item.quantity || 1}</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text>{item.price?.toLocaleString() || "0"}원</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text>
                    {(
                      (item.price || 0) * (item.cartCnt || item.quantity || 1)
                    ).toLocaleString()}
                    원
                  </Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.deleteText}>삭제</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyText}>장바구니가 비어있습니다</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
  },
  userText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderTopWidth: 2,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  flex2: {
    flex: 2,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  cartItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
  },
  deleteText: {
    color: "#ff4444",
    fontSize: 12,
  },
  emptyCart: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
