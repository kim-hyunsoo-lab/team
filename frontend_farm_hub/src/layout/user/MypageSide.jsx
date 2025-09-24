import React from 'react'
import styles from './MypageSide.module.css'

const MypageSide = () => {
  return (
    <div className={styles.container}>
      <div className={styles.category}>
        <p>장바구니</p>
        <ul>
          <li>
            <span><i className="bi bi-file-earmark-text-fill"></i></span>
            ()
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>개인정보수정</p>
        <ul>
          <li>
            <span><i className="bi bi-bar-chart-line-fill"></i></span>
            비밀번호 변경
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>구매정보</p>
        <ul>
          <li>
              <p>
              <span><i className="bi bi-person-lines-fill"></i></span>
              장바구니
              </p>
          </li>
          <li>
            <span><i className="bi bi-person-fill-gear"></i></span>
              
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>실시간 배송조회</p>
        <ul>
          <li>
              <p>
                <span><i className="bi bi-bag-plus-fill"></i></span>
                ()
              </p>
          </li>
          <li>
            <span><i className="bi bi-bag-check-fill"></i></span>
            ()
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MypageSide