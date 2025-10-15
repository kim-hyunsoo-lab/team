import React, { useState } from 'react'
import Modal from '../../common/Modal'
import styles from './RegReview.module.css'
import Input from '../../common/Input'
import Textarea from '../../common/Textarea'
import Button from '../../common/Button'
import axios from 'axios'

const RegReview = ({itemNum, isOpenRegReview, onClose}) => { 
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

  //입력한 리뷰 내용을 저장할 state변수
  const [reviewData, setReviewData] = useState({
    'title': '',
    'rating': '',
    'content': '',
  });
  
  const [errorMsg, setErrorMsg] = useState({
    'title': '',
    'rating': '',
    'content': ''
  });

  const settingReview = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value
    })
  }
  
  // 리뷰 이미지들을 저장할 state 변수
  const [reviewImgs, setReviewImgs] = useState(null);
  
  //등록버튼 
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);

  // 등록 중 여부 (중복 클릭 방지)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleErrorMsg = (e) => {
    let errorStr = '';
    switch(e.target.name){
      case 'title':
        if(!e.target.value)
          errorStr = '리뷰 제목은 비워둘 수 없습니다'
        else errorStr = '';
        break;
      case 'rating':
        if(!e.target.value)
          errorStr = '별점은 비워둘 수 없습니다'
        else errorStr = '';
        break;
      case 'content':
        if(!e.target.value)
          errorStr = '리뷰 내용은 비워둘 수 없습니다'
        else errorStr = '';
        break;
    }
    return errorStr;
  }

  // 상태 초기화 함수
  const resetForm = () => {
    setReviewData({
      'title': '',
      'rating': '',
      'content': '',
    });
    setErrorMsg({
      'title': '',
      'rating': '',
      'content': ''
    });
    setReviewImgs(null);
    setIsDisabledBtn(true);
    setIsSubmitting(false);
  }
// 이미지 있는 리뷰 등록
const regNewReview = async () => {
  if (isSubmitting) {
    console.log('이미 등록 중입니다.');
    return;
  }

  if (!reviewData.title) {
    alert('리뷰 제목은 비워둘 수 없습니다');
    return;
  }
  if (!reviewData.rating) {
    alert('별점은 비워둘 수 없습니다');
    return;
  }
  if (!reviewData.content) {
    alert('리뷰 내용은 비워둘 수 없습니다');
    return;
  }

  const formData = new FormData();
  
  for(const ee of reviewImgs){
    formData.append('reviewImgs', ee);
  }
  formData.append('title', reviewData.title);
  formData.append('rating', reviewData.rating);
  formData.append('content', reviewData.content);
  formData.append('memId', memId);
  formData.append('itemNum', itemNum);

  setIsSubmitting(true);
  
  try {
    const response = await axios.post('/api/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
    });
    
    console.log('✅ 서버 응답:', response.data);
    
    if (response.data.success) {
      alert(response.data.message);
      
      // ⭐ 커스텀 이벤트 발생 - 상품 정보 갱신 ⭐
      window.dispatchEvent(new Event('reviewUpdated'));
      
      resetForm();
      onClose();
    } else {
      alert(response.data.message);
      setIsSubmitting(false);
    }
    
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    
    if (error.response) {
      alert(error.response.data.message || '리뷰 등록에 실패했습니다.');
    } else if (error.request) {
      alert('서버와 통신할 수 없습니다.');
    } else {
      alert('요청 처리 중 오류가 발생했습니다.');
    }
    
    setIsSubmitting(false);
  }
}

// 이미지 없는 리뷰 등록
const regNewReviewNoImg = async () => {
  if (isSubmitting) {
    console.log('이미 등록 중입니다.');
    return;
  }

  if (!reviewData.title) {
    alert('리뷰 제목은 비워둘 수 없습니다');
    return;
  }
  if (!reviewData.rating) {
    alert('별점은 비워둘 수 없습니다');
    return;
  }
  if (!reviewData.content) {
    alert('리뷰 내용은 비워둘 수 없습니다');
    return;
  }

  setIsSubmitting(true);
  
  try {
    const response = await axios.post('/api/reviews/noimg', {
      ...reviewData, 
      'memId': memId,
      'itemNum': itemNum
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ 서버 응답:', response.data);
    
    if (response.data.success) {
      alert(response.data.message);
      
      // ⭐ 커스텀 이벤트 발생 - 상품 정보 갱신 ⭐
      window.dispatchEvent(new Event('reviewUpdated'));
      
      resetForm();
      onClose();
    } else {
      alert(response.data.message);
      setIsSubmitting(false);
    }
    
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    
    if (error.response) {
      alert(error.response.data.message || '리뷰 등록에 실패했습니다.');
    } else if (error.request) {
      alert('서버와 통신할 수 없습니다.');
    } else {
      alert('요청 처리 중 오류가 발생했습니다.');
    }
    
    setIsSubmitting(false);
  }
}
  // 모달 닫을 때 상태 초기화
  const handleClose = () => {
    if (isSubmitting) {
      return; // 등록 중에는 닫기 무시
    }
    resetForm();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpenRegReview}
      onClose={handleClose}
    >
      <div className={styles.container}>
        <h4>이용 후기 작성</h4>
        <table className={styles.reg_review_table}>
          <tbody>
            <tr>
              <td>제목</td>
              <td>
                <Input 
                  size='100%' 
                  name='title'
                  value={reviewData.title}
                  disabled={isSubmitting}
                  onChange={e => {
                    settingReview(e);
                    setIsDisabledBtn(false);
                    setErrorMsg({
                      ...errorMsg,
                      'title': handleErrorMsg(e)                  
                    });
                  }}
                />
                <p className={styles.errorMsg}>{errorMsg.title}</p>
              </td>
            </tr>            
            <tr>
              <td>별점</td>                            
              <td>  
                <div className={styles.starRatingtd}>              
                  <input 
                    className={styles.starRating} 
                    type='radio' 
                    name='rating' 
                    value='1'
                    disabled={isSubmitting}
                    checked={reviewData.rating === '1'}
                    onChange={e => {
                      settingReview(e);
                      setErrorMsg({
                        ...errorMsg,
                        'rating': handleErrorMsg(e)
                      });
                    }} 
                  />      
                  <input 
                    className={styles.starRating} 
                    type='radio' 
                    name='rating' 
                    value='2'
                    disabled={isSubmitting}
                    checked={reviewData.rating === '2'}
                    onChange={e => {
                      settingReview(e);
                      setErrorMsg({
                        ...errorMsg,
                        'rating': handleErrorMsg(e)
                      });
                    }} 
                  />  
                  <input 
                    className={styles.starRating} 
                    type='radio' 
                    name='rating' 
                    value='3'
                    disabled={isSubmitting}
                    checked={reviewData.rating === '3'}
                    onChange={e => {
                      settingReview(e);
                      setErrorMsg({
                        ...errorMsg,
                        'rating': handleErrorMsg(e)
                      });
                    }} 
                  />  
                  <input 
                    className={styles.starRating} 
                    type='radio' 
                    name='rating' 
                    value='4'
                    disabled={isSubmitting}
                    checked={reviewData.rating === '4'}
                    onChange={e => {
                      settingReview(e);
                      setErrorMsg({
                        ...errorMsg,
                        'rating': handleErrorMsg(e)
                      });
                    }} 
                  />  
                  <input 
                    className={styles.starRating} 
                    type='radio' 
                    name='rating' 
                    value='5'
                    disabled={isSubmitting}
                    checked={reviewData.rating === '5'}
                    onChange={e => {
                      settingReview(e);
                      setErrorMsg({
                        ...errorMsg,
                        'rating': handleErrorMsg(e)
                      });
                    }} 
                  />                  
                </div>       
                <p className={styles.errorMsg}>{errorMsg.rating}</p>
              </td>
            </tr>
            <tr>
              <td>내용</td>
              <td>                
                <Textarea 
                  width='100%' 
                  name='content'
                  value={reviewData.content}
                  disabled={isSubmitting}
                  onChange={e => {
                    settingReview(e);
                    setErrorMsg({
                      ...errorMsg,
                      'content': handleErrorMsg(e)
                    });
                  }}
                />
                <p className={styles.errorMsg}>{errorMsg.content}</p>
              </td>
            </tr>

            <tr>
              <td>이미지 추가(여러장 가능)</td>
              <td>
                <input 
                  type='file' 
                  multiple={true}
                  disabled={isSubmitting}
                  onChange={e => {        
                    const fileArr = []
                    for (let i = 0 ; i < e.target.files.length; i++){
                      fileArr.push(e.target.files[i]);
                    }    
                    setReviewImgs(fileArr);           
                  }}
                />
                <p className={styles.errorMsg}>이미지는 선택 사항입니다</p>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className={styles.btn_div}>
          <Button 
            title={isSubmitting ? '등록 중...' : '리뷰 등록'} 
            disabled={isDisabledBtn || isSubmitting}
            onClick={() => {
              if (!isSubmitting) {
                reviewImgs ? regNewReview() : regNewReviewNoImg();
              }
            }}
          />
          <Button
            title='취소'
            onClick={handleClose}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  )
}

export default RegReview