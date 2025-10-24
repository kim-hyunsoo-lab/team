import axios from "axios";
import React, { useEffect, useState } from "react";
import Textarea from "../../common/Textarea";
import Input from "../../common/Input";
import styles from "./Paymentpage.module.css";
import Button from "../../common/Button";

const Paymentpage = () => {
  // 고객 정보를 조회했을 때 저장할 state 변수
  const [customerInfo, setCustomerInfo] = useState({
    memId: "",
    memName: "",
    memTel: "",
    memAddr: "",
    addrDetail: "",
  });

  // 장바구니에서 주문한 상품 정보들
  const [orderItems, setOrderItems] = useState([]);

  // 배송 요청사항
  const [deliveryRequest, setDeliveryRequest] = useState("");
  const [customRequest, setCustomRequest] = useState("");

  // 결제 수단
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  // 금액 계산
  const [priceInfo, setPriceInfo] = useState({
    totalProductPrice: 0,
    deliveryFee: 3000,
    finalPrice: 0,
  });

  // 로그인 정보
  const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

  // 로그인 체크
  useEffect(() => {
    if (!loginInfo) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }
  }, []);

  // 고객 정보 조회
  useEffect(() => {
    if (!loginInfo) return;

    axios
      .get(`/api/members/select/${loginInfo.memId}`)
      .then((res) => {
        console.log("고객 정보:", res.data);
        setCustomerInfo(res.data);
      })
      .catch((e) => {
        console.log(e);
        alert("고객 정보를 불러오는데 실패했습니다.");
      });
  }, []);

  // 장바구니 상품 조회
  useEffect(() => {
    if (!loginInfo) return;

    axios
      .get(`/api/carts/${loginInfo.memId}`)
      .then((res) => {
        console.log("장바구니 정보:", res.data);
        setOrderItems(res.data);
      })
      .catch((e) => {
        console.log(e);
        alert("장바구니 정보를 불러오는데 실패했습니다.");
      });
  }, []);

  // 금액 계산
  useEffect(() => {
    const totalProductPrice = orderItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    // 50,000원 이상 무료배송
    const deliveryFee = totalProductPrice >= 50000 ? 0 : 3000;

    setPriceInfo({
      totalProductPrice,
      deliveryFee,
      finalPrice: totalProductPrice + deliveryFee,
    });
  }, [orderItems]);

  // 요청사항 선택 핸들러
  const handleRequestChange = (e) => {
    const value = e.target.value;
    setDeliveryRequest(value);

    if (value !== "직접입력") {
      setCustomRequest("");
    }
  };

  // 결제하기 버튼 클릭
  const handlePayment = () => {
    // 유효성 검사
    if (orderItems.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    if (!customerInfo.memAddr) {
      alert("배송지 정보를 확인해주세요.");
      return;
    }

    if (!paymentMethod) {
      alert("결제 수단을 선택해주세요.");
      return;
    }

    // 결제 확인
    const confirmMessage = `${priceInfo.finalPrice.toLocaleString()}원을 결제하시겠습니까?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    // 주문 데이터 준비
    const orderData = {
      memId: loginInfo.memId,
      memName: customerInfo.memName,
      memTel: customerInfo.memTel,
      memAddr: customerInfo.memAddr,
      addrDetail: customerInfo.addrDetail,
      orderItems: orderItems.map((item) => ({
        itemCode: item.itemDTO.itemCode,
        itemName: item.itemDTO.itemName,
        cartCnt: item.cartCnt,
        totalPrice: item.totalPrice,
      })),
      deliveryRequest:
        deliveryRequest === "직접입력" ? customRequest : deliveryRequest,
      paymentMethod: paymentMethod,
      totalAmount: priceInfo.totalProductPrice,
      deliveryFee: priceInfo.deliveryFee,
      finalAmount: priceInfo.finalPrice,
    };

    console.log("주문 데이터:", orderData);

    // 백엔드로 주문 정보 전송
    axios
      .post("/api/order/create", orderData)
      .then((res) => {
        console.log("주문 결과:", res.data);
        alert("결제가 완료되었습니다!");
        
        // 장바구니 비우기
        axios.delete(`/api/carts/${loginInfo.memId}`)
          .then(() => {
            // 주문 완료 페이지로 이동
            window.location.href = `/order/complete?orderId=${res.data.orderId}`;
          })
          .catch((e) => {
            console.log("장바구니 삭제 실패:", e);
            window.location.href = "/";
          });
      })
      .catch((e) => {
        console.log("주문 실패:", e);
        alert("결제 처리 중 오류가 발생했습니다.");
      });
  };

  // 로그인 정보가 없으면 아무것도 렌더링하지 않음
  if (!loginInfo) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.pageTitle}>주문/결제</h1>
      </div>

      {/* 배송지 정보 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>배송지 정보</h2>
        <div className={styles.infoBox}>
          <p>
            <strong>받는 사람:</strong> {customerInfo.memName}
          </p>
          <p>
            <strong>주소:</strong> {customerInfo.memAddr}{" "}
            {customerInfo.addrDetail}
          </p>
          <p>
            <strong>전화번호:</strong> {customerInfo.memTel}
          </p>
        </div>
      </div>

      {/* 주문 상품 정보 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>주문 상품 정보</h2>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>상품명</th>
              <th>수량</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.length > 0 ? (
              orderItems.map((e, i) => {
                return (
                  <tr key={i}>
                    <td>{e.itemDTO.itemName}</td>
                    <td>{e.cartCnt}개</td>
                    <td>{e.totalPrice.toLocaleString()}원</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className={styles.noData}>
                  주문할 상품이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 배송 요청사항 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>배송 요청사항</h2>
        <select
          className={styles.select}
          value={deliveryRequest}
          onChange={handleRequestChange}
        >
          <option value="">요청사항을 선택해주세요</option>
          <option value="부재 시 문 앞에 놓아주세요">
            부재 시 문 앞에 놓아주세요
          </option>
          <option value="부재 시 경비실에 맡겨주세요">
            부재 시 경비실에 맡겨주세요
          </option>
          <option value="배송 전 연락주세요">배송 전 연락주세요</option>
          <option value="직접 받겠습니다">직접 받겠습니다</option>
          <option value="직접입력">직접입력</option>
        </select>

        {deliveryRequest === "직접입력" && (
          <Textarea
            value={customRequest}
            onChange={(e) => setCustomRequest(e.target.value)}
            placeholder="요청사항을 입력해주세요"
            className={styles.textarea}
            maxLength={100}
            width="100%"
          />
        )}
      </div>

      {/* 결제 수단 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>결제 수단</h2>
        <div className={styles.paymentMethods}>
          <label className={styles.radioLabel}>
            <Input
              type="radio"
              name="payment"
              value="creditCard"
              checked={paymentMethod === "creditCard"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>신용카드</span>
          </label>
          <label className={styles.radioLabel}>
            <Input
              type="radio"
              name="payment"
              value="bankTransfer"
              checked={paymentMethod === "bankTransfer"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>무통장입금</span>
          </label>
          <label className={styles.radioLabel}>
            <Input
              type="radio"
              name="payment"
              value="mobilePayment"
              checked={paymentMethod === "mobilePayment"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>휴대폰결제</span>
          </label>
        </div>
      </div>

      {/* 최종 결제 금액 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>결제 금액</h2>
        <div className={styles.priceBox}>
          <div className={styles.priceRow}>
            <span>상품 금액</span>
            <span>{priceInfo.totalProductPrice.toLocaleString()}원</span>
          </div>
          <div className={styles.priceRow}>
            <span>배송비</span>
            <span>
              {priceInfo.deliveryFee === 0 ? (
                <span className={styles.freeDelivery}>무료배송</span>
              ) : (
                `${priceInfo.deliveryFee.toLocaleString()}원`
              )}
            </span>
          </div>
          <div className={styles.divider}></div>
          <div className={`${styles.priceRow} ${styles.finalPrice}`}>
            <span>최종 결제 금액</span>
            <span className={styles.finalAmount}>
              {priceInfo.finalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {priceInfo.totalProductPrice > 0 &&
          priceInfo.totalProductPrice < 50000 && (
            <p className={styles.deliveryNotice}>
              * {(50000 - priceInfo.totalProductPrice).toLocaleString()}원 더
              구매하시면 무료배송!
            </p>
          )}
      </div>

      {/* 결제 버튼 */}
      <div className={styles.paymentButtonArea}>
        <Button
          title={`${priceInfo.finalPrice.toLocaleString()}원 결제하기`}
          onClick={handlePayment}
          size="100%"
        />
      </div>
    </div>
  );
};

export default Paymentpage;