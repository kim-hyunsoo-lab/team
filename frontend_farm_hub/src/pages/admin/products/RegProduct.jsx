import React, { useEffect, useState } from 'react'
import styles from './RegProduct.module.css'
import axios from 'axios'
import Input from '../../../common/Input'
import Button from '../../../common/Button'
import Select from '../../../common/Select'
import PageTitle from '../../../common/PageTitle'
import Textarea from '../../../common/Textarea'

const RegProduct = () => {
  const [newProduct, setNewProduct] = useState({
    'itemName':'',
    'price':'',
    'itemIntro':'',
    'part':'',
    'origin':''    
  })

  console.log(newProduct)

  const [errorMsg, setErrorMsg] = useState({
    'itemName':'',
    'price':''
  })

  // 메인 이미지를 저장할 state 변수 
  const [mainImg, setMainImg] = useState(null);

  // 서브 이미지들을 저장할 state 변수 
  const [subImgs, setSubImgs] = useState(null);


  const regNewProduct = (e) =>{
  // 만약 가격 데이터가 들어왔다면 천단위 구분기호를 제외한다  
  setNewProduct({
    ...newProduct,
    [e.target.name]: (e.target.name == 'price') ? (e.target.value.replaceAll(',','')) : (e.target.value)
    })
  }  

  // 마운트 되거나, newProduct이 변경되어 리렌더링되면 버튼 활성화 여부 변경
  useEffect(()=>{
    // 버튼 활성화 여부를 판단하여 disable 변경 
    if (newProduct.itemName !== '' && newProduct.price !== ''){
      setIsDisabledBtn(false);}
    else{setIsDisabledBtn(true);}
  }, [newProduct])


  //등록버튼 
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);

  
// 상품 등록 함수
const regNewItemOn = (e)=>{
  // 전달되는 데이터에 파일 데이터도 포함되어 있습니다, 라는 정의  
  const fileConfig = {'Content-Type': 'multipart/form-data'};

  // 파일 데이터가 포함된 내용을 자바로 전달할 땐 formData 객체를 사용해야함
  // formData 객체 생성
  // 이미지만이 아니라 java로 가져가는 모든 데이터를 다 넣어야한다 
  const formData = new FormData();

  // 1. 선택한 메인 이미지를 formData에 추가
  formData.append('mainImg', mainImg);
  // 2. 선택한 모든 서브 이미지들을 formData에 추가
  for(const ee of subImgs){  //subImgs = [File1, File2, File3...]
    formData.append('subImgs', ee);}

  // 3. imput 태그에 입력한 내용도 formData에 저장하기
  formData.append('itemName', newProduct.itemName);
  formData.append('price', newProduct.price);
  formData.append('itemIntro', newProduct.itemIntro);
  formData.append('part', newProduct.part);
  formData.append('origin', newProduct.origin);  
 
  axios.post('/api/items', formData, fileConfig)
  .then(res=>{
    alert('상품을 등록했습니다')
    setNewProduct({
    'itemName':'',
    'price':'',
    'itemIntro':'',
    'part':'',
    'origin':''})
  })
  .catch(e=>console.log(e))
  }

  
  return (    
    <div className={styles.container}>
      <PageTitle title='상품 등록' />

      <div>
        <div>
        <p>상품명</p>
        <Input 
        size='100%' 
        name='itemName' 
        onChange={e=>{regNewProduct(e)
          setErrorMsg({
            ...errorMsg,
            'title': e.target.value === '' ? '상품명은 필수 입력입니다' : ''})
          }}
        value={newProduct.itemName}
          />        
        <p>{errorMsg.itemName}</p>
        </div>

        <div>
          <p>가격</p>
          <Input 
          size='100%' 
          name='price' 
          onChange={e=>{regNewProduct(e)         
          setErrorMsg(
          {...errorMsg,             
          'price': e.target.value === '' ? '가격은 필수 입력입니다' : ''})}}   
          value={newProduct.price === '' ? newProduct.price : parseInt(newProduct.price).toLocaleString()} />
          <p>{errorMsg.price}</p>
        </div>  

        <div>
          <p>상품 설명</p>
            <Textarea 
            width='100%'
            name='itemIntro' 
            onChange={e=>regNewProduct(e)}
            value={newProduct.itemIntro}          
            />             
        </div>

        <div>
          <p>부위</p>
            <Select
              size='100%'
              name='part'
              onChange={e=>regNewProduct(e)}
              value={newProduct.part}>
              <option value="">부위 선택</option>
              <option value="등심">등심</option>
              <option value="갈비">갈비</option>
              <option value="안심">안심</option>
              <option value="채끝">채끝</option>
              <option value="목심">목심</option>
              <option value="앞다리">앞다리</option>
              <option value="사태">사태</option>
              <option value="양지">양지</option>
              <option value="우둔">우둔</option>
              <option value="설도">설도</option>
              <option value="사태">사태</option>
              <option value="기타부위">기타부위</option>              
            </Select>          
        </div>

        <div>
          <p>원산지</p>
            <Input
            size='100%'
            name='origin' 
            onChange={e=>regNewProduct(e)}
            value={newProduct.origin}          
            />             
        </div>

        
        <div>
          <p>상품 메인 이미지</p>
          <input type="file" 
          onChange={e=>{            
            // 선택한 하나의 파일을 변수에 저장
            setMainImg(e.target.files[0]);
          }}        
          />
        </div>

        <div>
          <p>서브 이미지 (다수 선택 가능)</p>          
          <input type="file" multiple={true} 
            onChange={e=>{        
              const fileArr = []
              for (let i = 0 ; i < e.target.files.length; i++){
                fileArr.push(e.target.files[i])
              }    
              setSubImgs(fileArr);           
            }}
          />
        </div>


        <div style={{'textAlign':'right'}}>
          <Button title='상품등록' 
            disabled={isDisabledBtn}
            onClick={e=>regNewItemOn(e)}/>
        </div>   

      </div>   
    </div>
  )
}

export default RegProduct