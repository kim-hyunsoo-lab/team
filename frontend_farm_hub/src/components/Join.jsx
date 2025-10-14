import React, { useEffect, useState } from 'react'
import styles from './Join.module.css'
import Modal from '../common/Modal'
import { useDaumPostcodePopup } from 'react-daum-postcode'
import Button from '../common/Button'
import Input from '../common/Input'
import axios from 'axios'
import Select from '../common/Select'
import handleErrorMsg from '../validate/joinValidate'


const Join = ({isOpenJoin, onClose}) => {
  // 다음 주소록
  const daumOpen = useDaumPostcodePopup('//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');  
  
  // 유효성 검사 결과 에러 메세지를 출력할 state 변수 
  const [errorMsg, setErrorMsg] = useState({
    'memId': '',
    'memPw': '',
    'confirmPw': '',
    'pwKey':'',
    'pwAnswer':''
  });

  // 회원가입 버튼 활성화 여부
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);

  // 회원가입시 입력한 내용을 저장할 변수
  const [newShopMember, setNewShopMember] = useState({
    'memId': '', // 아이디
    'memPw': '', // 비밀번호
    'confirmPw':'', // 비번확인

    'memName': '', // 이름
    'memTelArr':['', '', ''], // 연락처

    'firstEmail':'', // 이메일
    'secondEmail':'',
    'memEmail':'',

    'memAddr':'', // 주소
    'addrDetail':'',

    'pwKey': '',
    'pwAnswer':''
  })

  // 비밀번호 찾기 질문 목록 변수
  const [pwQ, setPwQ] = useState([]);

  // 값 입력시 실행하는 함수
  const shopMemberReg = (e) => {

    // 이메일 변경 시
    if (e.target.name === 'firstEmail' || e.target.name === 'secondEmail'){
      setNewShopMember({
        ...newShopMember,
        [e.target.name]: e.target.value,
        'memEmail': 
          e.target.name === 'firstEmail' 
          ? e.target.value + newShopMember.secondEmail
          : newShopMember.firstEmail + e.target.value})         
    }
    // 이메일 이외의 항목 변경 시
    else (setNewShopMember({
      ...newShopMember,
      [e.target.name]: e.target.value}))
    };

  // 회원가입 
  const regNewShopMember = () =>{     
    axios.post('/api/members', newShopMember)
    .then(res => {
      alert('회원으로 등록되었습니다');

      // 페이지 닫기  
      onClose();
      setNewShopMember({
        'memId': '',
        'memPw': '',
        'confirmPw': '', //비밀번호 확인
        'memName': '',
        'memTelArr': ['', '', ''], //연락처는 3개 받아야함 

        'firstEmail': '',
        'secondEmail': '',
        'memEmail':'', // 이메일도 분할해서 받기

        'memAddr':'',
        'addrDetail':'',
      
        'pwKey': '',
        'pwAnswer':''
      });
    })
    .catch(error=>console.log(error));    
  }
  
  // 아이디 중복여부 확인
  const checkId = () => {   
    axios.get(`/api/members/${newShopMember.memId}`)
    .then(res => 
      {if (res.data){
        alert('사용가능한 아이디입니다'); 
        setIsDisabledBtn(false);
      }
      else {alert('사용할 수 없는 아이디입니다');
        setIsDisabledBtn(true);
      }})
    .catch(error=>console.log(error));
  }

  // 주소록 호출 함수
  const getAddressBook = () =>{
    daumOpen({onComplete: (data)=>{
      setNewShopMember({
      ...newShopMember,
      'memAddr': data.address
      })
    }})
  }

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
  
  return (
    <Modal
      isOpen={isOpenJoin}
      title='Join'
      size='500px'
      onClose={()=>{
        onClose();
        setIsDisabledBtn(true);

        // 에러 메세지 초기화
        setErrorMsg({
          'memId': '',
          'memPw': '',
          'confirmPw': '',
          'pwKey':'',
          'pwAnswer':''
        })

        // 값 초기화
        setNewShopMember({
          'memId': '',
          'memPw': '', 
          'confirmPw':'',
          'memName': '',
          'memTelArr':['', '', ''],
          'firstEmail':'',
          'secondEmail':'',
          'memEmail':'',
          'memAddr':'',
          'addrDetail':'',
          'pwKey': '',
          'pwAnswer':''
        })        
      }}
    >

    <div className={styles.container}>
      <div>
        <h5>아이디</h5>
        <div>
          <Input 
            onChange={e=>{
              shopMemberReg(e);
              setIsDisabledBtn(true);              
              setErrorMsg({
                ...errorMsg,
                'memId': handleErrorMsg(e)
              });
            }}   
            value={newShopMember.memId}
            name='memId'
            size='100%' />
          <Button onClick={e=>checkId(e)} title='중복확인'/>
        </div>
        <p className={styles.errorMsg}>{errorMsg.memId}</p>
      </div>

      <div>
        <h5>비밀번호</h5>
        <div>
          <Input 
            onChange={e=>{
              shopMemberReg(e);
              setIsDisabledBtn(true);              
              setErrorMsg({
                ...errorMsg,
                'memPw': handleErrorMsg(e)
              });
            }}   
            value={newShopMember.memPw}
            placeholder='6~12자의 영문과 숫자로 구성됩니다'
            name='memPw'
            type='password'
            size='100%' />
        </div>
        <p className={styles.errorMsg}>{errorMsg.memPw}</p>
      </div>

      <div>
        <h5>비밀번호 확인</h5>
        <div>
          <Input onChange={e=>{
            shopMemberReg(e);
            setErrorMsg({
              ...errorMsg,
              'confirmPw': handleErrorMsg(e, newShopMember)
            });
          }}         
            value={newShopMember.confirmPw}
            name='confirmPw'
            type='password'
            size='100%' />
        </div>
        <p className={styles.errorMsg}>{errorMsg.confirmPw}</p>
      </div>

      <div>
        <h5>회원명</h5>
        <Input onChange={e=>shopMemberReg(e)}
          value={newShopMember.memName}
          name='memName'
          size='100%'/>
      </div>

      <div>
        <h5>연락처</h5>
        <div>
          <Input name='memTelArr' 
            value={newShopMember.memTelArr[0]}
            onChange={e=>{setNewShopMember({
            ...newShopMember,
            'memTelArr': [e.target.value, newShopMember.memTelArr[1], newShopMember.memTelArr[2]]
            })}}
            size='100%'/>

          <span>-</span>

          <Input name='memTelArr'
            value={newShopMember.memTelArr[1]} 
            onChange={e=>{setNewShopMember({
            ...newShopMember,
            'memTelArr': [newShopMember.memTelArr[0], e.target.value, newShopMember.memTelArr[2]]
            })}}
            size='100%'/>

          <span>-</span>

          <Input name='memTelArr'
            value={newShopMember.memTelArr[2]} 
            onChange={e=>{setNewShopMember({
            ...newShopMember,
            'memTelArr': [newShopMember.memTelArr[0], newShopMember.memTelArr[1], e.target.value]
            })}}
            size='100%'/>
        </div>
      </div>

      <div>
        <h5>이메일</h5>
          <div>
            <Input onChange={e=>shopMemberReg(e)}
            value={newShopMember.firstEmail}
            name='firstEmail'
            size='100%'/>
            
            <span>@</span>

            <Select onChange={e=>shopMemberReg(e)}
            value={newShopMember.secondEmail}
            name='secondEmail'
            size='100%'>
            {/* 이메일 추가 가능 */}
              <option value=''>선택</option>
              <option value='@gmail.com'>gmail.com</option>
              <option value='@naver.com'>naver.com</option>
              <option value='@hanmail.net'>hanmail.net</option>
            </Select>              
          </div>
      </div>

      <div className={styles.adressDiv}>
        <h5>주소</h5>        
          <div>
            <Input 
              onClick={()=>getAddressBook()} 
              readOnly={true}
              onChange={e=>shopMemberReg(e)}
              value={newShopMember.memAddr}
              name='memAddr'
              size='100%' />              
            <Button onClick={()=>getAddressBook()} title='검색' />        
          </div>  

          <div>
            <Input 
              onChange={e=>shopMemberReg(e)}
              value={newShopMember.addrDetail} 
              name='addrDetail'  
              size='100%'/>    
          </div>         
      </div>

      <div>
        <h5>비밀번호 찾기 질문</h5>
          <div>
            <Select size='100%' name='pwKey' 
            onChange={e=>{
              shopMemberReg(e);
              setIsDisabledBtn(true);              
              setErrorMsg({
                ...errorMsg,
                'pwKey': handleErrorMsg(e)
              });
            }} >
              <option key='-5' value="">선택</option>
                {pwQ.map((e, i)=>{
                  return(
                  <option key={i} value={e.pwKey}>{e.pwQuestion}</option>
                  )
                })} 
            </Select>
          </div>
          <p className={styles.errorMsg}>{errorMsg.pwKey}</p>

          <div>
            <Input 
              onChange={e=>{
              shopMemberReg(e);
              setIsDisabledBtn(true);              
              setErrorMsg({
                ...errorMsg,
                'pwAnswer': handleErrorMsg(e)
              });
            }}
              value={newShopMember.pwAnswer} 
              name='pwAnswer' 
              size='100%'
            />            
          </div> 
          <div>
            <p className={styles.errorMsg}>{errorMsg.pwAnswer}</p>
          </div>

      </div>

      <div>
        <Button 
          disabled={isDisabledBtn}
          onClick={e=>regNewShopMember(e)}
          title='회원가입'
          size='100%'     
        />
      </div>

    </div>

    </Modal>
  )
}

export default Join