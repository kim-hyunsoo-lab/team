import React from 'react'
import styles from './ProductIntro.module.css'
import { useOutletContext } from 'react-router';
import dayjs from 'dayjs';

const ProductIntro = () => {
  const { itemDetail } = useOutletContext(); // 부모에서 보낸 context 받기

  return (
    <div className={styles.container}>
      <div className={styles.img_div}>
        {
          itemDetail.imgList &&
          itemDetail.imgList.map((img, i) => {
            if (img.isMain === 'N') {
              return (
                <img
                  src={`http://localhost:8080/upload/${img.attachedImgName}`}
                  className={styles.sub_img}
                  key={i}
                />
              )
            }
          })
        }
      </div>
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
              <td>{dayjs(itemDetail.regDate).format('YYYY년 MM월 DD일')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductIntro