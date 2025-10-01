import React, { useEffect } from "react";
import MypageSide from "../../layout/user/MypageSide";
import { Outlet, useNavigate } from "react-router";
import UserHeader from "../../layout/user/UserHeader";
import styles from "./Mypage.module.css";

const Mypage = () => {
  const nav = useNavigate();

  //로그인한 회원 ID
  const loginInfo = sessionStorage.getItem('loginInfo');

  //마이페이지를 들어왔는데, 로그인 되어있지 않으면 강제로 상품 목록 페이지로 이동시키기
  useEffect(() => {
    if(loginInfo === null) {
      alert('로그인이 필요한 서비스입니다.');
      nav('/');
      return;
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.myheader}>
        <UserHeader />
      </div>
      <div className={styles.mybody}>
        <MypageSide />
        <Outlet />
      </div>

    </div>
  );
};

export default Mypage;
