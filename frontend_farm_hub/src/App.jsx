import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router'
import UserLayout from './layout/user/UserLayout'
import Home from './pages/user/Home'
import NewProductList from './pages/user/products/NewProductList'
import PopularProductList from './pages/user/products/PopularProductList'
import DiscountProductList from './pages/user/products/DiscountProductList'

function App() {

  return (
    <>
      <Routes>
        {/* 일반 사용자 페이지 */}
        <Route path='/' element={ <UserLayout /> }>
          <Route path='' element={ <Home /> } />
          <Route path='new-product-list' element={ <NewProductList />} />
          <Route path='popular-product-list' element={ <PopularProductList />} />
          <Route path='discount-product-list' element={ <DiscountProductList />} />
        </Route>


        {/* 관리자 페이지 */}
      </Routes>
    </>
  )
}

export default App
