import React, { useEffect, useState } from 'react'
import styles from './QnA.module.css'
import Button from '../../common/Button'
import Input from '../../common/Input'
import Modal from '../../common/Modal'
import Textarea from '../../common/Textarea'
import axios from 'axios'
import { data, useParams } from 'react-router'
import dayjs from 'dayjs'

const QnA = () => {
  const {itemNum} = useParams();
  // console.log(QnaData)
  
  //조회한 데이터를 저장할 state 변수
  const [QnaList, setQnaList] = useState([]);

  //JSON 형태로 저장된 로그인 정보 가져오기
  const loginInfo = sessionStorage.getItem('loginInfo')
  
  //문의 모달창 숨김/보이기 여부
  const [isOpenQnA, setIsOpenQnA] = useState(false)

  //QNA 내용을 저장할 state 변수
  const [QnaData, setQnaData] = useState({
    'content' : '',
    'itemNum' : itemNum
  })

  //값 입력 시 실행하는 함수
  const handleQnaData = (e) => {
    setQnaData({
      ...QnaData,
      [e.target.name] : e.target.value
    })
  }

  //버튼 클릭 시 문의내용을 등록할 함수
  const regQnA = () => {
    axios.post('/api/qna', QnaData)
    .then(res => {
      alert('상품 문의가 등록되었습니다.')
      setQnaData({
        'content' : ''
      })
      setIsOpenQnA(false)
    })
    .catch(e => console.log(e))
  }

  //마운트시 데이터를 조회
  useEffect(() => {
    axios.get(`/api/qna/${itemNum}`)
    .then(res => {
      console.log(res.data)
      setQnaList(res.data)
    })
    .catch(e => console.log(e))
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>상품 문의</p>
        <div>
          {
            loginInfo &&
            <Button 
              title='문의하기'
              onClick={() => {setIsOpenQnA(true)}}
            />
          }
        </div>
      </div>
      <div className={styles.search_div}>
        <Input 
          placeholder='궁금한 내용을 단어나 키워드로 검색하세요.'
          size='100%'
        />
      </div>
      
      <div className={styles.qna_div}>
        {
          QnaList.map((qna, i) => {
            return(
              <div key={i} className={styles.qna_item}>
                {/* 상품 번호/상품 이름 */}
                <div className={styles.item_info}>
                  <span>{qna.itemDTO.itemNum} / {qna.itemDTO.itemName}</span>
                </div>
                
                {/* 문의 내용 */}
                <div className={styles.question_section}>
                  <div className={styles.question}>
                    <span className={styles.q_label}>Q.</span>
                    <span className={styles.q_content}>{qna.content}</span>
                  </div>
                  
                  {/* 작성 시간 */}
                  <div className={styles.q_date}>
                    {dayjs(qna.qnaDate).format('YYYY-MM-DD')}
                  </div>
                </div>
                
                 {/* 답변 섹션 (나중에 데이터 추가되면) */}
                <div className={styles.answer_section}>
                  <div className={styles.answer}>
                    <div>
                      <span className={styles.a_label}>A.</span>
                      <span className={styles.a_content}>답변 준비 중...</span>
                    </div>
                    <Button 
                      title='재 문의'
                    />
                  </div>
                </div>
              </div>
            ) 
          })
        }
      </div>

      {/* QnA 질문 등록 모달 */}
      <Modal
        isOpen={isOpenQnA}
        onClose={() => setIsOpenQnA(false)}
      >
        <div className={styles.reg_QnA}>
          <Textarea 
            width='100%'
            placeholder='문의사항을 작성해주세요.'
            name='content'
            value={QnaData.content}
            onChange={(e) => {handleQnaData(e)}}
          />
          <Button 
            size='100%'
            title='등 록 하 기'
            onClick={e => {regQnA()}}
          />
        </div>
      </Modal>
    </div>
  )
}

export default QnA