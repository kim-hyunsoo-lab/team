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

  const memId = JSON.parse(sessionStorage.getItem('loginInfo')).memId;

  console.log(cartList);

  const [reloading, setReloading] = useState(0);

  useEffect(() => {
    axios.get(`/api/carts/${memId}`)
    .then(res => {
      console.log(res.data);
      setCartList(res.data);
    })
    .catch(e => {
      console.log(e);
      alert(e.response.data);
    });
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
      alert('유효한 수량을 입력해주세요.');
      return;
    }

    axios.put(`/api/carts/${cart.cartNum}`, {
      cartCnt: Number(cart.cartCnt),
      memId,
      itemNum : cart.itemNum
    })
    .then(res => {
      console.log(res.data);
      alert('수량이 변경되었습니다.');
      setReloading(reloading + 1);
    })
    .catch(e => {
      console.log(e);
      alert(e.response.data);
    });
  };

  //총 구매 가격 계산 (체크된 상품만)
  const getTotalPrice = () => {
    return cartList
      .filter(cart => selectedItems.includes(cart.cartNum))
      .reduce((sum, cart) => sum + cart.totalPrice, 0);
  };

  //체크박스 값 변경 시 실행 함수
  const handleCheckbox = (e) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, parseInt(e.target.value)]);
    }
    else {
      const result = selectedItems.filter((cartNum) => {return cartNum != e.target.value});
      setSelectedItems(result);
    }
  }

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
      setCartList(cartList.filter(cart => cart.cartNum !== cartNum));
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

    Promise.all(
      selectedItems.map(cartNum =>
        axios.delete(`/api/carts/${cartNum}`)
      )
    )
    .then(() => {
      alert('선택한 상품이 삭제되었습니다.');
      setCartList(cartList.filter(cart => !selectedItems.includes(cart.cartNum)));
      setSelectedItems([]);
    })
    .catch(e => {
      console.log(e);
      alert('삭제 중 오류가 발생했습니다.');
    });
  };

  // ✅ 수정된 각 행의 상품 구매 함수
  const buyItem = (cart) => {
    if (!confirm('이 상품을 구매하시겠습니까?')) {
      return;
    }

    axios.post('/api/buy/each-cart', {
      cartNum: cart.cartNum,
      memId: memId
    })
    .then(res => {
      alert('상품을 구매했습니다.');
      // 구매 후 장바구니에서 제거
      setCartList(cartList.filter(c => c.cartNum !== cart.cartNum));
      setSelectedItems(selectedItems.filter(num => num !== cart.cartNum));
    })
    .catch(e => {
      console.log(e);
      alert(e.response?.data || '구매 중 오류가 발생했습니다.');
    });
  };

  // 선택 상품 구매 함수
  const buySelectedItems = () => {
    if (selectedItems.length === 0) {
      alert('구매할 상품을 선택해주세요.');
      return;
    }

    if (!confirm(`선택한 ${selectedItems.length}개 상품을 구매하시겠습니까?`)) {
      return;
    }

    axios.post('/api/buy/cart', {
      cartNumList: selectedItems,
      memId: memId
    })
    .then(res => {
      alert('선택한 상품을 구매했습니다.');
      // 구매 후 장바구니에서 제거
      setCartList(cartList.filter(cart => !selectedItems.includes(cart.cartNum)));
      setSelectedItems([]);
    })
    .catch(e => {
      console.log(e);
      alert(e.response?.data || '구매 중 오류가 발생했습니다.');
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
            cartList.length === 0
            ?
            <tr>
              <td colSpan={8}>장바구니에 담긴 상품이 없습니다.</td>
            </tr>
            :
            cartList.map((cart, i) => {
              return (
                <tr key={i}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(cart.cartNum)}
                      onChange={e => handleCheckbox(e)}
                      value={cart.cartNum}
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
                      onClick={() => updateCartCnt(cart)}
                    />
                  </td>
                  <td>{cart.totalPrice.toLocaleString()}원</td>
                  <td>{dayjs(cart.cartDate).format('YYYY년 MM월 DD일')}</td>
                  <td>
                    <Button
                      title='구매하기'
                      size='70px'
                      onClick={() => buyItem(cart)}
                    />
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
          <Button title='선택 상품 구매' color='green' size='200px' onClick={buySelectedItems} />
        </div>
      </div>
    </div>
  )
}

export default ShopCart