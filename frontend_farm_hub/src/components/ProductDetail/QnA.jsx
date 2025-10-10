import React, { useEffect, useState } from 'react'
import styles from './QnA.module.css'
import Button from '../../common/Button'
import Input from '../../common/Input'
import Modal from '../../common/Modal'
import Textarea from '../../common/Textarea'
import axios from 'axios'
import { data, useParams } from 'react-router'
import dayjs from 'dayjs'
import Pagination from '../../common/Pagination'

const QnA = () => {

  //글 등록 후 리렌더링 할 state 변수
  const [reload, setReload] = useState(0);

  const {itemNum} = useParams();

  //JSON 형태로 저장된 로그인 정보 가져오기
  const loginInfo = sessionStorage.getItem('loginInfo')
  let memId = null

  if(loginInfo){
    try{
      const loginData = JSON.parse(loginInfo)
      memId = loginData.memId
    } catch (error) {
      console.error('로그인 정보 파싱 에러:', error);
    }
  }

  //JSON 형태로 저장된 로그인 정보를 파싱하여 id만 가져오기 
  // const loginData = JSON.parse(loginInfo)
  // const memId = loginData.memId
  // console.log(memId)

  //조회한 데이터를 저장할 state 변수
  const [qnaList, setQnaList] = useState([]);

  console.log(qnaList)

  //문의 모달창 숨김/보이기 여부
  const [isOpenQnA, setIsOpenQnA] = useState(false)
 
  //QNA 내용을 저장할 state 변수
  const [qnaData, setQnaData] = useState({
    'content' : '',
    'itemNum' : itemNum,
    'memId' : memId
  })

  //값 입력 시 실행하는 함수
  const handleqnaData = (e) => {
    setQnaData({
      ...qnaData,
      [e.target.name] : e.target.value
    })
  }

  //문의 글 작성 버튼 활성화 여부
  const [isDisabledBtn, setIsDisabledBtn] = useState(true)

  //버튼 클릭 시 문의내용을 등록할 함수
  const regQnA = () => {
    axios.post('/api/qna', qnaData)
    .then(res => {
      alert('상품 문의가 등록되었습니다.')
      setQnaData({
        'content' : '',
        'itemNum' : itemNum,
        'memId' : memId
      })
      setReload(reload + 1)
      setIsOpenQnA(false)
    })
    .catch(e => console.log(e))
  }

  //마운트시 데이터를 조회
  useEffect(() => {
    axios.get(`/api/qna/${itemNum}`)
    .then(res => {
      setQnaList(res.data)
    })
    .catch(e => console.log(e))
  }, [reload])

  //문의 내용에 따른 버튼 활성화 여부
  useEffect(() => {
    if(qnaData.content.trim().length > 0){
      setIsDisabledBtn(false)
    } 
    else{
      setIsDisabledBtn(true)
    }
  }, [qnaData.content]);

  // 활성 페이지 세팅
  const [currentPage, setCurrentPage] = useState(0);

  // 보여줄 페이지
  const itemsPerPage = 4;

  // 현재 페이지 보여줄 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQnaList = qnaList.slice(startIndex, endIndex);

  // 페이지를 변경시켜줄 함수
  const handlePageChange = selectedPage => {
    setCurrentPage(selectedPage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>상품 문의</p>
        <div>
          {loginInfo ? (
            <Button 
              title='문의하기'
              onClick={() => setIsOpenQnA(true)}
            />
          ) : (
            <p>상품문의는 로그인 후 이용가능합니다.</p>
          )}
        </div>
      </div>
     
      
      <div className={styles.qna_div}>
        {
          currentQnaList.map((qna, i) => {
            return(
              <div key={i} className={styles.qna_item}>
                {/* 문의 번호/상품 이름 */}
                <div className={styles.item_info}>
                  <span>{qna.qnaDTO.qnaNum} / {qna.qnaDTO.memId}</span>
                  <span>{dayjs(qna.qnaDTO.qnaDate).format('YYYY/MM/DD HH:mm:ss')}</span>
                </div>
                
                {/* 문의 내용 */}
                <div className={styles.question_section}>
                  <div className={styles.question}>
                    <span className={styles.q_label}>Q.</span>
                    <span className={styles.q_content}>{qna.qnaDTO.content}</span>
                  </div>
                </div>
                
                 {/* 답변 섹션 */}
                <div className={styles.answer_section}>
                  {qna.replyContent ? (
                    <>
                      <div className={styles.answer_info}>
                        <span>{qna.replyMemId}</span>
                        <span>{dayjs(qna.replyDate).format('YYYY/MM/DD HH:mm:ss')}</span>
                      </div>
                      <div className={styles.answer}>
                        <span className={styles.a_label}>A.</span>
                        <span className={styles.a_content}>{qna.replyContent}</span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.answer_pending}>
                      <span className={styles.a_label}>A.</span>
                      <span className={styles.pending_text}>답변 준비중...</span>
                    </div>
                  )}
                </div>
              </div>
            ) 
          })
        }
      </div>

      {/* 상품문의 등록 모달 */}
      <Modal
        isOpen={isOpenQnA}
        onClose={() => setIsOpenQnA(false)}
      >
        <div className={styles.reg_QnA}>
          <Textarea 
            width='100%'
            placeholder='문의사항을 작성해주세요.'
            name='content'
            value={qnaData.content}
            onChange={(e) => {handleqnaData(e)}}
          />
          <Button 
            disabled={isDisabledBtn}
            size='100%'
            title='등 록 하 기'
            onClick={e => {regQnA()}}
          />
        </div>
      </Modal>
      
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

export default QnA