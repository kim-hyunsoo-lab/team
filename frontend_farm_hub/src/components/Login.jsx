import React, { useState } from "react";
import styles from "./Login.module.css";
import Modal from "../common/Modal";
import { useNavigate } from "react-router";
import axios from "axios";
import Button from "../common/Button";
import Input from "../common/Input";
import ForgotPw from "./ForgotPw";

const Login = ({ isOpenLogin, onClose }) => {
  const nav = useNavigate();

  // 비밀번호 찾기 Modal 창 숨김/보이기 여부
  const [isOpenForgotPw, setIsOpenForgotPw] = useState(false);

  // 로그인 정보
  const [loginData, setLoginData] = useState({
    memId: "",
    memPw: "",
  });

  const settingLoginData = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const loginNow = (e) => {
    axios
      .get("/api/members/login", { params: loginData })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          // 로그인한 id, 이름, 권한 정보만을 갖는 객체를 별도로 생성
          const loginInfo = {
            memId: res.data.memId,
            memName: res.data.memName,
            memRole: res.data.memRole,
          };
          console.log(loginInfo);
          console.log(JSON.stringify(loginInfo));

          // 로그인한 유저의 id, 이름, 권한을 sessionStorage에 저장
          sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));

          // ※ 유저인지 관리자인지
          if (res.data.memRole == "ADMIN")
            // ※관리자 디폴트 페이지 확인
            nav(`/admin`);
          else {
            setLoginData({
              memId: "",
              memPw: "",
            });
            onClose();
            nav(`/`);
          }
        } else {
          alert("ID 혹은 비밀번호가 일치하지 않습니다");
        }
      })
      .catch((error) => {
      console.log(error);
      // 401 에러 또는 다른 에러 처리
      if (error.response) {
        // 서버가 응답을 반환한 경우
        if (error.response.status === 401) {
          alert(error.response.data || "ID 혹은 비밀번호가 일치하지 않습니다");
        } else {
          alert("로그인 중 오류가 발생했습니다");
        }
      } else {
        // 네트워크 오류 등
        alert("서버와의 연결에 실패했습니다");
      }
    });
  };

  return (
    <>
      <Modal isOpen={isOpenLogin} title="Login" size="300px" onClose={() => {
        onClose();
        setLoginData({
          memId: "",
          memPw: "",
        });
      }}>
        <div className={styles.container}>
          {/* 아이디 */}
          <div>
            <Input
              size="100%"
              placeholder="Username"
              name="memId"
              onChange={(e) => settingLoginData(e)}
              value={loginData.memId}
              onKeyDown={(e) => {
                if (e.key === "Enter") loginNow();
              }}
            />
            <span>
              <i className="bi bi-person-circle"></i>
            </span>
          </div>

          {/* 비밀번호 */}
          <div>
            <Input
              onChange={(e) => settingLoginData(e)}
              name="memPw"
              size="100%"
              placeholder="Password"
              type="password"
              value={loginData.memPw}
              onKeyDown={(e) => {
                if (e.key === "Enter") loginNow();
              }}
            />
            <span>
              <i className="bi bi-lock"></i>
            </span>
          </div>

          <div>
            {/* 확인 버튼 */}
            <Button 
            onKeyDown={e=>{if(e.key==='Enter') loginNow(e)}}
            onClick={(e) => loginNow(e)} 
            size="100%" title="Sign In" />
          </div>

          <div>
            {/* 비밀번호 찾기 버튼 */}
            <Button
              onClick={(e) => {
                onClose(), setIsOpenForgotPw(true);
              }}
              size="100%"
              title="Forgot Password"
              color="grey"
            />
          </div>
        </div>
      </Modal>

      {/* 비번찾기 Modal */}
      <ForgotPw
        isOpenForgotPw={isOpenForgotPw}
        onClose={() => setIsOpenForgotPw(false)}
      />
    </>
  );
};

export default Login;
