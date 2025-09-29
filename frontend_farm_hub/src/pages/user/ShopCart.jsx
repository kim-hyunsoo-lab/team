import React, { useEffect, useState } from 'react'
import PageTitle from '../../common/PageTitle'
import axios from 'axios';
import Button from '../../common/Button';
import styles from './ShopCart.module.css'

const ShopCart = () => {
  //장바구니 목록 조회
  const [cartList, setCartList] = useState([]);

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
  
  return (
    <div className={styles.container}>
      <PageTitle title='장바구니' />
      <table border={1} className={styles.cart_table}>
        <thead>
          <tr>
            <td>
              <input type="checkbox" name="" />
            </td>
            <td>상품번호</td>
            <td>상품명</td>
            <td>수량</td>
            <td>총가격</td>
            <td>담은 날짜</td>
            <td>주문</td>
          </tr>
        </thead>
        <tbody>
          {
            cartList.map((cart, i) => {
              return (
                <tr key={i}>
                  <td>
                    <input type="checkbox" name="" />
                  </td>
                  <td>{cart.itemNum}</td>
                  <td>{cart.itemDTO.itemName}</td>
                  <td>{cart.cartCnt}</td>
                  <td>{cart.totalPrice}</td>
                  <td>{cart.cartDate}</td>
                  <td>
                    <Button title='주문하기' />
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default ShopCart