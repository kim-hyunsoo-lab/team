import React, { useEffect, useState } from 'react'
import PageTitle from '../../../common/PageTitle'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router'
import styles from './ProductDetail.module.css'
import axios from 'axios'
import Button from '../../../common/Button'
import Input from '../../../common/Input'
import Login from '../../../components/login'

const ProductDetail = () => {
  const nav = useNavigate();

  const {itemNum} = useParams();

  const [itemDetail, setItemDetail] = useState({});

  // 로그인 Modal 창 숨김/보이기 여부
  const [isOpenLogin, setIsOpenLogin] = useState(false);

  //장바구니에 담을 수량
  const [cartCnt, setCartCnt] = useState(1);
  
  //로그인 데이터
  const loginData = sessionStorage.getItem('loginInfo');

  console.log(JSON.parse(loginData));


  //장바구니 버튼 클릭했을 때 실행되는 함수
  const insertCart = () => {
    JSON.parse(loginData) === null
    ?
    //로그인 안 되어 있을 때 alert 띄우고 로그인 모달창 열림
    (
      alert('장바구니는 로그인이 필요한 서비스입니다.'),setIsOpenLogin(true)
    )
    :
    axios.post('/api/carts', {
      itemNum,
      cartCnt,
      memId : JSON.parse(loginData).memId,
    })
    .then(res => {
      console.log(res.data);
      const changePage = confirm('장바구니에 상품을 담았습니다.\n장바구니 페이지로 이동할까요?');
      changePage ? nav('/mypage/shop-cart') : undefined
    })
    .catch(e => {
      console.log(e);
      alert(e.response.data);
    });
  }


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
              <tr>
                <td>판매자</td>
                <td>{itemDetail.seller}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.cart_cnt}>
            <Input
              size='100%'
              type='number'
              value={cartCnt}
              min='1'
              onChange={e => setCartCnt(e.target.value)}
            />
          </div>
          <div className={styles.btns}>
            <Button
              title='찜한상품'
              color='gray'
              size='100%'
            />
            <Button
              title='장바구니'
              size='100%'
              onClick={e => insertCart()}
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
      {/* 로그인 Modal */}
      <Login isOpenLogin={isOpenLogin}
        onClose={()=>setIsOpenLogin(false)}
      />
    </div>
  )
}

export default ProductDetail