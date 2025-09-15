const handleErrorMsg = (e, newShopMember) => {

  let errorStr = '';

// ※ 아이디 조건 정해지면 정규식 제대로 쓸 것  
  // 4~8글자 영문과 숫자
  const memIdRegex = /^[A-Za-z0-9]{4,8}$/; 

// ※ 비밀번호 조건 정해지면 정규식 제대로 쓸 것  
  // 6~12글자 영문과 숫자, 
  const memPwRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;

  switch(e.target.name){
    case 'memId':
      if(!e.target.value)
        errorStr = '아이디는 비워둘 수 없습니다';
      else if(e.target.value.length < 4 || e.target.value.length > 8)
        errorStr = '아이디는 4~8글자여야 합니다';            
      else if(!memIdRegex.test(e.target.value))
        errorStr = '아이디는 영문과 숫자로만 이루어져야합니다';                    
      else 
        errorStr = ''; 
      break;

    case 'memPw':
      if(!e.target.value)
        errorStr = '비밀번호는 비워둘 수 없습니다';
      else if(e.target.value.length < 6 || e.target.value.length > 12)
        errorStr = '비밀번호는 6~12글자여야 합니다';
      else if(!memPwRegex.test(e.target.value))
        errorStr = '비밀번호는 영문과 숫자의 조합이어야 합니다';
      else 
        errorStr = '';  
      break; 

    case 'confirmPw':
      // 비밀번호와 일치하지 않으면
      if(e.target.value !== newShopMember.memPw){
        errorStr = '비밀번호가 일치하지 않습니다';
      }
      break;
  }
  
  return errorStr;
}

export default handleErrorMsg;