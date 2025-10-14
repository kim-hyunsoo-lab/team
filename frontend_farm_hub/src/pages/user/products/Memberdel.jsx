import React, { useState } from "react";
import Textarea from "../../../common/Textarea";
import Button from "../../../common/Button";
import styles from "./Memberdel.module.css";
import Modal from "../../../common/Modal";
import axios from "axios";

const Memberdel = () => {
  //모달창을 열고 닫을 state 변수
  const [isOpenDel, setIsOpenDel] = useState(false);
  //동의 체크박스가 true일때 모달창이 열릴 수 있는 state 변수
  const [isAgreed, setIsAgreed] = useState(false);

  //변경된 데이터를 저장할 변수
  const [delData, setDelData] = useState({
  // 체크박스용 임시 상태 (UI용)
  checkboxes: {
    가격: false,
    기능부족: false,
    경쟁사서비스: false,
    이용빈도감소: false
  },
  // DB로 보낼 실제 데이터
  memId: '',  // 세션에서 가져와야 함
  withDrawal: '',  // "가격,기능부족" 형태
  기타: '',
  reasonUncomfortable: '',
  reasonGood: '',
  reasonImprovement: ''
});

  //input 태그의 속성들을 조정하는 함수
  // 체크박스 전용 핸들러
const handleCheckboxChange = (e) => {
  const { name, checked } = e.target;
  
  setDelData(prev => {
    // 1. 체크박스 상태 업데이트
    const newCheckboxes = {
      ...prev.checkboxes, //기존 값 복사
      [name]: checked //클릭한 것만 변경
    };
    
    // 2. 체크된 항목들만 배열로 수집
    const selectedReasons = Object.keys(newCheckboxes)
      .filter(key => newCheckboxes[key])  // true인 것만
      .map(key => key);  // 키 이름만 추출
    
    // 3. 문자열로 합치기
    return {
      ...prev,
      checkboxes: newCheckboxes,
      withDrawal: selectedReasons.join(',')  // "가격,기능부족"
    };
  });
};

// 텍스트 입력 핸들러
const handleTextChange = (e) => {
  const { name, value } = e.target;
  setDelData(prev => ({
    ...prev,
    [name]: value
  }));
};

  //회원탈퇴 + 설문조사를 실행할 axios 함수
const delSurvey = () => {
  let finalWithdrawal = delData.withDrawal;
  if (delData.기타 && delData.기타.trim()) {
    finalWithdrawal = finalWithdrawal 
      ? `${finalWithdrawal},기타:${delData.기타}` 
      : `기타:${delData.기타}`;
  }
  
  if (!delData.reasonImprovement || !delData.reasonImprovement.trim()) {
    alert('개선사항은 필수 입력입니다!');
    return;
  }

  //세션스토리지에서 로그인 정보 가져오기
  const loginInfoStr = sessionStorage.getItem('loginInfo')

  //JSON 문자열을 객체로 변환
  const loginInfo = JSON.parse(loginInfoStr);
  
  //memId 추출
  const memId = loginInfo.memId; 
  
  const requestData = {
    memId : memId,
    withDrawal: finalWithdrawal,
    reasonUncomfortable: delData.reasonUncomfortable,
    reasonGood: delData.reasonGood,
    reasonImprovement: delData.reasonImprovement
  };
  
  console.log('전송할 데이터:', requestData);
  
  axios
    .post('/api/members/survey', requestData)
    .then(res => {
      alert('회원 탈퇴가 완료되었습니다.\n그동안 이용해주셔서 감사합니다.');
      //세션스토리지에서 로그인 정보 삭제
      sessionStorage.removeItem('loginInfo');
      window.location.replace('/');
    })
    .catch(e => {
      console.log(e)
      console.error('에러:', e.response?.data);
      
      if (e.response?.status === 401) {
        alert('로그인이 필요합니다.');
      } else {
        alert('탈퇴 처리 중 오류가 발생했습니다.');
      }
    });
};



  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>회원 탈퇴</h1>
      </div>

      <div className={styles.intro}>
        <p>
          그동안 저희 쇼핑몰을 이용해주셔서 감사드립니다. 
          <br />불편하신 점이 있었다면
          개선하고자, 의견을 남겨주시면 적극 반영하겠습니다.
        </p>
      </div>

      <div className={styles.surveySection}>
        <h3 className={styles.surveyTitle}>고객 설문조사</h3>

        <div className={styles.question}>
          <p>"어떤 이유로 서비스를 탈퇴하시나요?"</p>
          <div className={styles.checkboxGroup}>
            <label>
              <input 
                type="checkbox" 
                name="가격" 
                checked={delData.checkboxes.가격}
                onChange={(e) => {handleCheckboxChange(e)}}  // 체크박스 전용 핸들러
              />
              <span>가격</span>
            </label>
            <label>
              <input 
              type="checkbox" 
              name="기능부족" 
              checked={delData.checkboxes.기능부족}
                onChange={(e) => {handleCheckboxChange(e)}}  // 체크박스 전용 핸들러

              />
              <span>기능 부족</span>
            </label>
            <label>
              <input 
              type="checkbox" 
              name="경쟁사서비스" 
              checked={delData.checkboxes.경쟁사서비스}
                onChange={(e) => {handleCheckboxChange(e)}}  // 체크박스 전용 핸들러

              />
              <span>경쟁사 서비스</span>
            </label>
            <label>
              <input 
              type="checkbox" 
              name="이용빈도감소" 
              checked={delData.checkboxes.이용빈도감소}
                onChange={(e) => {handleCheckboxChange(e)}}  // 체크박스 전용 핸들러

              />
              <span>이용빈도 감소</span>
            </label>
          </div>
          <input
            type="text"
            name="기타"
            value={delData.기타}
              onChange={handleTextChange}
            placeholder="기타사항을 입력해주세요"
            className={styles.otherInput}
          />
        </div>

        <div className={styles.questionGroup}>
          <div className={styles.question}>
            <p>"서비스 이용중 불편했던 점은 무엇인가요?"</p>
            <Textarea 
            width="100%" 
            name='reasonUncomfortable'
            value={delData.reasonUncomfortable}
            onChange={handleTextChange}
            className={styles.TextProp}/>
          </div>
          <div className={styles.question}>
            <p>"서비스 이용중 좋았던 점은 무엇인가요?"</p>
            <Textarea 
            width="100%"
            name='reasonGood'
            value={delData.reasonGood}
            onChange={handleTextChange}
            className={styles.TextProp}/>
          </div>
        </div>

        <div className={styles.questionGroup}>
          <div className={styles.question}>
            <p>"서비스를 개선하고자 하오니 자유롭게 작성해주세요!"</p>
            <Textarea 
            width="100%"
            name='reasonImprovement'
            value={delData.reasonImprovement}
            onChange={handleTextChange}
            className={styles.TextProp}/>
          </div>
        </div>
      </div>

      <div className={styles.agreement}>
        <p>
          개인정보 삭제 및 보유자산 소멸에 대한 안내를 모두 숙지하고 회원탈퇴에
          대해 동의하여 주시기 바랍니다.
        </p>
        <label className={styles.agreementCheckbox}>
          <input 
            type="checkbox"
            checked={isAgreed}
            onChange={e => setIsAgreed(e.target.checked)}
          />
          <span>위 내용을 모두 숙지하였으며, 회원탈퇴에 동의합니다.</span>
        </label>
      </div>

      <div className={styles.buttonGroup}>
        <Button title="취소" />
        <Button
          title="확인"
          onClick={() => {
            if(!isAgreed){
              alert('회원탈퇴에 동의해주세요.')
              return
            }
            setIsOpenDel(true);
          }}
        />
      </div>
      <div>
        <Modal isOpen={isOpenDel} onClose={() => setIsOpenDel(false)} 
          className={styles.modal_delete}
          >
          <p>이 서비스의 모든 정보를 삭제하시겠습니까?</p>
          <p>해당 서비스 이용이 제한되오며, 고객에 대한 개인정보를 의무적으로 3년간 보장함을 알려드립니다.</p>
          <div>
            <Button title="취소" onClick={() => {setIsOpenDel(false)}}/>
            <Button title="확인" onClick={() => {delSurvey()}} />
          </div>
        </Modal>
      </div>

      <p className={styles.footer}>
        지금까지 저희 쇼핑몰을 이용해주셔서 감사합니다.
        <br />
        더욱 더 좋은 서비스와 품질로 보답하겠습니다.
        <br />
        그동안 감사합니다!!
      </p>
    </div>
  );
};

export default Memberdel;
