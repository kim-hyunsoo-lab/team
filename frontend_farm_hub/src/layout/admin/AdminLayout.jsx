import React from 'react'
import styles from './AdminLayout.module.css'
import { Outlet } from 'react-router'
import AdminHeader from './AdminHeader'
import AdminSide from './AdminSide'

const AdminLayout = () => {
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