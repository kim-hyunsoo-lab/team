import React from 'react'
import styles from './AdminHeader.module.css'
import Input from '../../common/Input'

const AdminHeader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.img_div}>헤더이미지</div>
        <div className={styles.body}>
          <ul>
            <li>관리자님, 안녕하세요.</li>
            <li>로그아웃</li>
            <li>공지사항</li>
          </ul>
          <Input />
        </div>
      </div>
      <div className={styles.menu}>
        <ul>
          <li>home</li>
          <li>메뉴1</li>
          <li>메뉴2</li>
        </ul>
      </div>
    </div>
  )
}

export default AdminHeader