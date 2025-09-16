import React, { useState } from 'react'
import Modal from '../common/Modal'
import styles from './ForgotPw.module.css'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'

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


  // 비밀번호 찾기 질문목록 호출
// ※비밀번호 찾기 질문 api 주소 나중에 만들면 확인  
//   useEffect(()=>{axios.get('/api/ ??? ')
//   .then((res)=>{
//     console.log(res.data);
//     setPwQ(res.data);})
//   .catch(error=>console.log(error));
// }, [])


  const setNewPw = () =>{
// ※ 비번 확인 api 주소 나중에 만들면 확인   
    axios.get(`/api/ ??? /${userProfile.memId}`)
    .then(res => 
      {if (res.data.memId === userProfile.memId
        && res.data.memName === userProfile.memName
        && res.data.memEmail === userProfile.memEmail
        && res.data.pwKey === userProfile.pwKey
        && res.data.pwAnswer === userProfile.pwAnswer
      )    
      {
        alert('비밀번호 변경 페이지로 이동합니다');
        onClose(); 
      }
      else {alert('내용이 일치하지 않습니다');        
      }})
    .catch(error=>console.log(error));
  }


  




  return (
    <Modal isOpen={isOpenForgotPw}
      title='Forgot Password'
      size='300px'    
      onClose={onClose}
    >

    <div className={styles.container}>
      <div>
        <h5>아이디</h5>
        <Input onChange={e=>settingUserProfile(e)}
        value={userProfile.memId}
        name='memId'
        size='100%'
        ></Input>
      </div>
      <div>
        <h5>성명</h5>
        <Input onChange={e=>settingUserProfile(e)}
        value={userProfile.memName}
        name='memName'
        size='100%'
        ></Input>
      </div>
      
      <div>
        <h5>이메일</h5>
          <div>
            <Input onChange={e=>settingUserProfile(e)}
            value={userProfile.firstEmail}
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
              <option key={i} value={e.pwkey}>{e.pwQuestion}</option>
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
        ></Input>
      </div>
      <div>
        <Button           
          onClick={e=>setNewPw(e)}
          title='비밀번호 찾기'
          size='100%'     
        />
      </div>
    </div>    
    </Modal>
  )
}

export default ForgotPw