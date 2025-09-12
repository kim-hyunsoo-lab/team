import React from 'react'
import styles from './UserHeader.module.css'
import Input from '../../common/Input'
import { NavLink, useNavigate } from 'react-router'

const UserHeader = () => {

  const nav = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.members}>
        <p>
          <span><i className='bi bi-star-fill'></i></span>
          즐겨찾기
        </p>
        <ul>
          <li>로그인</li>
          <li>회원가입</li>
          <li>장바구니</li>
          <li>주문/배송조회</li>
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
    </div>
  )
}

export default UserHeader