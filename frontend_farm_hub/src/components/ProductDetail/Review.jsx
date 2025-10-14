import React, { useEffect, useState } from 'react'
import Button from '../../common/Button'
import RegReview from './RegReview'
import styles from './Review.module.css'
import { useParams } from 'react-router'
import axios from 'axios'
import dayjs from 'dayjs'
import Pagination from '../../common/Pagination'

const Review = () => {
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

  // 리로드용 (타임스탬프로 변경)
  const [reload, setReload] = useState(Date.now());

  // 모달 닫기 + 리로드
  const handleModalClose = () => {
    setIsOpenRegReview(false);
    setReload(Date.now()); // 타임스탬프로 리로드
  };

  // 별점 컴포넌트
  function StarRating({ rating }) {
    return (
      <div className="stars" style={{ color: '#ffc107', fontSize: '1.2rem' }}>
        {Array.from({ length: 5 }, (_, index) => (
          <i 
            key={index} 
            className={index < rating ? 'bi bi-star-fill' : 'bi bi-star'}
            style={{ marginRight: '2px' }}
          />
        ))}
      </div>
    );
  }
  
  // 후기 모달창 여는지 여부
  const [isOpenRegReview, setIsOpenRegReview] = useState(false);

  // 리뷰 목록
  const [reviewList, setReviewList] = useState([])

  // 리뷰 목록 조회
  useEffect(() => {
    const controller = new AbortController();
    
    axios.get(`/api/reviews/getList/${itemNum}`, {
      signal: controller.signal
    })
    .then(res => {
      setReviewList(res.data);
    })    
    .catch(e => {
      if (e.name !== 'CanceledError') {
        console.log(e);
      }
    });
    
    return () => {
      controller.abort();
    };
  }, [reload, itemNum])  
  
  // 리뷰 내용을 보이게 하는 여부
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [closingRowId, setClosingRowId] = useState(null);
  
  // 리뷰 행 클릭 핸들러 (옵션 3: 중간에 열기)
  const handleRowClick = (reviewNum) => {
    if (expandedRowId === reviewNum) {
      // 같은 행 클릭 시 닫기
      setClosingRowId(reviewNum);
      setTimeout(() => {
        setExpandedRowId(null);
        setClosingRowId(null);
      }, 300);
    } else {
      if (expandedRowId !== null) {
        // 다른 행이 열려있으면 먼저 닫기
        setClosingRowId(expandedRowId);
        // 절반 지점에서 새 행 열기
        setTimeout(() => {
          setExpandedRowId(reviewNum);
          setClosingRowId(null);
        }, 150);
      } else {
        // 열린 행이 없으면 바로 열기
        setExpandedRowId(reviewNum);
      }
    }
  };

  // 페이지네이션 - 활성 페이지
  const [currentPage, setCurrentPage] = useState(0);

  // 페이지네이션 - 페이지당 보여줄 개수
  const itemsPerPage = 5;

  // 현재 페이지 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviewList = reviewList.slice(startIndex, endIndex);

  // 페이지 변경 함수
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <div>
        <p>이용후기 총 {reviewList.length}건</p>
        <p>
          {loginInfo ? (
            <Button 
              title='후기 작성' 
              onClick={() => setIsOpenRegReview(true)}
            />
          ) : (
            <p>리뷰를 쓰려면 먼저 로그인을 해야 합니다</p>
          )}
        </p>
      </div>

      {/* 리뷰 테이블 */}
      <div>
        <table className={styles.review_table}>
          <thead>
            <tr>
              <td>No</td>
              <td>제목</td>
              <td>평점</td>
              <td>작성자</td>
              <td>작성일</td>
            </tr>
          </thead>
          <tbody>
            {!reviewList.length ? (
              <tr>
                <td colSpan={5}>등록된 리뷰가 없습니다</td>
              </tr>
            ) : (
              currentReviewList.map((e, i) => (              
                <React.Fragment key={e.reviewNum}>
                  {/* 리뷰 요약 행 */}
                  <tr onClick={() => handleRowClick(e.reviewNum)}>
                    <td>{reviewList.length - (startIndex + i)}</td>
                    <td>{e.title}</td>
                    <td>                    
                      <span><StarRating rating={e.rating} /></span>                  
                    </td>
                    <td>{e.memId}</td>
                    <td>{dayjs(e.createDate).format('YYYY년 MM월 DD일')}</td>
                  </tr>

                  {/* 리뷰 상세 행 (열렸을 때만) */}
                  {(expandedRowId === e.reviewNum || closingRowId === e.reviewNum) && (
                    <tr 
                      style={{textAlign: 'left'}} 
                      className={`${styles.detail_row} ${
                        closingRowId === e.reviewNum ? styles.closing : ''
                      }`}
                    >
                      <td colSpan={5}>
                        <div className={styles.img}>
                          {/* 리뷰 이미지 */}
                            {e.reviewImgList && e.reviewImgList.length > 0 ? (
                              e.reviewImgList.map((img, idx) => (
                                <img 
                                  src={`http://localhost:8080/reviewupload/${img.reviewAttachedImgName}?t=${reload}`}
                                  key={idx}
                                  alt={`리뷰 이미지 ${idx + 1}`}
                                  onError={(e) => {
                                    console.log('이미지 로드 실패:', img.reviewAttachedImgName);
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ))
                            ) : null}
                          {/* 리뷰 내용 */}
                          <div>{e.content}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>              
              ))
            )}                     
          </tbody>
        </table>
      </div>

      {/* 리뷰 작성 모달 */}
      <RegReview   
        itemNum={itemNum}    
        isOpenRegReview={isOpenRegReview}
        onClose={handleModalClose}
      />

      {/* 페이지네이션 */}
      <Pagination 
        totalItems={reviewList.length}
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

export default Review