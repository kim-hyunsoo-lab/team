import React from 'react'
import styles from "./SalesListDetail.module.css"
import Modal from '../../common/Modal'
import dayjs from 'dayjs'


const SalesListDetail = ({onClose, modalOpen, salesDetailData}) => {  
  console.log(salesDetailData)
  return (
    <>
      <Modal 
        isOpen={modalOpen}
        title='상세 내역'
        size='700px'
        onClose={onClose}
      >
        <div className={styles.container}>
          {salesDetailData ? (
            <div className={styles.salesListDetailData}>
              <div>
                <table className={styles.detailTable}>
                  <colgroup>
                    <col width="18%" />
                    <col width="*%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>주문자명</td>
                      <td>{salesDetailData.shopMemberDTO.memName}</td>
                    </tr>
                    <tr>
                      <td>주문자 ID</td>
                      <td>{salesDetailData.shopMemberDTO.memId}</td>
                    </tr>                    
                    <tr>
                      <td>주소</td>
                      <td>{salesDetailData.shopMemberDTO.memAddr} | {salesDetailData.shopMemberDTO.addrDetail}</td>
                    </tr>
                    <tr>
                      <td>전화번호</td>
                      <td>{salesDetailData.shopMemberDTO.memTel}</td>
                    </tr>
                    <tr>
                      <td>상품명</td>
                      <td>{salesDetailData.itemDTO.itemName}</td>
                    </tr>
                    <tr>
                      <td>상품가격</td>
                      <td>{salesDetailData.itemDTO.price?.toLocaleString()}원</td>
                    </tr>
                    <tr>
                      <td>구매수량</td>
                      <td>{salesDetailData.buyCnt}</td>
                    </tr>
                    <tr>
                      <td>총 가격</td>
                      <td>{salesDetailData.totalPrice?.toLocaleString()}원</td>
                    </tr>
                    <tr>
                      <td>주문일시</td>
                      <td>
                        {dayjs(salesDetailData.buyDate).format('YYYY년 MM월 DD일 HH시 mm분 ss초')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <img src={`http://localhost:8080/upload/${salesDetailData.itemDTO.imgList[0].attachedImgName}`} className={styles.main_img}/>
              </div>
            </div>
          ) : (<p>데이터가 존재하지 않습니다</p>)}                           
        </div>
      </Modal>
    </>
  )
}

export default SalesListDetail