import React, { useEffect, useState } from 'react'
import styles from './UserQna.module.css'
import axios from 'axios'
import Pagination from '../../../common/Pagination'
import dayjs from 'dayjs'
import PageTitle from '../../../common/PageTitle'

const UserQna = () => {  
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
  const [qnaList, setQnaList] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/reply/user/${memId}`)
    .then(res => {
      setQnaList(res.data);
      setLoading(false);
    })
    .catch(e => {
      console.log(e);
      setLoading(false);
    });
  }, []);
  
  // 활성 페이지 세팅
  const [currentPage, setCurrentPage] = useState(0);

  // 보여줄 페이지
  const itemsPerPage = 5;

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
      <PageTitle title="문의 목록" />
      
      {loading ? (
        <div className={styles.loading}>
          <p>로딩 중...</p>
        </div>
      ) : qnaList.length === 0 ? (
        <div className={styles.empty_message}>
          <i className="bi bi-inbox"></i>
          <p>등록된 문의가 없습니다.</p>
        </div>
      ) : (
        <>
        {/* 문의 목록 */}
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

        {/* 페이지네이션 */}
        <Pagination 
          totalItems={qnaList.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          nextLabel='>>'
          previousLabel='<<'
          color='gray'
        />
      </>
    )}
  </div>
)
}

export default UserQna