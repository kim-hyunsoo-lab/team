import React, { useEffect, useState } from 'react'
import PageTitle from '../../common/PageTitle'
import axios from 'axios';
import Button from '../../common/Button';
import styles from './ShopCart.module.css'
import Input from '../../common/Input';
import dayjs from 'dayjs';

const ShopCart = () => {
  //장바구니 목록 조회
  const [cartList, setCartList] = useState([]);

  //체크박스 선택 상태
  const [selectedItems, setSelectedItems] = useState([]);

  //변경된 수량을 저장할 state 변수
  const [cnt, setCnt] = useState(0);

  useEffect(() => {
    axios.get(`/api/carts/${JSON.parse(sessionStorage.getItem('loginInfo')).memId}`)
    .then(res => {
      console.log(res.data);
      setCartList(res.data);
    })
    .catch(e => {
      console.log(e);
      alert(e.response.data);
    });
  }, []);

  // 수량 변경 함수 - 숫자 검증 추가
const handleCntChange = (i, value) => {
  const updatedCartList = [...cartList];
  // 빈 문자열이나 숫자가 아닌 값 체크
  const numValue = parseInt(value);
  if (isNaN(numValue) || numValue < 1) {
    updatedCartList[i].cartCnt = 1; // 최소값 1로 설정
  } else {
    updatedCartList[i].cartCnt = numValue;
  }
  setCartList(updatedCartList);
};

// 수량 변경 버튼 클릭 함수 - 유효성 검증 추가
const updateCartCnt = (cartNum, cartCnt) => {
  // cartCnt가 유효한 숫자인지 확인
  if (!cartCnt || isNaN(cartCnt) || cartCnt < 1) {
    alert('유효한 수량을 입력해주세요.');
    return;
  }

  // URL에는 cartNum(장바구니 번호)을 사용하고, body에는 숫자로 변환된 cartCnt를 전송
  axios.put(`/api/carts/${cartNum}`, { cartCnt: Number(cartCnt) })
  .then(res => {
    console.log(res.data);
    alert('수량이 변경되었습니다.');
  })
  .catch(e => {
    console.log(e);
    alert(e.response.data);
  });
};

  //총 구매 가격 계산
  const getTotalPrice = () => {
    return cartList.reduce((sum, cart) => sum + cart.totalPrice, 0);
  };

  //체크박스 개별 선택
  const handleCheckbox = (cartNum) => {
    setSelectedItems(prev =>
      prev.includes(cartNum)
        ? prev.filter(num => num !== cartNum)
        : [...prev, cartNum]
    );
  };

  //전체 선택/해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartList.map(cart => cart.cartNum));
    } else {
      setSelectedItems([]);
    }
  };

  //개별 상품 삭제
  const deleteCartItem = (cartNum) => {
    if (!confirm('해당 상품을 삭제하시겠습니까?')) {
      return;
    }

    axios.delete(`/api/carts/${cartNum}`)
    .then(() => {
      alert('상품이 삭제되었습니다.');
      // 삭제된 상품을 제외한 나머지 상품들로 cartList 업데이트
      setCartList(cartList.filter(cart => cart.cartNum !== cartNum));
      // 선택 목록에서도 제거
      setSelectedItems(selectedItems.filter(num => num !== cartNum));
    })
    .catch(e => {
      console.log(e);
      alert('삭제 중 오류가 발생했습니다.');
    });
  };

  //선택 삭제
  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }

    if (!confirm(`선택한 ${selectedItems.length}개 상품을 삭제하시겠습니까?`)) {
      return;
    }

    // Promise.all: 여러 개의 비동기 요청을 동시에 실행하고, 모든 요청이 완료될 때까지 기다림
    // selectedItems 배열의 각 cartNum에 대해 삭제 API를 호출하고, 모든 삭제가 완료되면 then 실행
    Promise.all(
      selectedItems.map(cartNum =>
        axios.delete(`/api/carts/${cartNum}`)
      )
    )
    .then(() => {
      alert('선택한 상품이 삭제되었습니다.');
      // 삭제된 상품들을 제외한 나머지 상품들로 cartList 업데이트
      setCartList(cartList.filter(cart => !selectedItems.includes(cart.cartNum)));
      setSelectedItems([]);
    })
    .catch(e => {
      console.log(e);
      alert('삭제 중 오류가 발생했습니다.');
    });
  };

  return (
    <div className={styles.container}>
      <PageTitle title='장바구니' />
      <table className={styles.cart_table}>
        <thead>
          <tr>
            <td>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedItems.length === cartList.length && cartList.length > 0}
              />
            </td>
            <td>상품번호</td>
            <td>상품명</td>
            <td>가격</td>
            <td>수량</td>
            <td>총가격</td>
            <td>담은 날짜</td>
            <td>구매</td>
          </tr>
        </thead>
        <tbody>
          {
            cartList.map((cart, i) => {
              return (
                <tr key={i}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(cart.cartNum)}
                      onChange={() => handleCheckbox(cart.cartNum)}
                    />
                  </td>
                  <td>{cart.itemNum}</td>
                  <td>{cart.itemDTO.itemName}</td>
                  <td>{cart.itemDTO.price.toLocaleString()}원</td>
                  <td>
                    <Input
                      value={cart.cartCnt}
                      size='70px'
                      type='number'
                      min='1'
                      onChange={(e) => handleCntChange(i, e.target.value)}
                    />
                    <Button
                      title='수량변경'
                      size='70px'
                      onClick={() => updateCartCnt(cart.cartNum, cart.cartCnt)}
                    />
                  </td>
                  <td>{cart.totalPrice.toLocaleString()}원</td>
                  <td>{dayjs(cart.cartDate).format('YYYY년 MM월 DD일')}</td>
                  <td>
                    <Button title='구매하기' size='70px' />
                    <Button
                      title='삭제'
                      color='gray'
                      size='70px'
                      onClick={() => deleteCartItem(cart.cartNum)}
                    />
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <div className={styles.total_price_container}>
        <div className={styles.total_price_box}>
          <span className={styles.total_label}>총 구매 가격</span>
          <span className={styles.total_amount}>{getTotalPrice().toLocaleString()}원</span>
        </div>
        <div className={styles.button_group}>
          <Button title='선택 삭제' color='gray' size='150px' onClick={deleteSelectedItems} />
          <Button title='선택 상품 구매' color='green' size='200px' />
        </div>
      </div>
    </div>
  )
}

export default ShopCart