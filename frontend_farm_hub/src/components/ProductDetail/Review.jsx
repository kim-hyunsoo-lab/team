import React, { useState } from 'react'
import Button from '../../common/Button'
import RegReview from './RegReview'
import styles from './Review.module.css'

const Review = () => {
  //후기 모달창 여는지 여부
  const [isOpenRegReview, setIsOpenRegReview] = useState(false);

  //리뷰 내용을 보이게 하는 여부를 저장할 state 변수
  const [isShowContent, setIsShowContent] = useState(false);

  return (
    <div>
      <div>
        <p>이용후기 총n건</p>
        <p>
          <Button title='후기 작성' onClick={e => setIsOpenRegReview(true)} />
        </p>
      </div>
      <div>
        <table className={styles.review_table}>
          <thead>
            <tr>
              <td>No</td>
              <td>제목</td>
              <td><span><i className='bi bi-star-fill'></i></span>평점</td>
              <td>작성자</td>
              <td>작성일</td>
            </tr>
          </thead>
          <tbody>
            <tr onClick={e => setIsShowContent(!isShowContent)}>
              <td>글번호</td>
              <td>제목</td>
              <td><span><i className='bi bi-star-fill'></i></span>(1~5)</td>
              <td>작성자ID</td>
              <td>날짜</td>
            </tr>
            {
              isShowContent
              &&
              <tr style={{textAlign : 'left'}}>
                <td colSpan={5}>내용</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      {/* 리뷰작성 모달창 */}
      <RegReview
        isOpenRegReview={isOpenRegReview}
        onClose={() => setIsOpenRegReview(false)}
      />
    </div>
  )
}

export default Review