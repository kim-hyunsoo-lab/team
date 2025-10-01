import React, { useState } from 'react'
import Modal from '../../common/Modal'
import styles from './MemberBuyDetail.module.css'
import { useNavigate } from 'react-router'
import dayjs from 'dayjs'

const MemberBuyDetail = ({detailData, modalOpen, onClose}) => { 

  return (
    <>
      <Modal isOpen={modalOpen}
      title='구매 상세 내역'
      size='750px'
      onClose={onClose}
      >      
        <div className={styles.container}>
          <p>{detailData.length ? `${detailData[0].memId}님의 구매내역` : '구매 내역이 존재하지 않습니다'}</p>
          <table className={styles.memberDetailTable}>
            <colgroup>
              <col width="9%" />
              <col width="20%" />
              <col width="*%" />
              <col width="12%" />        
              <col width="15%" />        
              <col width="20%" />        
          </colgroup>
            <thead>
              <tr>
                <td>No</td>
                <td>구매상품</td>
                <td>상품명</td>
                <td>구매수량</td>
                <td>총 가격</td>
                <td>구매일</td>
              </tr>
            </thead>
            <tbody>
              {detailData.map((e, i) => {return(
                <tr key={i}>
                  <td><div>{detailData.length-i}</div></td>
                  <td><div><img src={`http://localhost:8080/upload/${e.itemDTO.imgList[0].attachedImgName}`} className={styles.main_img} key={i} /></div></td>
                  <td><div>{e.itemDTO.itemName}</div></td>
                  <td><div>{e.buyCnt}</div></td>
                  <td><div>{(e.totalPrice).toLocaleString()}원</div></td>
                  <td><div>{dayjs(e.buyDate).format('YYYY년 MM월 DD일')}</div></td>
                </tr>
              )})}
            </tbody>


          </table>
        </div>
      </Modal> 
    </>   
  )
}

export default MemberBuyDetail