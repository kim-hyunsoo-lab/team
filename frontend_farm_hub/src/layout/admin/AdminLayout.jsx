import React, { useEffect } from 'react'
import styles from './AdminLayout.module.css'
import { Outlet, useNavigate } from 'react-router'
import AdminHeader from './AdminHeader'
import AdminSide from './AdminSide'
import axios from 'axios'

const AdminLayout = () => {
  const nav = useNavigate();

  

  //로그인한 회원 ID
  const loginInfo = sessionStorage.getItem('loginInfo');

  console.log(JSON.parse(loginInfo))

  useEffect(() => {
    if(loginInfo === null) {
      alert('접근권한이 없습니다.');
      nav('/');
      return;
    }

    axios.get('api/members/is-admin', {params:{
      memId : JSON.parse(loginInfo).memId,
      memRole : JSON.parse(loginInfo).memRole
    }})
    .then(res => {
      console.log(res.data)
      if (!res.data) {
        alert('접근권한이 없습니다.');
        nav('/');
      }
    })
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <AdminHeader />
      </div>
      <div className={styles.body}>
        <div className={styles.side_menu}>
          <AdminSide />
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout