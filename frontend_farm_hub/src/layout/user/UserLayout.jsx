import React from 'react'
import UserHeader from './UserHeader'
import { Outlet } from 'react-router'
import styles from './UserLayout.module.css'

const UserLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}><UserHeader /></div>
      <div className={styles.content}><Outlet /></div>
    </div>
  )
}

export default UserLayout