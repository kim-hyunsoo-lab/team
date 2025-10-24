const handleErrorMsg = (name, value, newShopMember) => {
  let errorStr = '';

  // 4~8글자 영문과 숫자
  const memIdRegex = /^[A-Za-z0-9]{4,8}$/; 

  // 6~12글자 영문과 숫자
  const memPwRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;

  switch(name) {
    case 'memId':
      if(!value)
        errorStr = '아이디는 비워둘 수 없습니다';
      else if(value.length < 4 || value.length > 8)
        errorStr = '아이디는 4~8글자여야 합니다';            
      else if(!memIdRegex.test(value))
        errorStr = '아이디는 영문과 숫자로만 이루어져야합니다';                    
      else 
        errorStr = ''; 
      break;

    case 'memPw':
      if(!value)
        errorStr = '비밀번호는 비워둘 수 없습니다';
      else if(value.length < 6 || value.length > 12)
        errorStr = '비밀번호는 6~12글자여야 합니다';
      else if(!memPwRegex.test(value))
        errorStr = '비밀번호는 영문과 숫자의 조합이어야 합니다';
      else 
        errorStr = '';  
      break; 

    case 'confirmPw':
      if(value !== newShopMember.memPw) {
        errorStr = '비밀번호가 일치하지 않습니다';
      }
      break;
    
    case 'pwKey':
      if(!value)
        errorStr = '비밀번호 찾기 질문을 선택해주세요'
      else 
        errorStr = '';  
      break; 
    
    case 'pwAnswer':
      if(!value)
        errorStr = '비밀번호 찾기 답변을 입력해주세요'
      else 
        errorStr = '';  
      break; 
  }  
  return errorStr;
}

export default handleErrorMsg;