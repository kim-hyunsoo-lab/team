import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router";
import UserLayout from "./layout/user/UserLayout";
import Home from "./pages/user/Home";
import NewProductList from "./pages/user/products/NewProductList";
import PopularProductList from "./pages/user/products/PopularProductList";
import DiscountProductList from "./pages/user/products/DiscountProductList";
import AdminLayout from "./layout/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import ProductDetail from "./pages/user/products/ProductDetail";
import ProductIntro from "./components/ProductDetail/ProductIntro";
import QnA from "./components/ProductDetail/QnA";
import Review from "./components/ProductDetail/Review";
import RegProduct from "./pages/admin/products/RegProduct";
import RegReview from "./components/ProductDetail/RegReview";
import axios from "axios";
import MemberList from "./pages/admin/MemberList";
import Mypage from "./pages/user/Mypage";
import MemberInfo from "./pages/user/products/Memberdel";
import UserInfoUpdate from "./pages/user/products/UserInfoUpdate";
import Memberdel from "./pages/user/products/Memberdel";
import ShopCart from "./pages/ShopCart";

function App() {


  return (
    <>
      <Routes>
        {/* 일반 사용자 페이지 */}

        <Route path='/' element={ <UserLayout /> }>
          <Route
            path=''
            element={ <Home /> }
          />
          <Route
            path='new-product-list'
            element={ <NewProductList /> }

          />

          <Route path="product-detail/:itemNum" element={<ProductDetail />}>
            <Route path="intro" element={<ProductIntro />} />
            {/* <Route path='review' element={ <Review /> } /> */}
            <Route path="qna" element={<QnA />} />
          </Route>
          <Route path="popular-product-list" element={<PopularProductList />} />
          <Route
            path="discount-product-list"
            element={<DiscountProductList />}
          />
        </Route>

        {/* 일반사용자 개인페이지 */}

        <Route path="/mypage" element={<Mypage />}>
          <Route path="/mypage/update" element={<UserInfoUpdate />} />
          <Route path="/mypage/memdel" element={<Memberdel />} />
          <Route path="shop-cart" element={ <ShopCart /> } />
        </Route>

        {/* 관리자 페이지 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<AdminHome />} />
          <Route path="reg-product" element={<RegProduct />} />
          <Route path="member-list" element={<MemberList />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
