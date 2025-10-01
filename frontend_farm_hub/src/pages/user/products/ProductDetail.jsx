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
  const [cnt, setCnt] = useState(1);
  
  //로그인 데이터
  const loginData = sessionStorage.getItem('loginInfo');

  //로그인 체크 공통 함수
  const checkLogin = (message = '로그인이 필요한 서비스입니다.') => {
    if (JSON.parse(loginData) === null) {
      alert(message);
      setIsOpenLogin(true);
      return false;
    }
    return true;
  };

  //장바구니 버튼 클릭했을 때 실행되는 함수
  const insertCart = () => {
    if (!checkLogin('장바구니는 로그인이 필요한 서비스입니다.')) return;

    axios.post('/api/carts', {
      itemNum,
      cartCnt : cnt,
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

  //구매버튼 클릭했을 시 구매가 실행되는 함수
  const buyItem = () => {
    if (!checkLogin('로그인해 주세요.')) return;

    const confirmBuy = confirm('상품을 구매하시겠습니까?');
    if (!confirmBuy) return;

    axios.post('/api/buy', {
      itemNum,
      memId : JSON.parse(loginData).memId,
      buyCnt : cnt
    })
    .then(res => {
      alert('구매 완료');
      //추후 구매목록 페이지로 이동 예정
      nav('/');
    })
    .catch(e => {
      console.log(e);
      alert(e.response.data);
    });
  }

const fetchItem = () =>{
  axios.get(`/api/items/${itemNum}`)
  .then(res => {
    console.log(res.data);
    setItemDetail(res.data);
  })
  .catch(e => console.log(e));};

useEffect(()=>{
  fetchItem();
  const reviewAvgUpdate = () =>{
    fetchItem();};

  window.addEventListener('reviewUpdated', reviewAvgUpdate);

  return() => {
    window.removeEventListener('reviewUpdated', reviewAvgUpdate);}
}, [itemNum])

  const [reviewList, setReviewList] = useState([]) 

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
              <col width={'22%'} />
              <col width={'78%'} />
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
                <td>만족도 평균</td>
                <td><i className='bi bi-star-fill' />{itemDetail.reviewAvg}</td>
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
              value={cnt}
              min='1'
              onChange={e => setCnt(e.target.value)}
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
              onClick={e => buyItem()}
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
                to={`review/${itemNum}`}
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