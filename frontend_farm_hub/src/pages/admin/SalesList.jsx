import React, { useEffect, useState } from 'react'
import styles from "./SalesList.module.css"
import axios from 'axios';
import dayjs from 'dayjs';
import PageTitle from '../../common/PageTitle';

const SalesList = () => {
  const [salesList, setSalesList] = useState([]);


  useEffect(()=>{
    axios.get('/api/buy/sales').then(res=>{
      console.log(res.data);
      setSalesList(res.data);
    }).catch(e=>{
      // 오류 상태코드
      const errorCode = e.status;
      if(errorCode == 400 || errorCode == 500){
        alert(`오류코드: ${errorCode}\n오류 메세지: ${e.response.data}`)}
      // 괴상망측한 오류 - 전체 내용 보기 
      else(console.log(e))});
    }, []);

    const groupByDate = (data) => {
      return data.reduce((acc, item) => {
        const date = dayjs(item.buyDate).format('YYYY-MM-DD');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc
      }, {});
    };

    const groupedSalesList = groupByDate(salesList);   
    
    console.log(groupedSalesList);


  return (
    <div className={styles.container}>
      <PageTitle title='판매 목록' />

      {Object.entries(groupedSalesList).map(([date, items]) => (
        <div key={date} className={styles.dateSection}>
          <div>
          {dayjs(date).format('YYYY년 MM월 DD일')}
          </div>
          <table>
            <colgroup>
              <col width="10%" />
              <col width="30%" />
              <col width="30%" />
              <col width="10%" />
              <col width="20%" />           
            </colgroup>
            <thead>
              <tr>
                <td>No</td>
                <td>주문자 ID</td>
                <td>상품명</td>
                <td>수량</td>
                <td>총 가격</td>
              </tr>
            </thead>
            <tbody>
              {
                items.map((e, i) => {
                  return(
                    <tr key={i}>
                      <td>{items.length-i}</td>
                      <td>{e.memId}</td>
                      <td>{e.itemDTO.itemName}</td>
                      <td>{e.buyCnt}</td>
                      <td>{e.totalPrice}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table> 
          <div className={styles.summary}>                    
            <span>일일 총 매출: {items[0].dailyTotal.toLocaleString()}원</span>           
          </div>   
        </div>
      ))}
    </div>
  )
}

export default SalesList