import React, { useState } from 'react'
import styles from './Join.module.css'
import Modal from '../common/Modal'
import { useDaumPostcodePopup } from 'react-daum-postcode'
import Button from '../common/Button'


const Join = ({isOpenJoin, onClose}) => {
  // 다음 주소록
  const daumOpen = useDaumPostcodePopup('//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');  
  
  // 유효성 검사 결과 에러 메세지를 출력할 state 변수 
  const [errorMsg, setErrorMsg] = useState({
    'memId': '',
    'memPw': '',
    'confirmPw': ''
  });

  // 회원가입 버튼 활성화 여부
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);





  


  return (
    <Modal
      isOpen={isOpenJoin}
      title='Join'
      size='500px'
      onClose={()=>{
        setIsDisabledBtn(true);
        onClose();
        setErrorMsg({
          'memId': '',
          'memPw': '',
          'confirmPw': ''
        })
        
      }}
    >

    <div className={styles.container}>
      <div>
        <h5>아이디</h5>
        <div>



        </div>
        <p>{errorMsg.memId}</p>
      </div>


      <div>
        <h5>비밀번호</h5>
        <div>


        </div>
        <p>{errorMsg.memPw}</p>
      </div>

      <div>
        <h5>비밀번호 확인</h5>
        <div>


        </div>
        <p>{errorMsg.confirmPw}</p>
      </div>




      



      <div>
        <Button 
          disabled={isDisabledBtn}
          onClick={regNewShopMember(e)}
          title='회원가입'
          size='100%'        
        />
      </div>

    </div>

    </Modal>
  )
}

export default Join