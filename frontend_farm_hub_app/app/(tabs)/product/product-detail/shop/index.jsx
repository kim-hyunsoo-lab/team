import PageTitle from "@/components/common/PageTitle";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SERVER_URL } from "../../../../../constants/appConst";

const CartScreen = () => {
  const router = useRouter();

  // 장바구니 목록 조회
  const [cartList, setCartList] = useState([]);

  // 체크박스 선택 상태
  const [selectedItems, setSelectedItems] = useState([]);

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(0);

  // 로그인 정보 가져오기 및 장바구니 데이터 로드
  useEffect(() => {
    const getCartData = async () => {
      try {
        const loginInfo = await SecureStore.getItemAsync("loginInfo");

        if (loginInfo) {
          const parsedUserInfo = JSON.parse(loginInfo);
          setUserInfo(parsedUserInfo);
          console.log("로그인 정보:", parsedUserInfo);

          // 장바구니 데이터 가져오기
          const response = await axios.get(
            `${SERVER_URL}/carts/${parsedUserInfo.memId}`
          );
          console.log("장바구니 데이터:", response.data);
          setCartList(response.data);
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

        if (error.response && error.response.status === 401) {
          Alert.alert(
            "인증 만료",
            "로그인이 만료되었습니다. 다시 로그인해주세요.",
            [
              {
                text: "로그인하기",
                onPress: () => {
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
  }, [reloading]);

  // 수량 변경 함수 - 숫자 검증 추가
  const handleCntChange = (i, value) => {
    const updatedCartList = [...cartList];
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      updatedCartList[i].cartCnt = 1;
    } else {
      updatedCartList[i].cartCnt = numValue;
    }
    setCartList(updatedCartList);
  };

  // 수량 변경 버튼 클릭 함수
  const updateCartCnt = (cart) => {
    if (!cart.cartCnt || isNaN(cart.cartCnt) || cart.cartCnt < 1) {
      Alert.alert("알림", "유효한 수량을 입력해주세요.");
      return;
    }

    axios
      .put(`${SERVER_URL}/carts/${cart.cartNum}`, {
        cartCnt: Number(cart.cartCnt),
        memId: userInfo.memId,
        itemNum: cart.itemNum,
      })
      .then((res) => {
        console.log(res.data);
        Alert.alert("성공", "수량이 변경되었습니다.");
        setReloading(reloading + 1);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("오류", e.response?.data || "수량 변경에 실패했습니다.");
      });
  };

  // 총 구매 가격 계산 (체크된 상품만)
  const getTotalPrice = () => {
    return cartList
      .filter((cart) => selectedItems.includes(cart.cartNum))
      .reduce((sum, cart) => sum + cart.totalPrice, 0);
  };

  // 체크박스 값 변경 시 실행 함수
  const handleCheckbox = (cartNum) => {
    if (selectedItems.includes(cartNum)) {
      setSelectedItems(selectedItems.filter((num) => num !== cartNum));
    } else {
      setSelectedItems([...selectedItems, cartNum]);
    }
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedItems.length === cartList.length && cartList.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartList.map((cart) => cart.cartNum));
    }
  };

  // 개별 상품 삭제
  const deleteCartItem = (cartNum) => {
    Alert.alert("확인", "해당 상품을 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          axios
            .delete(`${SERVER_URL}/carts/${cartNum}`)
            .then(() => {
              Alert.alert("성공", "상품이 삭제되었습니다.");
              setCartList(cartList.filter((cart) => cart.cartNum !== cartNum));
              setSelectedItems(selectedItems.filter((num) => num !== cartNum));
            })
            .catch((e) => {
              console.log(e);
              Alert.alert("오류", "삭제 중 오류가 발생했습니다.");
            });
        },
      },
    ]);
  };

  // 선택 삭제
  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) {
      Alert.alert("알림", "삭제할 상품을 선택해주세요.");
      return;
    }

    Alert.alert(
      "확인",
      `선택한 ${selectedItems.length}개 상품을 삭제하시겠습니까?`,
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            Promise.all(
              selectedItems.map((cartNum) =>
                axios.delete(`${SERVER_URL}/carts/${cartNum}`)
              )
            )
              .then(() => {
                Alert.alert("성공", "선택한 상품이 삭제되었습니다.");
                setCartList(
                  cartList.filter(
                    (cart) => !selectedItems.includes(cart.cartNum)
                  )
                );
                setSelectedItems([]);
              })
              .catch((e) => {
                console.log(e);
                Alert.alert("오류", "삭제 중 오류가 발생했습니다.");
              });
          },
        },
      ]
    );
  };

  // 개별 상품 구매 함수 - 결제 페이지로 이동
  const buyItem = (cart) => {
    router.push({
      pathname: "/mypage/payment",
      params: {
        cartItems: JSON.stringify([cart]),
      },
    });
  };

  // 선택 상품 구매 함수 - 결제 페이지로 이동
  const buySelectedItems = () => {
    if (selectedItems.length === 0) {
      Alert.alert("알림", "구매할 상품을 선택해주세요.");
      return;
    }

    const selectedCartItems = cartList.filter((cart) =>
      selectedItems.includes(cart.cartNum)
    );

    router.push({
      pathname: "/mypage/payment",
      params: {
        cartItems: JSON.stringify(selectedCartItems),
      },
    });
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}년 ${month}월 ${day}일`;
  };

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
          <TouchableOpacity style={styles.headerCell} onPress={handleSelectAll}>
            <Text style={styles.checkboxText}>
              {selectedItems.length === cartList.length && cartList.length > 0
                ? "☑"
                : "☐"}
            </Text>
          </TouchableOpacity>
          <View style={styles.headerCellSmall}>
            <Text style={styles.headerText}>상품번호</Text>
          </View>
          <View style={[styles.headerCell, styles.flex2]}>
            <Text style={styles.headerText}>상품명</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>가격</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>수량</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>총가격</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>구매</Text>
          </View>
        </View>

        {/* 장바구니 아이템 */}
        {cartList.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyText}>
              장바구니에 담긴 상품이 없습니다.
            </Text>
          </View>
        ) : (
          cartList.map((cart, i) => (
            <View key={i} style={styles.cartItem}>
              <View style={styles.itemRow}>
                {/* 체크박스 */}
                <TouchableOpacity
                  style={styles.headerCell}
                  onPress={() => handleCheckbox(cart.cartNum)}
                >
                  <Text style={styles.checkboxText}>
                    {selectedItems.includes(cart.cartNum) ? "☑" : "☐"}
                  </Text>
                </TouchableOpacity>

                {/* 상품번호 */}
                <View style={styles.headerCellSmall}>
                  <Text style={styles.itemText}>{cart.itemNum}</Text>
                </View>

                {/* 상품명 */}
                <View style={[styles.headerCell, styles.flex2]}>
                  <Text style={styles.itemName}>
                    {cart.itemDTO?.itemName || cart.itemName}
                  </Text>
                </View>

                {/* 가격 */}
                <View style={styles.headerCell}>
                  <Text style={styles.itemText}>
                    {(cart.itemDTO?.price || cart.price)?.toLocaleString()}원
                  </Text>
                </View>

                {/* 수량 */}
                <View style={styles.headerCell}>
                  <View style={styles.quantityContainer}>
                    <TextInput
                      style={styles.quantityInput}
                      value={String(cart.cartCnt)}
                      onChangeText={(value) => handleCntChange(i, value)}
                      keyboardType="number-pad"
                    />
                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() => updateCartCnt(cart)}
                    >
                      <Text style={styles.updateButtonText}>변경</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 총가격 */}
                <View style={styles.headerCell}>
                  <Text style={styles.itemText}>
                    {cart.totalPrice?.toLocaleString()}원
                  </Text>
                </View>



                {/* 구매/삭제 버튼 */}
                <View style={styles.headerCell}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.buyButton]}
                    onPress={() => buyItem(cart)}
                  >
                    <Text style={styles.buyButtonText}>구매</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => deleteCartItem(cart.cartNum)}
                  >
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        {/* 총 구매 가격 및 버튼 */}
        {cartList.length > 0 && (
          <View style={styles.totalPriceContainer}>
            <View style={styles.totalPriceBox}>
              <Text style={styles.totalLabel}>총 구매 가격</Text>
              <Text style={styles.totalAmount}>
                {getTotalPrice().toLocaleString()}원
              </Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.bottomButton, styles.deleteSelectedButton]}
                onPress={deleteSelectedItems}
              >
                <Text style={styles.bottomButtonText}>선택 삭제</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomButton, styles.buySelectedButton]}
                onPress={buySelectedItems}
              >
                <Text style={[styles.bottomButtonText, styles.buySelectedText]}>
                  선택 상품 구매
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1,
  },
  headerCellSmall: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1,
  },
  flex2: {
    flex: 2,
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  checkboxText: {
    fontSize: 18,

  },
  cartItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 2,
    alignItems: "center",
  },
  itemText: {
    fontSize: 10,
    textAlign: "center",
  },
  itemTextSmall: {
    fontSize: 9,
    textAlign: "center",
  },
  itemName: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 2,
  },
  quantityContainer: {
    alignItems: "center",
    gap: 4,
  },
  quantityInput: {
    width: 40,
    height: 35,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 10,
    paddingVertical: 2,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginVertical: 1,
    minWidth: 40,
  },
  buyButton: {
    backgroundColor: "#4CAF50",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#999",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyCart: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  totalPriceContainer: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    marginTop: 10,
  },
  totalPriceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteSelectedButton: {
    backgroundColor: "#999",
  },
  buySelectedButton: {
    backgroundColor: "#4CAF50",
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  buySelectedText: {
    fontSize: 15,
  },
});
