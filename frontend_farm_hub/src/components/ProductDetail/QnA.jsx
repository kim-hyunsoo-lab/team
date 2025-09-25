import React, { useEffect, useState } from 'react'
import styles from './QnA.module.css'
import Button from '../../common/Button'
import Input from '../../common/Input'
import Modal from '../../common/Modal'
import Textarea from '../../common/Textarea'

const QnA = () => {
  //문의 모달창 숨김/보이기 여부
  const [isOpenQnA, setIsOpenQnA] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>상품 문의</p>
        <div>
          <Button 
            title='문의하기'
            onClick={() => {setIsOpenQnA(true)}}
          />
        </div>
      </div>
      <div className={styles.search_div}>
        <Input 
          placeholder='궁금한 내용을 단어나 키워드로 검색하세요.'
          size='100%'
        />
      </div>
      
      {/* 질문과 답변 띄울 위치 */}

      {/* QnA 질문 등록 모달 */}
      <Modal
        isOpen={isOpenQnA}
        onClose={() => setIsOpenQnA(false)}
      >
        <div className={styles.reg_QnA}>
          <Textarea 
            width='100%'
            placeholder='문의사항을 작성해주세요.'
          />
          <Button 
            size='100%'
            title='등 록 하 기'
          />
        </div>
      </Modal>
    </div>
  )
}

export default QnA