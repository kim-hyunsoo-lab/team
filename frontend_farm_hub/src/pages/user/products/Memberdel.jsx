import React, { useState } from "react";
import Textarea from "../../../common/Textarea";
import Button from "../../../common/Button";
import styles from "./Memberdel.module.css";
import Modal from "../../../common/Modal";

const Memberdel = () => {
  //모달창을 열고 닫을 state 변수
  const [isOpenDel, setIsOpenDel] = useState(false);

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
              <input type="checkbox" />
              <span>가격</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>기능 부족</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>경쟁사 서비스</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>이용빈도 감소</span>
            </label>
          </div>
          <input
            type="text"
            placeholder="기타사항을 입력해주세요"
            className={styles.otherInput}
          />
        </div>

        <div className={styles.questionGroup}>
          <div className={styles.question}>
            <p>"서비스 이용중 불편했던 점은 무엇인가요?"</p>
            <Textarea />
          </div>
          <div className={styles.question}>
            <p>"서비스 이용중 좋았던 점은 무엇인가요?"</p>
            <Textarea />
          </div>
        </div>

        <div className={styles.questionGroup}>
          <div className={styles.question}>
            <p>"서비스를 개선하고자 하오니 자유롭게 작성해주세요!"</p>
            <Textarea />
          </div>
          <div className={styles.question}>
            <p>"서비스가 개선된다면 재가입할 의향이 있으신가요?"</p>
            <Textarea />
          </div>
        </div>
      </div>

      <div className={styles.agreement}>
        <p>
          개인정보 삭제 및 보유자산 소멸에 대한 안내를 모두 숙지하고 회원탈퇴에
          대해 동의하여 주시기 바랍니다.
        </p>
        <label className={styles.agreementCheckbox}>
          <input type="checkbox" required />
          <span>위 내용을 모두 숙지하였으며, 회원탈퇴에 동의합니다.</span>
        </label>
      </div>

      <div className={styles.buttonGroup}>
        <Button title="취소" />
        <Button
          title="확인"
          onClick={() => {
            setIsOpenDel(true);
          }}
        />
      </div>
      <div>
        <Modal isOpen={isOpenDel} onClose={() => setIsOpenDel(false)}>
          

          <div>
            <Button title="취소"/>
            <Button title="확인"/>
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
