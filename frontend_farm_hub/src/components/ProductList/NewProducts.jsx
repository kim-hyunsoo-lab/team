import React, { useEffect, useState } from 'react'
import styles from './NewProducts.module.css'
import axios from 'axios';
import PageTitle from '../../common/PageTitle';
import { useLocation, useNavigate } from 'react-router';

const NewProducts = () => {
  const nav = useNavigate();

  //url정보를 객체로 리턴하는 hook
  const urlInfo = useLocation();

  console.log(urlInfo.pathname);
  
  //신상품 목록을 저장할 state 변수
  const [newProducts, setNewProducts] = useState([]);

  //신상품 목록 조회
  useEffect(() => {
    axios.get('/api/items')
    .then(res => {
      //console.log(res.data);
      setNewProducts(res.data);
    })
    .catch(e => console.log(e));
  }, []);
  console.log(newProducts);

  return (
    <div>
      <PageTitle title='신상품' />
      <div className={`${styles.grid_div}`}>
        {
          // Home컴포넌트에 있으면 상품목록을 8개까지 자르고, 그 외에는 모두 표시함
          (
            urlInfo.pathname === '/'
            ?
            newProducts.slice(0,8)
            :
            newProducts
          ).map((newProduct, i) => {
            
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

export default NewProducts