import axios from "axios";
import React, { useEffect, useState } from "react";
import Textarea from "../../common/Textarea";
import Input from "../../common/Input";
import styles from "./Paymentpage.module.css";
import Button from "../../common/Button";
import { useLocation, useNavigate } from "react-router";
import Select from "../../common/Select";

const Paymentpage = () => {
  const location = useLocation();
  const nav = useNavigate();
  const { itemNum, itemDetail, buyCnt, cartItems } = location.state || {};

  // 고객 정보를 조회했을 때 저장할 state 변수
  const [customerInfo, setCustomerInfo] = useState({
    memId: "",
    memName: "",
    memTel: "",
    memAddr: "",
    addrDetail: "",
  });

  // 주문할 상품 정보들
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

  const loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));

  // 포트원 초기화
  useEffect(() => {
    const { IMP } = window;
    if (IMP) {
      IMP.init('imp61013503'); // 가맹점 식별코드
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

  // 상품 정보 설정 (ProductDetail에서 넘어온 경우 vs 장바구니에서 넘어온 경우)
  useEffect(() => {
    if (!loginInfo) return;

    // ProductDetail에서 직접 구매한 경우
    if (itemNum && itemDetail && buyCnt) {
      console.log("개별 상품 구매:", { itemNum, itemDetail, buyCnt });
      setOrderItems([
        {
          itemDTO: {
            itemCode: itemDetail.itemCode,
            itemName: itemDetail.itemName,
            price: itemDetail.price,
          },
          cartCnt: buyCnt,
          totalPrice: itemDetail.price * buyCnt,
        },
      ]);
    }
    // ShopCart에서 넘어온 경우 (선택된 장바구니 상품들)
    else if (cartItems && cartItems.length > 0) {
      console.log("장바구니 선택 상품 구매:", cartItems);
      setOrderItems(cartItems);
    }
    // 그 외의 경우 전체 장바구니 조회
    else {
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
    }
  }, [itemNum, itemDetail, buyCnt, cartItems]);

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

  // 포트원 결제 요청 함수
  const completePayment = () => {
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

    const { IMP } = window;
    if (!IMP) {
      alert('결제 모듈 로딩에 실패했습니다. 페이지를 새로고침해주세요.');
      return;
    }

    // 주문번호 생성 (중복 방지)
    const merchant_uid = `ORD_${new Date().getTime()}_${loginInfo.memId}`;

    // 상품명 생성
    const itemName = orderItems.length > 1
      ? `${orderItems[0].itemDTO.itemName} 외 ${orderItems.length - 1}건`
      : orderItems[0].itemDTO.itemName;

    // 결제 수단 매핑
    const payMethodMap = {
      creditCard: 'card',
      bankTransfer: 'trans',
      mobilePayment: 'phone'
    };

    // 포트원 결제 요청
    IMP.request_pay({
      pg: 'iamporttest_3', // 토스페이먼츠 (또는 포트원 관리자에서 설정한 PG사)
      pay_method: payMethodMap[paymentMethod],
      merchant_uid: merchant_uid,
      name: itemName,
      amount: priceInfo.finalPrice,
      buyer_email: loginInfo.memEmail || '',
      buyer_name: customerInfo.memName,
      buyer_tel: customerInfo.memTel,
      buyer_addr: customerInfo.memAddr,
      buyer_postcode: '',
      m_redirect_url: window.location.origin + '/payment/complete', // 모바일 결제 후 리다이렉트
    }, (rsp) => {
      if (rsp.success) {
        // 결제 성공 시 백엔드 검증
        verifyPayment(rsp);
      } else {
        // 결제 실패
        alert(`결제 실패: ${rsp.error_msg}`);
      }
    });
  };

  // 백엔드 결제 검증 및 주문 처리
  const verifyPayment = (paymentData) => {
    console.log('결제 성공 데이터:', paymentData);

    // ProductDetail에서 직접 구매한 경우
    if (itemNum && itemDetail && buyCnt) {
      axios.post('/api/buy', {
        itemNum,
        memId: loginInfo.memId,
        buyCnt,
        imp_uid: paymentData.imp_uid,
        merchant_uid: paymentData.merchant_uid,
        paid_amount: paymentData.paid_amount
      })
      .then(() => {
        alert('결제가 완료되었습니다!');
        nav('/mypage/order-list');
      })
      .catch(e => {
        console.log(e);
        alert('결제 검증 실패: ' + (e.response?.data || '오류가 발생했습니다.'));
      });
      return;
    }

    // 장바구니에서 구매한 경우
    const cartNumList = orderItems
      .filter(item => item.cartNum)
      .map(item => item.cartNum);

    if (cartNumList.length > 0) {
      axios.post('/api/buy/cart', {
        cartNumList: cartNumList,
        memId: loginInfo.memId,
        imp_uid: paymentData.imp_uid,
        merchant_uid: paymentData.merchant_uid,
        paid_amount: paymentData.paid_amount
      })
      .then(() => {
        alert('결제가 완료되었습니다!');
        nav('/mypage/order-list');
      })
      .catch(e => {
        console.log(e);
        alert('결제 검증 실패: ' + (e.response?.data || '오류가 발생했습니다.'));
      });
    } else {
      alert('결제할 상품 정보가 올바르지 않습니다.');
    }
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
        <Select
          className={styles.select}
          value={deliveryRequest}
          size="300px"
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
        </Select>

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
              size='10px'
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
              size='10px'
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
              size='10px'
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
          onClick={() => completePayment()}
          size="100%"
        />
      </div>
    </div>
  );
};

export default Paymentpage;