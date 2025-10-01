import React, { useEffect, useState } from 'react'
import styles from './BuyList.module.css'
import PageTitle from '../../common/PageTitle'
import axios from 'axios'
import Button from '../../common/Button'
import dayjs from 'dayjs'

const BuyList = () => {
  const loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));

  //구매목록을 받을 state 변수
  const [buyList, setBuyList] = useState([]);

  //구매 목록 조회
  useEffect(() => {
    axios.get(`/api/buy/${loginInfo.memId}`)
    .then(res => {
      console.log(res.data);
      setBuyList(res.data);
    })
    .catch(e => {
      console.log(e);
      alert(e.response.data)
    });
  }, []);

  //총 구매 금액 계산
  const getTotalAmount = () => {
    return buyList.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  return (
    <div className={styles.container}>
      <PageTitle title='주문목록' />
      <table className={styles.buy_table}>
        <thead>
          <tr>
            <td>상품명</td>
            <td>가격</td>
            <td>수량</td>
            <td>총 구매 가격</td>
            <td>구매일</td>
            <td>주문취소</td>
          </tr>
        </thead>
        <tbody>
          {
            buyList.length === 0
            ?
            <tr>
              <td colSpan={6} className={styles.empty_message}>
                주문 내역이 없습니다.
              </td>
            </tr>
            :
            buyList.map((e, i) => {
              return (
                <tr key={i}>
                  <td>{e.itemDTO.itemName}</td>
                  <td>{e.itemDTO.price.toLocaleString()}원</td>
                  <td>{e.buyCnt}개</td>
                  <td>{e.totalPrice.toLocaleString()}원</td>
                  <td>{dayjs(e.buyDate).format('YYYY년 MM월 DD일')}</td>
                  <td>
                    <Button title='주문취소' color='gray' size='90px' />
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      
      {buyList.length > 0 && (
        <div className={styles.total_summary}>
          <div className={styles.total_box}>
            <span className={styles.total_label}>총 주문 금액</span>
            <span className={styles.total_amount}>{getTotalAmount().toLocaleString()}원</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuyList