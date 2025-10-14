import React, { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import styles from './ForgotPw.module.css'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import RenewalPw from './RenewalPw'
import axios from 'axios'

const ForgotPw = ({isOpenForgotPw, onClose}) => {  
  // 비밀번호 찾기 질문 목록 변수
  const [pwQ, setPwQ] = useState([]) 

  const [userProfile, setUserProfile] = useState({
    'memId': '', // 아이디
    'memName': '', // 이름
    'firstEmail':'', // 이메일
    'secondEmail':'',
    'memEmail':'',
    'pwKey': '',
    'pwAnswer':''
  })

  const [realMemId, setRealMemId] = useState('')

  //console.log(userProfile);

    // 값 입력시 실행하는 함수
  const settingUserProfile = (e) => {
    // 이메일 시
    if (e.target.name === 'firstEmail' || e.target.name === 'secondEmail'){
      setUserProfile({
        ...userProfile,
        [e.target.name]: e.target.value,
        'memEmail': 
          e.target.name === 'firstEmail' 
          ? e.target.value + userProfile.secondEmail
          : userProfile.firstEmail + e.target.value
      })         
    }
    // 이메일 이외의 항목 변경 시
    else (setUserProfile({
      ...userProfile,
      [e.target.name]: e.target.value
    }))
  };

useEffect(() => {
  const controller = new AbortController();
  axios.get('/api/members/pw-question', {
    signal: controller.signal
  })
  .then((res) => {
    setPwQ(res.data);
  })
  .catch(error => {
    if (error.name !== 'CanceledError') {
      console.log(error);
    }
  });
  
  return () => {
    controller.abort();
  };
}, []);

  const setNewPw = () => {
    axios.get(`/api/members/forgotPw/${userProfile.memId}`)
      .then(res => {
        const isMatch = ['memId', 'memName', 'memEmail', 'pwKey', 'pwAnswer']
          .every(key => res.data[key] == userProfile[key]);
        
        if (isMatch) {
          alert('비밀번호 변경 페이지로 이동합니다');
          onClose(); 
          setIsOpenRenewalPw(true);
          setUserProfile({        
            'memName': '', 
            'firstEmail':'', 
            'secondEmail':'',
            'memEmail':'',
            'pwKey': '',
            'pwAnswer':''
          });
        } else {
          alert('내용이 일치하지 않습니다');
        }
      })
      .catch(error => console.log(error));
    }
  
// 비번 새로 설정 Modal 창 숨김/보이기 여부
  const [isOpenRenewalPw, setIsOpenRenewalPw] = useState(false);

  return (
    <>
    <Modal isOpen={isOpenForgotPw}
      title='Forgot Password'
      size='300px'    
      onClose={()=>{
        onClose();
        setUserProfile({
          'memId': '', 
          'memName': '', 
          'firstEmail':'', 
          'secondEmail':'',
          'memEmail':'',
          'pwKey': ''
        })
      }}
    >

    <div className={styles.container}>
      <div>
        <h5>아이디</h5>
        <Input onChange={e=>{settingUserProfile(e), setRealMemId(e.target.value)}}
        value={userProfile.memId}
        name='memId'
        size='100%'
        onKeyDown={e=>{
            if(e.key==='Enter') setNewPw()
          }}
        ></Input>
      </div>
      <div>
        <h5>성명</h5>
        <Input onChange={e=>settingUserProfile(e)}
        value={userProfile.memName}
        name='memName'
        size='100%'
        onKeyDown={e=>{
            if(e.key==='Enter') setNewPw()
          }}
        ></Input>
      </div>
      
      <div>
        <h5>이메일</h5>
          <div>
            <Input onChange={e=>settingUserProfile(e)}
            value={userProfile.firstEmail}
            onKeyDown={e=>{
            if(e.key==='Enter') setNewPw()
          }}
            name='firstEmail'
            size='100%'/>

            <Select onChange={e=>settingUserProfile(e)}
            value={userProfile.secondEmail}
            name='secondEmail'
            size='100%'>
  {/* 이메일 추가 가능 */}
              <option value=''>선택</option>
              <option value='@gmail.com'>@gmail.com</option>
              <option value='@naver.com'>@naver.com</option>
              <option value='@hanmail.net'>@hanmail.net</option>
            </Select>              
          </div>
      </div>

      <div>
        <h5>비밀번호 찾기 질문 선택</h5>
        <Select size='100%' name='pwKey' onChange={e=>settingUserProfile(e)}>
          <option key='-5' value="">선택</option>
            {pwQ.map((e, i)=>{
              return(
              <option key={i} value={e.pwKey}>{e.pwQuestion}</option>
              )
            })} 
        </Select>
      </div>
      <div>
        <h5>질문 답변</h5>
        <Input onChange={e=>settingUserProfile(e)}
        value={userProfile.pwAnswer}
        name='pwAnswer'
        size='100%'
        onKeyDown={e=>{
            if(e.key==='Enter') setNewPw()
          }}
        ></Input>
      </div>
      <div>
        <Button           
          onClick={e=>setNewPw()}
          title='비밀번호 찾기'
          size='100%'     
        />
      </div>
    </div>    
    </Modal>
    
    {/* 비번 새로 설정 Modal */}
    <RenewalPw memId={realMemId} isOpenRenewalPw={isOpenRenewalPw} 
      onClose={()=>setIsOpenRenewalPw(false)}/>
    </>
  )
}

export default ForgotPw