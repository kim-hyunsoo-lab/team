import React, { useState } from 'react'
import Button from '../../common/Button'
import PageTitle from '../../common/PageTitle'
import styles from './Home.module.css'
import Select from '../../common/Select'
import { useNavigate } from 'react-router'

const Home = () => {
  const [itemList, setItemList] = useState([1,2,3,4,5,6,7,8]);

  const nav = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.new_product}>
        <PageTitle title='신상품' />
        <div className={`${styles.grid_div}`}>
          {
            itemList.map((e, i) => {
              console.log(e);
              return (
                <div key={i} onClick={e => nav(`/product-detail/${e}/intro`)}>{e}</div>
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
            itemList.map((e, i) => {
              return (
                <div key={i}>{e}</div>
              )
            })
          }
        </div>
        <p className={`${styles.more}`}>
          <span onClick={e => nav('/popular-product-list')}>더보기</span>
        </p>
      </div>
      <div className={styles.discount_product}>
        <PageTitle title='할인상품' />
        <div className={`${styles.grid_div}`}>
          {
            itemList.map((e, i) => {
              return (
                <div key={i}>{e}</div>
              )
            })
          }
        </div>
        <p className={`${styles.more}`}>
          <span onClick={e => nav('/discount-product-list')}>더보기</span>
        </p>
      </div>
    </div>
  )
}

export default Home