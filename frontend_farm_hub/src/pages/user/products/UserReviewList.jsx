import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Pagination from '../../../common/Pagination'
import styles from './UserReviewList.module.css'
import dayjs from 'dayjs'
import PageTitle from '../../../common/PageTitle'

const UserReviewList = () => {    

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
  const [reviewList, setReviewList] = useState([])

  useEffect(()=>{
    axios.get(`/api/reviews/getListforuser/${memId}`)
    .then(res=>{
      console.log(res.data);
      setReviewList(res.data);
    })    
    .catch(e=>console.log(e));
  }, [])  
  
  // 별점용
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
  
  //리뷰 내용을 보이게 하는 여부를 저장할 state 변수
  const [expandedRowId, setExpandedRowId] = useState(null);
  
  const handleRowClick = (reviewNum) => {
  setExpandedRowId(prevId => (prevId === reviewNum ? null : reviewNum));
  };

  
  // 활성 페이지 세팅
  const [currentPage, setCurrentPage] = useState(0);

  // 보여줄 페이지
  const itemsPerPage = 5;

  // 현재 페이지 보여줄 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviewList = reviewList.slice(startIndex, endIndex);

  // 페이지를 변경시켜줄 함수
  const handlePageChange = selectedPage => {
    setCurrentPage(selectedPage);
  };

  return (
    <div className={styles.container}>
      <PageTitle title="리뷰 목록" />
    <div>
        <table className={styles.review_table}>
          <colgroup>
            <col width="10%" />
            <col width="*%" />
            <col width="14%" />
            <col width="27%" />        
            <col width="20%" />        
          </colgroup>
          <thead>
            <tr>
              <td>No</td>
              <td>제목</td>
              <td>평점</td>
              <td>리뷰 상품명</td>
              <td>작성일</td>
            </tr>
          </thead>
          <tbody>
            {
              !reviewList.length ? 
              <tr>
                <td colSpan={5}>
                  등록된 리뷰가 없습니다
                </td>
              </tr>
              :              
              currentReviewList.map((e, i)=>
                (              
              <React.Fragment key={e.reviewNum}>
                <tr key={i} onClick={() => handleRowClick(e.reviewNum)}>
                  <td>{reviewList.length-i}</td>
                  <td>{e.title}</td>
                  <td>                    
                    <span><StarRating rating={e.rating} /></span>                  
                  </td>
                  <td>{e.itemName}</td>
                  <td>{dayjs(e.createDate).format('YYYY년 MM월 DD일')}</td>
                </tr>

                {expandedRowId === e.reviewNum &&             
                (<tr style={{textAlign : 'left'}}>
                  <td colSpan={5}>
                    <div className={styles.img} >
                      {e.reviewImgList[0].reviewImgNum == 0 ? null :
                      e.reviewImgList.map((img, i) => {
                        return(
                        <img src={`http://localhost:8080/reviewupload/${img.reviewAttachedImgName}`} key={i} />
                        )
                      })                   
                      }                    
                      <div>
                        {e.content}                    
                      </div>
                    </div>
                    </td>
                </tr>
                )}
                </React.Fragment>              
              )) 
            }                     
          </tbody>
        </table>
      </div>
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

export default UserReviewList