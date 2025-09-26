import React from "react";
import styles from "./MypageSide.module.css";
import { useNavigate } from "react-router";

const MypageSide = () => {
  const nav = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.category}>
        <p>쇼핑정보</p>
        <ul>
          <li>
            <span>
              <i className="bi bi-file-earmark-text-fill"></i>
            </span>
            주문목록/배송조회
          </li>
          <li>
            <span>
              <i className="bi bi-file-earmark-text-fill"></i>
            </span>
            취소/반품/교환 내역
          </li>
          <li>
            <span>
              <i className="bi bi-file-earmark-text-fill"></i>
            </span>
            찜 리스트
          </li>
          <li onClick={e => {nav('/mypage/shop-cart')}}>
            <p>
              <span>
                <i className="bi bi-file-earmark-text-fill"></i>
              </span>
            장바구니
            </p>
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>혜택 관리</p>
        <ul>
          <li>
            <span>
              <i className="bi bi-bar-chart-line-fill"></i>
            </span>
            쿠폰
          </li>
          <li>
            <span>
              <i className="bi bi-bar-chart-line-fill"></i>
            </span>
            적립금
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>회원정보</p>
        <ul>
          <li onClick={e => {nav('/mypage/update')}}>
            <p>
              <span>
                <i className="bi bi-person-lines-fill"></i>
              </span>
              회원정보 수정
            </p>
          </li>
          <li onClick={e => {nav('/mypage/memdel')}}>
            <p>
              <span>
                <i className="bi bi-person-lines-fill"></i>
              </span>
              회원 탈퇴
            </p>
          </li>
          <li>
            <p>
              <span>
                <i className="bi bi-person-fill-gear"></i>
              </span>
              배송지 관리
            </p>
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>나의 게시글</p>
        <ul>
          <li>
            <p>
              <span>
                <i className="bi bi-bag-plus-fill"></i>
              </span>
              1:1 문의
            </p>
          </li>
          <li>
            <span>
              <i className="bi bi-bag-check-fill"></i>
            </span>
            상품문의
          </li>
          <li>
            <span>
              <i className="bi bi-bag-check-fill"></i>
            </span>
            상품후기
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MypageSide;
