import React, { useEffect, useState } from 'react'
import Button from '../../common/Button'
import PageTitle from '../../common/PageTitle'
import styles from './Home.module.css'
import Select from '../../common/Select'
import { useNavigate } from 'react-router'
import axios from 'axios'
import NewProductList from './products/NewProductList'

const Home = ({newProducts}) => {

  const nav = useNavigate();

  

  return (
    <div className={styles.container}>
      <div className={styles.new_product}>
        <PageTitle title='신상품' />
        <div className={`${styles.grid_div}`}>
          {
            newProducts.slice(0, 8).map((newProduct, i) => {
              
              return (
                <div
                  className={styles.grid_content}
                  key={i}
                  onClick={e => nav(`/product-detail/${newProduct.itemNum}`)}
                >
                  <div className={styles.grid_img}>
                    <img src={`http://localhost:8080/upload/${newProduct.imgList[0].attachedImgName}`} />
                  </div>
                  <div className={styles.grid_info}>
                    <h3>{newProduct.itemName}</h3>
                    <p>{newProduct.price.toLocaleString()}원</p>
                  </div>
                </div>
              )
            })
          }
        </div>
        <p className={`${styles.more}`}>
          <span onClick={e => nav('/new-product-list')}>더보기</span>
        </p>
      </div>
      <div className={styles.popular_product}>
        <PageTitle title='인기상품' />
        <div className={`${styles.grid_div}`}>
          {
            
          }
        </div>
        <p className={`${styles.more}`}>
          <span onClick={e => nav('/popular-product-list')}>더보기</span>
        </p>
      </div>
      <div className={styles.discount_product}>
        <PageTitle title='할인상품' />
        <div className={`${styles.grid_div}`}>
          
        </div>
        <p className={`${styles.more}`}>
          <span onClick={e => nav('/discount-product-list')}>더보기</span>
        </p>
      </div>
    </div>
  )
}

export default Home