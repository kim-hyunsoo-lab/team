import React, { useEffect, useState } from "react";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import styles from "./UserInfoUpdate.module.css";
import axios from "axios";

const UserInfoUpdate = () => {
  //데이터베이스에서 회원 정보를 조회 -> 우선 로그인한 회원 id가 있어야함
  const data = sessionStorage.getItem("loginInfo");
  const userName = JSON.parse(sessionStorage.getItem("memName"));
  const userId = JSON.parse(sessionStorage.getItem("memId"));

  console.log(data);

  useEffect(() => {
    axios
      .get("/api/members/selectmembers")
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.hearder}>
          <h1>나의 정보</h1>
          <p>고객님께서 가입하신 ~~쇼핑몰의 정보입니다.</p>
          <p>
            안전한 배송 안내를 위하여 연락처와 이메일 주소를 필히 확인
            부탁드립니다.
          </p>

          <h3>필수 회원 정보</h3>
        </div>
        <hr />
        <div>
          <table>
            <tbody>
              <tr>
                <td>이름</td>
                <td>{userName}</td>
              </tr>
              <tr>
                <td>아이디</td>
                <td>{userId}</td>
              </tr>
              <tr>
                <td>비밀번호</td>
                <td>
                  <Input />
                  <p>영문과 숫자 12자리 이하만 가능합니다.</p>
                </td>
              </tr>
              <tr>
                <td>비밀번호 확인</td>
                <td>
                  <Input />
                  <p>비밀번호를 한번 더 입력해주세요.</p>
                </td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>
                  <Input />
                  <Input />
                  <Input />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <Button title="취소" />
          <Button title="확인" />
        </div>
      </div>
    </>
  );
};

export default UserInfoUpdate;
