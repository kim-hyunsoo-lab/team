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

  // 회원정보 조회 결과를 저장할 state 변수
  const [selectMember, setSelectMember] = useState({
    memId: "",
    memName: "",
    memPw: "",
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
        setSelectMember(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  // 유효성 검사 결과 에러 메세지를 출력할 state 변수
  const [errorMsg, setErrorMsg] = useState({
    memPw: "",
    confirmPw: "",
  });

  // 회원정보 수정시 입력한 내용을 저장할 변수
  const [updateShopMember, setUpdateShopMember] = useState({
    memPw: "", // 비밀번호
    confirmPw: "", // 비번확인
    memTel: ["", "", ""], // 연락처
    memAddr: "", // 주소
    addrDetail: "",
    memEmail: "",
    firstEmail: "",
    secondEmail: "",
  });

  // 주소록 호출 함수
  const getAddressBook = () => {
    daumOpen({
      onComplete: (data) => {
        setOnChangeMember({
          ...onChangeMember,
          memAddr: data.address,
        });
      },
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
                  <Input size="20%" value={selectMember.memPw} />
                  <span>영문과 숫자 12자리 이하만 가능합니다.</span>
                </td>
              </tr>
              <tr>
                <td>비밀번호 확인</td>
                <td>
                  <Input size="20%" />
                  <span>비밀번호를 한번 더 입력해주세요.</span>
                </td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>
                  <Input size="13%" />
                  <span>-</span>
                  <Input size="20%" />
                  <span>-</span>
                  <Input size="20%" />
                </td>
              </tr>
              <tr>
                <td>이메일</td>
                <td>
                  <Input
                    size="30%"
                    name="firstEmail"
                    onChange={(e) => setOnChangeMember(e)}
                  />
                  <span>@</span>
                  <Select
                    name="secondEmail"
                    onChange={(e) => setOnChangeMember(e)}
                    size="30%"
                  >
                    <option value="">선택</option>
                    <option value="@gmail.com">@gmail.com</option>
                    <option value="@naver.com">@naver.com</option>
                    <option value="@hanmail.net">@hanmail.net</option>
                  </Select>
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
                    onChange={(e) => setOnChangeMember(e)}
                  />
                  <Button title="검색" onClick={(e) => getAddressBook(e)} />
                </td>
              </tr>
              <tr>
                <td>상세주소</td>
                <td>
                  <Input
                    size="50%"
                    value={selectMember.addrDetail}
                    name="addrDetail"
                    onChange={(e) => setOnChangeMember(e)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.btns}>
          <Button title="취소" />
          <Button title="확인" />
        </div>
      </div>
    </>
  );
};

export default UserInfoUpdate;
