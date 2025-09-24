import React from 'react'
import styles from './ProductIntro.module.css'
import { useOutletContext } from 'react-router';

const ProductIntro = () => {
  const { itemDetail } = useOutletContext(); // 부모에서 보낸 context 받기

  return (
    <div className={styles.container}>
      <div className={styles.img_div}>상세 이미지</div>
      <p>상품 상세설명</p>
      <div>
        <table className={styles.detail_table}>
          <colgroup>
            <col width={'30%'} />
            <col width={'70%'} />
          </colgroup>
          <tbody>
            <tr>
              <td>상품명</td>
              <td>{itemDetail.itemName}</td>
            </tr>
            <tr>
              <td>상품 소개</td>
              <td>{itemDetail.itemIntro}</td>
            </tr>
            <tr>
              <td>등록일</td>
              <td>{itemDetail.regDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductIntro