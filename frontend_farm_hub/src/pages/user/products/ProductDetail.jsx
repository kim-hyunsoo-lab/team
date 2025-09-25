import React, { useEffect, useState } from 'react'
import PageTitle from '../../../common/PageTitle'
import { NavLink, Outlet, useParams } from 'react-router'
import styles from './ProductDetail.module.css'
import axios from 'axios'
import NewProductList from './NewProductList'
import Button from '../../../common/Button'

const ProductDetail = () => {
  const {itemNum} = useParams();
  //console.log(itemNum);

  const [itemDetail, setItemDetail] = useState({});

  useEffect(() => {
    axios.get(`/api/items/${itemNum}`)
    .then(res => {
      console.log(res.data);
      setItemDetail(res.data);
    })
    .catch(e => console.log(e));
  }, []);

  return (
    <div className={styles.container}>
      <PageTitle title={'상품 상세정보'} size='250px' />
      <div className={styles.item_info}>
        <div className={styles.main_img_div}>
          {
            itemDetail.imgList &&
            itemDetail.imgList.map((img, i) => {
              if (img.isMain === 'Y') {
                return (
                  <img src={`http://localhost:8080/upload/${img.attachedImgName}`} className={styles.main_img} key={i} />
                )
              }
            })
          }
        </div>
        <div className={styles.item_intro}>
          <h1>{itemDetail.itemName}</h1>
          <table className={styles.main_info_table}>
            <colgroup>
              <col width={'20%'} />
              <col width={'80%'} />
            </colgroup>
            <tbody>
              <tr>
                <td>판매가</td>
                <td>{
                  itemDetail.price &&
                  itemDetail.price.toLocaleString()
                }원</td>
              </tr>
              <tr>
                <td>상품 번호</td>
                <td>{itemNum}</td>
              </tr>
              <tr>
                <td>부위</td>
                <td>{itemDetail.part}</td>
              </tr>
              <tr>
                <td>원산지</td>
                <td>{itemDetail.origin}</td>
              </tr>
              <tr>
                <td>만족도</td>
                <td>{itemDetail.reviewAvg}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.btns}>
            <Button
              title='즐겨찾기'
              color='gray'
              size='100%'
            />
            <Button
              title='장바구니'
              size='100%'
            />
            <Button
              title='구매하기'
              color='green'
              size='100%'
            />
          </div>
        </div>
      </div>
      <div className={styles.detail_div}>
        <div className={styles.detail_menu_div}>
          <ul>
            <li>
              <NavLink
                to={'intro'}
                className={({isActive}) => isActive ? styles.active : undefined}
              ><p>상품정보</p></NavLink>
            </li>
            <li>
              <NavLink
                to={'review'}
                className={({isActive}) => isActive ? styles.active : undefined}
              ><p>이용후기</p></NavLink>
            </li>
            <li>
              <NavLink
                to={`qna/${itemNum}`}
                className={({isActive}) => isActive ? styles.active : undefined}
              ><p>상품문의</p></NavLink>
            </li>
          </ul>
        </div>
        <div className={styles.details}>
          <Outlet context={{itemDetail}} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail