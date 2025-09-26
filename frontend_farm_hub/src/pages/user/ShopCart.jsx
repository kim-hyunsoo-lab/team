import React, { useEffect, useState } from 'react'
import PageTitle from '../../common/PageTitle'
import axios from 'axios';

const ShopCart = () => {
  //장바구니 목록 조회
  const [cartList, setCartList] = useState([]);

  // useEffect(() => {
  //   axios.get(`/api/carts/${JSON.parse(sessionStorage.getItem('loginInfo'))}`)
  // }, []);
  
  return (
    <div className=''>
      <PageTitle title='장바구니' />
      <table border={1}>
        <thead>
          <tr>
            <td>
              <input type="checkbox" name="" />
            </td>
            <td>상품명</td>
            <td>수량</td>
            <td>총가격</td>
            <td>담은 날짜</td>
            <td>주문</td>
          </tr>
        </thead>
        <tbody>
          {

          }
        </tbody>
      </table>
    </div>
  )
}

export default ShopCart