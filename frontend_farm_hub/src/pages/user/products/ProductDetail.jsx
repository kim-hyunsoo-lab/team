import React from 'react'
import PageTitle from '../../../common/PageTitle'
import { useParams } from 'react-router'
import styles from './ProductDetail.module.css'

const ProductDetail = () => {
  const {itemNum} = useParams();
  console.log(itemNum);
  return (
    <div className={styles.container}>
      <PageTitle title={'상품명'} />
      <div className={styles.item_info}>
        <div className={styles.main_img_div}>메인 이미지</div>
        <div className={styles.item_intro}>소개</div>
      </div>
      <div className={styles.detail_div}>
        <div>
          <ul>
            <li>상품정보</li>
            <li>이용후기</li>
            <li>상품Q&A</li>
          </ul>
        </div>
        <div className={styles.detail_img_div}>상세 이미지</div>
      </div>
    </div>
  )
}

export default ProductDetail