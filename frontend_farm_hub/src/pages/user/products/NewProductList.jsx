import React from 'react'
import styles from './NewProductList.module.css'
import PageTitle from '../../../common/PageTitle'
import { useNavigate } from 'react-router'
import Menu from '../../../components/Menu'
import NewProducts from '../../../components/ProductList/NewProducts'

const NewProductList = () => {
  const nav = useNavigate();

  return (
    <div className={styles.container}>
      <Menu />
      <NewProducts />
    </div>
  )
}

export default NewProductList