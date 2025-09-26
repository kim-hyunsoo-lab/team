import React, { useEffect, useState } from 'react'
import Modal from '../../common/Modal'
import styles from './RegReview.module.css'
import Input from '../../common/Input'
import Textarea from '../../common/Textarea'
import Button from '../../common/Button'
import axios from 'axios'
import { useOutletContext } from 'react-router'

const RegReview = ({reload, itemNum, isOpenRegReview, onClose}) => { 
  
  //입력한 리뷰 내용을 저장할 state변수
  const [reviewData, setReviewData] = useState({
    'title' : '',
    'rating' : '',
    'content' : '',
  });
  
  const [errorMsg, setErrorMsg] = useState({
    'title' : '',
    'rating' : '',
    'content' : ''
  });

  const settingReview = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value
    })}
  
  // 리뷰 이미지들을 저장할 state 변수
  const [reviewImgs, setReviewImgs] = useState(null);
  
  //등록버튼 
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);

  const handleErrorMsg = (e) => {
    let errorStr = '';
    switch(e.target.name){
      case 'title':
        if(!e.target.value)
          errorStr = '리뷰 제목은 비워들 수 없습니다'
        else errorStr='';
        break;
      case 'rating':
        if(!e.target.value)
          errorStr = '별점은 비워둘 수 없습니다'
        else errorStr='';
        break;
      case'content':
        if(!e.target.value)
          errorStr = '리뷰 내용은 비워둘 수 없습니다'
        else errorStr='';
        break;}
    return errorStr;
  }

  const regNewReview = (e) =>{
    const fileConfig = {'Content-Type': 'multipart/form-data'};
    const formData = new FormData();
    
    for(const ee of reviewImgs){
    formData.append('reviewImgs', ee);}
    formData.append('title', reviewData.title);
    formData.append('rating', reviewData.rating);
    formData.append('content', reviewData.content);
    formData.append('memId', JSON.parse(sessionStorage.getItem('loginInfo')).memId);
    formData.append('itemNum', itemNum);

    if (!reviewData.title)
      {alert('리뷰 제목은 비워들 수 없습니다')}
    else if (!reviewData.rating)
      {alert('별점은 비워둘 수 없습니다')}
    else if (!reviewData.content)
      {alert('리뷰 내용은 비워둘 수 없습니다')}
    else(
      axios.post('/api/reviews', formData, fileConfig)
      .then(res=>{
      alert('리뷰를 등록했습니다')
      setReviewData({
        'title' : '',
        'rating' : '',
        'content' : '',
        'memId': ''
      })
      setErrorMsg({
        'title' : '',
        'rating' : '',
        'content' : ''
      })  
       onClose();})
      .catch(e=>console.log(e))
    )
  }

  const regNewReviewNoImg = (e) => {
    if (!reviewData.title)
      {alert('리뷰 제목은 비워들 수 없습니다')}
    else if (!reviewData.rating)
      {alert('별점은 비워둘 수 없습니다')}
    else if (!reviewData.content)
      {alert('리뷰 내용은 비워둘 수 없습니다')}
    else(
      axios.post('/api/reviews/noimg', {
        ...reviewData, 
        'memId': JSON.parse(sessionStorage.getItem('loginInfo')).memId,
        'itemNum': itemNum})
      .then(res=>{
      alert('리뷰를 등록했습니다')
      setReviewData({
        'title' : '',
        'rating' : '',
        'content' : '',
        'memId': ''
      })
      setErrorMsg({
        'title' : '',
        'rating' : '',
        'content' : ''
      })            
      onClose();})
      .catch(e=>console.log(e))
    )
  }

  return (
    <Modal
      isOpen={isOpenRegReview}
      onClose={() =>{        
        setReviewData({
        'title' : '',
        'rating' : '',
        'content' : '',
        'memId': ''
        })

        setErrorMsg({
        'title' : '',
        'rating' : '',
        'content' : ''
        })

        setIsDisabledBtn(true)

        onClose();
      }}
    >
      <div className={styles.container}>
        <h4>이용 후기 작성</h4>
        <table className={styles.reg_review_table}>
          <tbody>
            <tr>
              <td>제목</td>
              <td>
                <Input size='100%' 
                name='title'
                value={reviewData.title}
                onChange={e=>{settingReview(e)
                  setIsDisabledBtn(false)
                  setErrorMsg({
                  ...errorMsg,
                  'title': handleErrorMsg(e)                  
                  });
                }}/>
                <p className={styles.errorMsg}>{errorMsg.title}</p>
              </td>
            </tr>            
            <tr>
              <td>별점</td>                            
              <td>  
              <div className={styles.starRatingtd}>              
                <input className={styles.starRating} type='radio' name='rating' value='1' onChange={e=>{settingReview(e)
                  setErrorMsg({
                  ...errorMsg,
                  'rating': handleErrorMsg(e)
                  });
                }} />      
                <input className={styles.starRating} type='radio' name='rating' value='2' onChange={e=>{settingReview(e)
                  setErrorMsg({
                  ...errorMsg,
                  'rating': handleErrorMsg(e)
                  });
                }} />  
                <input className={styles.starRating} type='radio' name='rating' value='3' onChange={e=>{settingReview(e)
                  setErrorMsg({
                  ...errorMsg,
                  'rating': handleErrorMsg(e)
                  });
                }} />  
                <input className={styles.starRating} type='radio' name='rating' value='4' onChange={e=>{settingReview(e)
                  setErrorMsg({
                  ...errorMsg,
                  'rating': handleErrorMsg(e)
                  });
                }} />  
                <input className={styles.starRating} type='radio' name='rating' value='5' onChange={e=>{settingReview(e)
                  setErrorMsg({
                  ...errorMsg,
                  'rating': handleErrorMsg(e)
                  });
                }} />                  
                </div> 
                      
                <p className={styles.errorMsg}>{errorMsg.rating}</p>
              </td>
            </tr>
            <tr>
              <td>내용</td>
              <td>                
                <Textarea width='100%' 
                name='content'
                value={reviewData.content}
                onChange={e=>{settingReview(e)
                  setErrorMsg({
                  ...errorMsg,
                  'content': handleErrorMsg(e)
                  });
                }}/>
                <p className={styles.errorMsg}>{errorMsg.content}</p>
              </td>
            </tr>

            <tr>
              <td>이미지 추가(여러장 가능)</td>
              <td>
                <input type='file' multiple={true}
                onChange={e=>{        
                const fileArr = []
                for (let i = 0 ; i < e.target.files.length; i++){
                  fileArr.push(e.target.files[i])}    
                setReviewImgs(fileArr);           
                }}
                ></input>
                <p className={styles.errorMsg}>이미지는 선택 사항입니다</p>
              </td>
            </tr>

          </tbody>
        </table>
        <div className={styles.btn_div}>
          <Button title='리뷰 등록' 
            disabled={isDisabledBtn}
            onClick={e=>(
              (reviewImgs) ? regNewReview(e) : regNewReviewNoImg(e))}
            />
          <Button
            title='취소'
            onClick={() =>{
              onClose();
              setReviewData({
              'title' : '',
              'rating' : '',
              'content' : '',
              'memId': ''})
              setErrorMsg({
              'title' : '',
              'rating' : '',
              'content' : ''})
              setIsDisabledBtn(true)}}
          />
        </div>
      </div>
    </Modal>
  )
}

export default RegReview