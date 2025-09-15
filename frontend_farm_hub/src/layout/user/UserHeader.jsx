import React, { useState } from 'react'
import styles from './UserHeader.module.css'
import { NavLink, useNavigate } from 'react-router'
import Input from '../../common/Input'
import Login from '../../components/login'
import Join from '../../components/Join'

const UserHeader = () => {
  const nav = useNavigate();

  // loginInfo 데이터 가져오기
  const loginInfo = sessionStorage.getItem('loginInfo');
  const loginInfoData = JSON.parse(loginInfo);

  // 로그인 Modal 창 숨김/보이기 여부
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  
  // 회원가입 Modal 창 숨김/보이기 여부
  const [isOpenJoin, setIsOpenJoin] = useState(false);

  return (   
    <div className={styles.container}>
      <div className={styles.members}>
        <p>
          <span><i className='bi bi-star-fill'></i></span>
          즐겨찾기
        </p>
        <ul>
          {
            loginInfo ?
            <>
              <li>
                <span>{loginInfoData.memId}님 환영합니다</span>
              </li>
              <li>장바구니</li>
              <li>주문/배송조회</li>
              <li onClick={e => {sessionStorage.removeItem('loginInfo'); nav(`/`);}}>로그아웃

              </li>
            </>
            :            
            <>
      
              <li onClick={()=>setIsOpenLogin(true)}>로그인</li>
              <li onClick={()=>setIsOpenJoin(true)}>회원가입</li>
            </>
          }
          <li>고객센터</li>
        </ul>
      </div>
      <div className={styles.search}>
        <div className={styles.img_div} onClick={e => nav('/')}>헤더이미지</div>
       <Input />
      </div>
      <div className={styles.menu}>
        <ul>
          <li>
            <NavLink
              to={'/new-product-list'}
              className={({isActive}) => isActive ? styles.active : undefined}
            >
              <p>신상품</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/popular-product-list'}
              className={({isActive}) => isActive ? styles.active : undefined}
            >
              <p>인기상품</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/discount-product-list'}
              className={({isActive}) => isActive ? styles.active : undefined}
            >
              <p>할인상품</p>
            </NavLink>
          </li>
          <li>
            <NavLink>
              <p>기획전</p>
            </NavLink>
          </li>
        </ul>
      </div>
    
    {/* 로그인 Modal */}
    <Login isOpenLogin={isOpenLogin}
      onClose={()=>setIsOpenLogin(false)} />
    {/* 회원가입 Modal */}
    <Join isOpenJoin={isOpenJoin} 
      onClose={()=>setIsOpenJoin(false)} /> 

    </div>
  )
}

export default UserHeader