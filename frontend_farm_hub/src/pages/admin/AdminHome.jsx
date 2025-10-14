import React from 'react'
import styles from "./AdminHome.module.css";


const AdminHome = () => {
  return (
    <div className={styles.container}>
      <div>
      <img className={styles.banner_img} src="/관리자대문.png"/>    
      </div>
      <div>
        <p>Farm_Hub에 오신 것을 환영합니다</p>
        <p></p>
      </div>
    </div>
  )
}

export default AdminHome