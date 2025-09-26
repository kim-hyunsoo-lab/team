import React, { useEffect, useState } from 'react'
import Button from '../../common/Button'
import RegReview from './RegReview'
import styles from './Review.module.css'
import ProductDetail from '../../pages/user/products/ProductDetail'
import { useOutletContext, useParams } from 'react-router'
import axios from 'axios'
import dayjs from 'dayjs'

const Review = () => {
  const {itemNum} = useParams(); 

  const [reload, setReload] = useState(1);
  
  //후기 모달창 여는지 여부
  const [isOpenRegReview, setIsOpenRegReview] = useState(false);

  const [reviewList, setReviewList] = useState([])

  useEffect(()=>{
    axios.get(`/api/reviews/getList/${itemNum}`)
    .then(res=>{
      setReviewList(res.data);
    })    
    .catch(e=>console.log(e));
  }, [reload])  
  
  //리뷰 내용을 보이게 하는 여부를 저장할 state 변수
  const [expandedRowId, setExpandedRowId] = useState(null);
  
  const handleRowClick = (reviewNum) => {
  setExpandedRowId(prevId => (prevId === reviewNum ? null : reviewNum));
  };

  return (
    <div>
      <div>
        <p>이용후기 총 {reviewList.length}건</p>
        <p>
          <Button title='후기 작성' onClick={e => {sessionStorage.getItem('loginInfo') ? setIsOpenRegReview(true) : alert('리뷰를 쓰려면 먼저 로그인을 해야 합니다')} } />
        </p>
      </div>
      <div>
        <table className={styles.review_table}>
          <thead>
            <tr>
              <td>No</td>
              <td>제목</td>
              <td>
                <span><i className='bi bi-star-fill'></i></span> 평점
              </td>
              <td>작성자</td>
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
              reviewList.map((e, i)=>
                (              
              <React.Fragment key={e.reviewNum}>
                <tr key={i} onClick={() => handleRowClick(e.reviewNum)}>
                  <td>{reviewList.length-i}</td>
                  <td>{e.title}</td>
                  <td>                    
                    <span><i className='bi bi-star-fill' /> {e.rating}</span>                  
                  </td>
                  <td>{e.memId}</td>
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
      {/* 리뷰작성 모달창 */}
      <RegReview   
        itemNum={itemNum}    
        isOpenRegReview={isOpenRegReview}
        onClose={() => {setIsOpenRegReview(false)}}
      />
    </div>
  )
}

export default Review