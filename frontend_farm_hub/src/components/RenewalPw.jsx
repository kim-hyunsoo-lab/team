import React, { useState } from 'react'
import styles from './RenewalPw.module.css'
import Modal from '../common/Modal'
import axios from 'axios'
import { useNavigate } from 'react-router'
import Input from '../common/Input'
import Button from '../common/Button'


const RenewalPw = ({isOpenRenewalPw, onClose, memId}) => {  
  const nav = useNavigate();
  const memPwRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;

  const [errorMsg, setErrorMsg] = useState({
    'memPw': '',
    'confirmPw': ''
    });

  const [newPw, setNewPw] = useState({
    'memPw': '',
    'confirmPw': ''    
  })

  const settingNewPw = (e) =>{
    setNewPw({
      ...newPw,
      [e.target.name]: e.target.value
    })
  }  

  const RenewingPw = (e) => {
    if ((newPw.memPw) && (memPwRegex.test(newPw.memPw)) && (newPw.memPw === newPw.confirmPw)){
      axios.put('/api/members/renewalPw', {'memId': memId, 'memPw': newPw.memPw})
      .then(res => {
        alert('비밀번호가 변경되었습니다. 다시 로그인해주세요');
        setNewPw({
          'memPw': '',
          'confirmPw': '' 
        })
        onClose(); 
        nav('/');})
      .catch(e=>console.log(e))      
    }
    else (alert('새 비밀번호를 조건에 맞게 입력해주세요'))
  }
  
  const handleErrorMsg = (e) =>{
    let errorStr = '';
    const memPwRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;

    switch(e.target.name){
      case 'memPw':
        if (!e.target.value)
          errorStr = '비밀번호는 비워둘 수 없습니다'    
        else if(!memPwRegex.test(e.target.value))
          errorStr = '비밀번호는 영문과 숫자의 조합이어야 합니다'   
        else 
          errorStr = ''; 
        break;  
        
      case 'confirmPw':
        if(e.target.value !== newPw.memPw){
        errorStr = '비밀번호가 일치하지 않습니다';
        }
        break;
      }     
      return errorStr;        
    }  

  return (
    <Modal isOpen={isOpenRenewalPw}
      title='Renewal Password'
      size='300px'    
      onClose={()=>{
        onClose();
        setNewPw({
          'memPw': '',
          'confirmPw': '' 
        })
      }}
    >

    <div className={styles.container}>
      <div>
        <h5>아이디: {memId}</h5>              
      </div>
      <div>
        <h5>새 비밀번호</h5>
        <div>
          <Input           
            onChange={e=>{settingNewPw(e); setErrorMsg({
            ...errorMsg,
            'memPw': handleErrorMsg(e)})
          }}   
            value={newPw.memPw}
            name='memPw'
            type='password'
            size='100%' />
        </div>
        <p className={styles.errorMsg}>{errorMsg.memPw}</p>
      </div>
      
      <div>
        <h5>새 비밀번호 확인</h5>
        <div>
          <Input 
            onChange={e=>{settingNewPw(e); setErrorMsg({
              ...errorMsg,
              'confirmPw': handleErrorMsg(e)})
            }}      
            value={newPw.confirmPw}
            name='confirmPw'
            type='password'
            size='100%' />
        </div>
        <p className={styles.errorMsg}>{errorMsg.confirmPw}</p>
      </div>
      
      <div>
        <Button 
          onClick={e=>RenewingPw(e)}
          size='100%'    
          title='비밀번호 변경'
        />
      </div>
    </div>
    </Modal>
  )
}

export default RenewalPw