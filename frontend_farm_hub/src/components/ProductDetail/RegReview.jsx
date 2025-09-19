import React, { useState } from 'react'
import Modal from '../../common/Modal'
import styles from './RegReview.module.css'
import Input from '../../common/Input'
import Textarea from '../../common/Textarea'
import Button from '../../common/Button'
import axios from 'axios'

const RegReview = ({isOpenRegReview, onClose}) => {
  //입력한 리뷰 내용을 저장할 state변수
  const [reviewData, setReviewData] = useState({
    'title' : '',
    'rating' : '',
    'content' : ''
  });

  // 리뷰 이미지들을 저장할 state 변수
  const [reviewImgs, setReviewImgs] = useState(null);

  
  //등록버튼 
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);

  const regNewReview = (e) =>{
    const fileConfig = {'Content-Type': 'multipart/form-data'};

    const formData = new FormData();

    for(const ee of reviewImgs){
    formData.append('reviewImgs', ee);}

    formData.append('title', reviewData.title);
    formData.append('rating', reviewData.rating);
    formData.append('content', reviewData.content);

    axios.post('/api/reviews', formData, fileConfig)
    .then(res=>{
      alert('리뷰를 등록했습니다')
      onClose();
    })
    .catch(e=>console.log(e))
  }


  return (
    <Modal
      isOpen={isOpenRegReview}
      onClose={onClose}
    >
      <div className={styles.container}>
        <h4>이용 후기 작성</h4>
        <table className={styles.reg_review_table}>
          <tbody>
            <tr>
              <td>제목</td>
              <td>
                <Input size='100%' />
              </td>
            </tr>
            <tr>
              <td>별점</td>
              <td>
                <Input size='100%' />
              </td>
            </tr>
            <tr>
              <td>내용</td>
              <td>
                <Textarea width='100%' />
              </td>
            </tr>

            <tr>
              <td>이미지 추가</td>
              <td>
                <input type='file' multiple={true}
                onChange={e=>{        
              const fileArr = []
              for (let i = 0 ; i < e.target.files.length; i++){
                fileArr.push(e.target.files[i])
              }    
              testsetReviewImgs(fileArr);           
            }}
                ></input>
              </td>
            </tr>


          </tbody>
        </table>
        <div className={styles.btn_div}>
          <Button title='리뷰 등록' 
            disabled={isDisabledBtn}
            onClick={e=>regNewReview(e)}
            />
          <Button
            title='취소'
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  )
}

export default RegReview