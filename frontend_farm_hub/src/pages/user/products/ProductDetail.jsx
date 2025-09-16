import React from 'react'
import PageTitle from '../../../common/PageTitle'
import { NavLink, Outlet, useParams } from 'react-router'
import styles from './ProductDetail.module.css'

const ProductDetail = () => {
  const {itemNum} = useParams();
  console.log(itemNum);
  return (
    <div className={styles.container}>
      <PageTitle title={'상품명'} />
      <div className={styles.item_info}>
        <div className={styles.main_img_div}>메인 이미지</div>
        <div className={styles.item_intro}>
          <h1>상품명</h1>
          <table border={1}>
            <tbody>
              <tr>
                <td>판매가</td>
                <td>--원</td>
              </tr>
              <tr>
                <td>상품 번호</td>
                <td>1</td>
              </tr>
              <tr>
                <td>부위</td>
                <td>부위명</td>
              </tr>
              <tr>
                <td>원산지</td>
                <td>원산지</td>
              </tr>
              <tr>
                <td>만족도</td>
                <td>평균평점</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.detail_div}>
        <div className={styles.detail_menu_div}>
          <ul>
            <li>
              <NavLink to={''}>상품정보</NavLink>
            </li>
            <li>
              <NavLink to={'review'}>이용후기</NavLink>
            </li>
            <li>
              <NavLink to={'qna'}>상품Q&amp;A</NavLink>
            </li>
          </ul>
        </div>
        <div className={styles.details}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail