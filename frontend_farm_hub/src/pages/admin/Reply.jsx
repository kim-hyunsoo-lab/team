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

  //글 등록 후 리렌더링 할 state 변수
  const [reload, setReload] = useState(0);
  
  //조회한 데이터를 받을 state 변수
  const [qnaList, setQnaList] = useState([]);
  
  //모달 내부에서 조회하는 내용을 받는 state 변수
  const [qnaDetail, setQnaDetail] = useState({
    'qnaNum' : '',
    'memId':'',
    'itemNum' : '',
    'qnaDate':'',
    'content':'',
    'replyMemId':'',
    'replyDate' : '',
    'replyContent' : ''
  })
  console.log(qnaDetail)

  //로그인 정보에서 id만 가져오기
  const loginInfo = sessionStorage.getItem('loginInfo')
  const loginData = JSON.parse(loginInfo)
  const memId = loginData.memId

  //답변 내용을 저장할 state 변수
  const [replyData, setReplyData] = useState({
    'replyContent' : '',
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
      replyContent: replyData.replyContent,
      qnaNum: qnaDetail.qnaNum,
      replyMemId: memId
    })
    .then(res => {
      alert('답변이 등록되었습니다.')
      setReplyData({
        'replyContent' : '',
      })
      setIsOpenReply(false)
      setReload(reload + 1)
    })
    .catch(e => console.log(e))
  }

  //마운트 시 데이터를 조회
  useEffect(() => {
    axios.get(`/api/qna`)
    .then(res => {
      setQnaList(res.data)
    })
    .catch(e => console.log(e))
  }, [reload]); 

  //모달 클릭 시 모달에 데이터 조회
  const getDetail = (qna) => {
    axios.get(`/api/reply/${qna.qnaNum}`)
    .then(res => {
      setQnaDetail(res.data)})
    .catch(e => console.log(e))
  }

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
                  getDetail(qna)
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
                    <span className={
                      qna.status === '답변완료'
                        ? styles.status_completed
                        : styles.status_pending
                    }>
                      {qna.status}
                    </span>
                </div>
            </div>
            )
          })
        }    
      </div>
      <Modal
        isOpen={isOpenReply}        
        onClose={() => {
            setIsOpenReply(false)
            setReplyData({replyContent : ''})
          }} 
      >
        <div className={styles.reply_div}>
          <div className={styles.question_explain}>
            <p>상품문의 내용</p>
            <div className={styles.content}>{qnaDetail.qnaDTO?.content}</div>
            <div className={styles.member_info}>
              <p>아이디 : {qnaDetail.qnaDTO?.memId}</p>
              <span>/</span>
              <p>상품번호 : {qnaDetail.qnaDTO?.itemNum}</p>
            </div>
          </div>
          <hr />
          <div className={styles.write_reply}>
            <p>답변 내용 작성</p>
            <Textarea
              width='100%'
              placeholder='답변을 작성해주세요.'
              name='replyContent'
              value={replyData.replyContent || qnaDetail.replyContent || ''}
              onChange={e => {handleReplyData(e)}}
              disabled={qnaDetail.status === "답변완료"}
            />
            <Button 
              title='답 변 하 기'
              size='100%'
              onClick={e => regReply()}
              disabled={
                qnaDetail.status === "답변완료" ||
                !replyData.replyContent.trim()
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Reply