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
            <span><i className="bi bi-file-earmark-text-fill"></i></span>
            판매목록
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>매출조회</p>
        <ul>
          <li>
            <span><i className="bi bi-bar-chart-line-fill"></i></span>
            매출조회
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>회원정보조회</p>
        <ul>
          <li>
            <span><i className="bi bi-person-lines-fill"></i></span>
            회원정보
          </li>
          <li>
            <span><i className="bi bi-person-fill-gear"></i></span>
            회원관리
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
                상품등록
              </p>
            </NavLink>
          </li>
          <li>
            <span><i className="bi bi-bag-check-fill"></i></span>
            상품관리
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminSide