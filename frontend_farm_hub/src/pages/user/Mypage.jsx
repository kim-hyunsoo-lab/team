import React from "react";
import MypageHeader from "../../layout/user/MypageHeader";
import MypageSide from "../../layout/user/MypageSide";
import { Outlet } from "react-router";
import UserHeader from "../../layout/user/UserHeader";
import styles from "./Mypage.module.css";

const Mypage = () => {
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
