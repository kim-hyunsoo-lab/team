import React, { useEffect, useState } from "react";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import styles from "./UserInfoUpdate.module.css";
import axios from "axios";
import Select from "../../../common/Select";
import { useDaumPostcodePopup } from "react-daum-postcode";

const UserInfoUpdate = () => {
  // 다음 주소록
  const daumOpen = useDaumPostcodePopup(
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  //데이터베이스에서 회원 정보를 조회 -> 우선 로그인한 회원 id가 있어야함
  const data = sessionStorage.getItem("loginInfo");
  const result = JSON.parse(data);

  //회원 정보 수정 시 회원 상세 정보를 재조회 하기 위한 변수
  const [update, setUpdate] = useState(0);

  // 회원정보 조회 결과를 저장할 state 변수
  const [selectMember, setSelectMember] = useState({
    memName: "",
    memPw: "",
    confirmPw: "",
    memTel: ["", "", ""],
    memAddr: "",
    addrDetail: "",
    memEmail: "",
    firstEmail: "",
    secondEmail: "",
  });

  useEffect(() => {
    axios
      .get(`/api/members/select/${result.memId}`)
      .then((res) => {
        console.log(res.data);
        // 연락처와 이메일을 분리하여 state에 저장
        const phone = res.data.memTel.split("-");
        const email = res.data.memEmail.split("@");

        setSelectMember({
          ...res.data,
          memTel: phone,
          firstEmail: email[0],
          secondEmail: "@" + email[1],
          confirmPw: "",
        });
      })
      .catch((error) => console.log(error));
  }, [update]);

  // 유효성 검사 결과 에러 메세지를 출력할 state 변수
  const [errorMsg, setErrorMsg] = useState({
    memPw: "",
    confirmPw: "",
    memTel: "",
    memEmail: "",
    memAddr: "",
  });

  // 각 필드별 실시간 검증 함수
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "memPw":
        if (!value) {
          error = "비밀번호를 입력해주세요.";
        } else if (value.length < 8 || value.length > 12) {
          error = "비밀번호는 8-12자 사이여야 합니다.";
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(value)) {
          error = "영문과 숫자를 모두 포함해야 합니다.";
        }
        break;

      case "confirmPw":
        if (!value) {
          error = "비밀번호 확인을 입력해주세요.";
        } else if (value !== selectMember.memPw) {
          error = "비밀번호가 일치하지 않습니다.";
        }
        break;

      case "firstEmail":
        if (!value) {
          error = "이메일을 입력해주세요.";
        }
        break;

      case "secondEmail":
        if (!value) {
          error = "이메일 도메인을 선택해주세요.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // onChange 핸들러 - 일반 input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectMember({ ...selectMember, [name]: value });

    // 실시간 검증
    const error = validateField(name, value);
    setErrorMsg({ ...errorMsg, [name]: error });

    // 비밀번호 변경 시 confirmPw도 다시 검증
    if (name === "memPw" && selectMember.confirmPw) {
      const confirmError =
        value !== selectMember.confirmPw ? "비밀번호가 일치하지 않습니다." : "";
      setErrorMsg((prev) => ({
        ...prev,
        memPw: error,
        confirmPw: confirmError,
      }));
    }
  };

  // 연락처 변경 핸들러
  const handleTelChange = (index, value) => {
    // 숫자만 입력 가능
    const numericValue = value.replace(/[^0-9]/g, "");

    const newTel = [...selectMember.memTel];
    newTel[index] = numericValue;
    setSelectMember({ ...selectMember, memTel: newTel });

    // 연락처 검증
    let error = "";
    if (newTel.some((part) => part === "")) {
      error = "연락처를 모두 입력해주세요.";
    }
    setErrorMsg({ ...errorMsg, memTel: error });
  };

  // 주소록 호출 함수
  const getAddressBook = () => {
    daumOpen({
      onComplete: (data) => {
        setSelectMember({
          ...selectMember,
          memAddr: data.address,
        });
      },
    });
  };

  //버튼 클릭시 동작
  const handleCancel = () => {
    // 수정 취소시 reload되어 다시 조회
    window.location.reload();
  };

  const handleConfirm = () => {
    // 최종 유효성 검사
    const errors = {};

    if (!selectMember.memPw) {
      errors.memPw = "비밀번호를 입력해주세요.";
    }
    if (!selectMember.confirmPw) {
      errors.confirmPw = "비밀번호 확인을 입력해주세요.";
    }
    if (selectMember.memPw !== selectMember.confirmPw) {
      errors.confirmPw = "비밀번호가 일치하지 않습니다.";
    }
    if (selectMember.memTel.some((part) => part === "")) {
      errors.memTel = "연락처를 모두 입력해주세요.";
    }
    if (!selectMember.firstEmail || !selectMember.secondEmail) {
      errors.memEmail = "이메일을 입력해주세요.";
    }

    // 에러가 있으면 표시하고 중단
    if (Object.keys(errors).length > 0) {
      setErrorMsg({ ...errorMsg, ...errors });
      return;
    }

    // 서버로 전송할 데이터 준비
    const updatedMember = {
      ...selectMember,
      memTel: selectMember.memTel.join("-"),
      memEmail: selectMember.firstEmail + selectMember.secondEmail,
    };

    axios
      .put(`/api/members/update/${result.memId}`, updatedMember)
      .then((res) => {
        console.log("수정 성공:", res.data);
        alert("회원정보가 수정되었습니다.");
        setUpdate(update + 1);
      })
      .catch((error) => {
        console.log("수정 실패:", error);
        alert("회원정보 수정에 실패했습니다.");
      });
  };

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
                <td>{result.memName}</td>
              </tr>
              <tr>
                <td>아이디</td>
                <td>{result.memId}</td>
              </tr>
              <tr>
                <td>비밀번호</td>
                <td>
                  <Input
                    size="20%"
                    name="memPw"
                    type="password"
                    value={selectMember.memPw}
                    onChange={handleInputChange}
                  />
                  <span>영문과 숫자 12자리 이하만 가능합니다.</span>
                  {errorMsg.memPw && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginTop: "5px",
                      }}
                    >
                      {errorMsg.memPw}
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td>비밀번호 확인</td>
                <td>
                  <Input
                    size="20%"
                    name="confirmPw"
                    type="password"
                    value={selectMember.confirmPw}
                    onChange={handleInputChange}
                  />
                  <span>비밀번호를 한번 더 입력해주세요.</span>
                  {errorMsg.confirmPw && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginTop: "5px",
                      }}
                    >
                      {errorMsg.confirmPw}
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>
                  <Input
                    size="13%"
                    value={selectMember.memTel[0]}
                    onChange={(e) => handleTelChange(0, e.target.value)}
                    maxLength="3"
                  />
                  <span>-</span>
                  <Input
                    size="20%"
                    value={selectMember.memTel[1]}
                    onChange={(e) => handleTelChange(1, e.target.value)}
                    maxLength="4"
                  />
                  <span>-</span>
                  <Input
                    size="20%"
                    value={selectMember.memTel[2]}
                    onChange={(e) => handleTelChange(2, e.target.value)}
                    maxLength="4"
                  />
                  <span>숫자만 입력 가능합니다.</span>
                  {errorMsg.memTel && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginTop: "5px",
                      }}
                    >
                      {errorMsg.memTel}
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td>이메일</td>
                <td>
                  <Input
                    size="30%"
                    name="firstEmail"
                    value={selectMember.firstEmail}
                    onChange={handleInputChange}
                  />
                  <span>@</span>
                  <Select
                    name="secondEmail"
                    value={selectMember.secondEmail}
                    onChange={handleInputChange}
                    size="30%"
                  >
                    <option value="">선택</option>
                    <option value="@gmail.com">@gmail.com</option>
                    <option value="@naver.com">@naver.com</option>
                    <option value="@hanmail.net">@hanmail.net</option>
                  </Select>
                  {errorMsg.memEmail && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginTop: "5px",
                      }}
                    >
                      {errorMsg.memEmail}
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td>주소</td>
                <td>
                  <Input
                    size="50%"
                    value={selectMember.memAddr}
                    name="memAddr"
                    readOnly={true}
                  />
                  <Button title="검색" onClick={getAddressBook} />
                </td>
              </tr>
              <tr>
                <td>상세주소</td>
                <td>
                  <Input
                    size="50%"
                    value={selectMember.addrDetail}
                    name="addrDetail"
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.btns}>
          <Button title="취소" onClick={handleCancel} />
          <Button title="확인" onClick={handleConfirm} />
        </div>
      </div>
    </>
  );
};

export default UserInfoUpdate;
