import React, { useEffect, useMemo, useState } from 'react'
import styles from './Reply.module.css'
import Input from '../../common/Input'
import axios from 'axios';
import dayjs from 'dayjs';
import Modal from '../../common/Modal';
import Textarea from '../../common/Textarea';
import Button from '../../common/Button';
import Pagination from '../../common/Pagination';

const Reply = () => {
  //답변 모달창 숨김/보이기 여부
  const [isOpenReply, setIsOpenReply] = useState(false);

  //글 등록 후 리렌더링 할 state 변수
  const [reload, setReload] = useState(0);
  
  //조회한 데이터를 받을 state 변수
  const [qnaList, setQnaList] = useState([]);

  //통계 카드 state 변수
  const [stats, setStats] = useState({});

  // 활성 페이지 세팅
  const [currentPage, setCurrentPage] = useState(0);

  // 보여줄 페이지
  const itemsPerPage = 7;

  // 현재 페이지 보여줄 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQnaList = qnaList.slice(startIndex, endIndex);

  // 페이지를 변경시켜줄 함수
  const handlePageChange = selectedPage => {
    setCurrentPage(selectedPage);
  };

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
      const today = dayjs().format('YYYY-MM-DD');
      setStats({
        total: res.data.length,
        pending: res.data.filter(qna => qna.status === '답변대기').length,
        completed: res.data.filter(qna => qna.status === '답변완료').length,
        today: res.data.filter(qna => 
          dayjs(qna.qnaDate).format('YYYY-MM-DD') === today
      ).length
      })
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
  console.log(qnaList)

  

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
              <p>{stats.total}</p>
          </div>
          <div className={styles.stat_card}>
              <p>답변 대기</p>
              <p>{stats.pending}</p>
          </div>
          <div className={styles.stat_card}>
              <p>답변 완료</p>
              <p>{stats.completed}</p>
          </div>
          <div className={styles.stat_card}>
              <p>오늘 문의</p>
              <p>{stats.today}</p>
          </div>
      </div>

      {/* <!-- QnA 목록 --> */}
      <div 
        className={styles.qna_list}
      >
        {
          currentQnaList.map((qna, i) => {
            return(
              <div onClick={() => {
                  getDetail(qna)
                  setIsOpenReply(true)
                }} className={styles.qna_item}  key={i}>
                <div className={styles.qna_header}>
                  <div>
                    <div className={styles.qna_title}>{qna.itemDTO.itemName}</div>
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
              <p>질문자 아이디 : {qnaDetail.qnaDTO?.memId}</p>
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
      {/* 컴포넌트 렌더링 */}
      <Pagination 
        totalItems={qnaList.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        nextLabel='>>'
        previousLabel='<<'
        color='gray'
      />
    </div>
  )
}

export default Reply