import React from 'react'
import styles from './NewProductList.module.css'
import PageTitle from '../../../common/PageTitle'
import { useNavigate } from 'react-router'
import Menu from '../../../components/Menu'

const NewProductList = ({newProducts}) => {
  const nav = useNavigate();

  console.log(newProducts)
  return (
    <div className={styles.container}>
      <Menu />
      <PageTitle title='신상품' />
        <div className={`${styles.grid_div}`}>
          {
            newProducts.map((newProduct, i) => {
              
              return (
                <div
                  className={styles.grid_content}
                  key={i}
                  onClick={e => nav(`/product-detail/${newProduct.itemNum}/intro`)}
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
    </div>
  )
}

export default NewProductList