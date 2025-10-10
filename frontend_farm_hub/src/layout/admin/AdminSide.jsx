import React from 'react'
import styles from './AdminSide.module.css'
import { NavLink } from 'react-router'

const AdminSide = () => {
  return (
    <div className={styles.container}>
      <div className={styles.category}>
        <p>판매목록조회</p>
        <ul>
          <li>          
            <NavLink to={`sales-list`}>
              <p>
              <span><i className="bi bi-file-earmark-text-fill"></i></span>
              판매 목록
              </p>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>매출 조회</p>
        <ul>
          <li>
            <span><i className="bi bi-bar-chart-line-fill"></i></span>
            매출 조회
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>회원정보조회</p>
        <ul>
          <li>
            <NavLink to={`member-list`}>
              <p>
              <span><i className="bi bi-person-lines-fill"></i></span>
              회원 목록
              </p>
            </NavLink>
          </li>
          <li>
            <span><i className="bi bi-person-fill-gear"></i></span>
            회원 관리
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>판매상품등록</p>
        <ul>
          <li>
            <NavLink to={'reg-product'}>
              <p>
                <span><i className="bi bi-bag-plus-fill"></i></span>
                상품 등록
              </p>
            </NavLink>
          </li>
          <li>
            <span><i className="bi bi-bag-check-fill"></i></span>
            상품관리
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>상품문의정보</p>
        <ul>
          <li>
            <NavLink to={'qna-reply'}>
              <p>
                <span></span>
                문의답변
              </p>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>축사정보</p>
        <ul>
          <li>          
            <NavLink to={'temperature'}>
              <p>온도</p>
            </NavLink>
            <NavLink to={'humidity'}>
              <p>습도</p>
            </NavLink>
            <NavLink to={'air-quality'}>
              <p>공기질</p>
            </NavLink>
            <NavLink to={'illuminance'}>
              <p>조도</p>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminSide