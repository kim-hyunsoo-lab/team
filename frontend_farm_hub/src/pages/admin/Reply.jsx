import React, { useEffect, useState } from 'react'
import styles from './Reply.module.css'
import Input from '../../common/Input'
import axios from 'axios';
import dayjs from 'dayjs';
import Modal from '../../common/Modal';
import Textarea from '../../common/Textarea';
import Button from '../../common/Button';

const Reply = () => {
  //답변 모달창 숨김/보이기 여부
  const [isOpenReply, setIsOpenReply] = useState(false);
  
  //조회한 데이터를 받을 state 변수
  const [qnaList, setQnaList] = useState([]);
  console.log(qnaList)
  
  //모달 내부에서 조회하는 내용을 받는 state 변수
  const [qnaDetail, setQnaDetail] = useState({
    'qnaNum':'',
    'content':'',
    'itemNum':'',
    'memId':''
  })

  //로그인 정보에서 id만 가져오기
  const loginInfo = sessionStorage.getItem('loginInfo')
  const loginData = JSON.parse(loginInfo)
  const memId = loginData.memId
  console.log(memId);

  //답변 내용을 저장할 state 변수
  const [replyData, setReplyData] = useState({
    'content' : '',
  })

  //값 입력 시 실행하는 함수
  const handleReplyData = (e) => {
    setReplyData({
      ...replyData,
      [e.target.name] : e.target.value
    })
  }

  //버튼 클릭 시 답변을 등록할 함수
    const regReply = () => {
    axios.post('/api/reply', {
      content: replyData.content,
      qnaNum: qnaDetail.qnaNum,
      memId: memId
    })
    .then(res => {
      alert('답변이 등록되었습니다.')
      setReplyData({
        'content' : '',
      })
      setIsOpenReply(false)
    })
    .catch(e => console.log(e))
  }

  //마운트 시 데이터를 조회
  useEffect(() => {
    axios.get('/api/qna')
    .then(res => {
      setQnaList(res.data)
    })
    .catch(e => console.log(e))
  }, []); 

  //모달 클릭 시 모달에 데이터 조회
  const getDetail = (qnaNum) => {
    axios.get(`/api/qna/detail/${qnaNum}`)
    .then(res => setQnaDetail(res.data))
    .catch(e => console.log(e))
  }
  console.log(qnaDetail)

  return (
    <div className={styles.container}>
      {/* <!-- 헤더 --> */}
      <header>
        <p className={styles.title}>QnA 관리</p>
        <p className={styles.explain}>고객 문의를 확인하고 답변을 작성하세요</p>
      </header>

      {/* <!-- 통계 카드 --> */}
      <div className={styles.stats}>
          <div className={styles.stat_card}>
              <p>전체 문의</p>
              <p>127</p>
          </div>
          <div className={styles.stat_card}>
              <p>답변 대기</p>
              <p>23</p>
          </div>
          <div className={styles.stat_card}>
              <p>답변 완료</p>
              <p>104</p>
          </div>
          <div className={styles.stat_card}>
              <p>오늘 문의</p>
              <p>8</p>
          </div>
      </div>

      {/* <!-- 필터 --> */}
      <div className={styles.filters}>
          <select id="statusFilter">
            <option value="all">전체 상태</option>
            <option value="pending">답변 대기</option>
            <option value="answered">답변 완료</option>
          </select>
          <select id="sortFilter">
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
          <Input />
      </div>

      {/* <!-- QnA 목록 --> */}
      <div 
        className={styles.qna_list}
        
      >
        {
          qnaList.map((qna, i) => {
            return(
              <div onClick={() => {
                  getDetail(qna.qnaNum)
                  setIsOpenReply(true)
                }} className={styles.qna_item}  key={i}>
                <div className={styles.qna_header}>
                  <div>
                    <div className={styles.qna_title}>{qna.itemDTO.itemName} / {qna.qnaNum}</div>
                    <div className={styles.qna_meta}>
                        <span>👤{qna.memId}</span>
                        <span>📋{qna.itemNum}</span>
                        <span>🕐{dayjs(qna.qnaDate).format('YYYY/MM/DD HH:mm:ss')}</span>
                    </div>
                  </div>
                    <span>답변 대기</span>
                </div>
            </div>
            )
          })
        }
      </div>
      <Modal
        isOpen={isOpenReply}        
        onClose={() => setIsOpenReply(false)}
      >
        <div className={styles.reply_div}>
          <div className={styles.question_explain}>
            <p>상품문의 내용</p>
            <div className={styles.content}>{qnaDetail.content}</div>
            <div className={styles.member_info}>
              <p>아이디 : {qnaDetail.memId}</p>
              <span>/</span>
              <p>상품번호 : {qnaDetail.itemNum}</p>
            </div>
          </div>
          <hr />
          <div className={styles.write_reply}>
            <p>답변 내용 작성</p>
            <Textarea
              width='100%'
              placeholder='답변을 작성해주세요.'
              name='content'
              value={replyData.content}
              onChange={e => {handleReplyData(e)}}
            />
            <Button 
              title='답 변 하 기'
              size='100%'
              onClick={e => regReply()}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Reply