import React, { useEffect, useState } from 'react'
import styles from './Reply.module.css'
import Input from '../../common/Input'
import axios from 'axios';
import dayjs from 'dayjs';

const Reply = () => {
  //조회한 데이터를 받을 state 변수
  const [qnaList, setQnaList] = useState([]);

  console.log(qnaList)

  //마운트 시 데이터를 조회
  useEffect(() => {
    axios.get('/api/qna')
    .then(res => {
      setQnaList(res.data)
    })
    .catch(e => console.log(e))
  }, []); 

  return (
    <div>
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
        <div className={styles.qna_list}>
          {
            qnaList.map((qna, i) => {
              return(
                <div className={styles.qna_item}  key={i}>
                  <div className={styles.qna_header}>
                    <div>
                      <div className={styles.qna_title}>{qna.itemDTO.itemName}</div>
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
    </div>
    </div>
  )
}

export default Reply