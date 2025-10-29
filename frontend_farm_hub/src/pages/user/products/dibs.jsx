import React, { useEffect, useState } from 'react'
import styles from './Dibs.module.css'
import PageTitle from '../../../common/PageTitle'
import axios from 'axios'
import dayjs from 'dayjs'
import Button from '../../../common/Button'
import { useNavigate } from 'react-router'

const Dibs = () => {
  const nav = useNavigate();
  //로그인 데이터
  const loginData = sessionStorage.getItem('loginInfo');
  console.log(JSON.parse(loginData).memId);
  //찜한 상품 목록을 저장할 state 변수
  const [dibsList, setDibsList] = useState([]);

  //체크된 아이템들을 저장할 state 변수 (아이템 번호 배열)
  const [checkedItems, setCheckedItems] = useState([]);

  //백엔드에서 불러온 찜한 상품을 dibsList에 저장
  useEffect(() => {
    const fetchData = async () => {
      try {
        const memId = JSON.parse(loginData).memId;
        const res = await axios.get(`/api/dibs?memId=${memId}`);
        console.log(res.data);
        setDibsList(res.data);
      } catch (error) {
        console.log(error);
        alert(error.response?.data || '데이터를 불러오지 못했습니다.');
      }
    }
    fetchData();
  }, [])

  //전체 선택 체크박스 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // 모든 찜 번호를 배열에 추가
      const allDibsNums = dibsList.map(item => item.dibsNum);
      setCheckedItems(allDibsNums);
    } else {
      // 전체 해제
      setCheckedItems([]);
    }
  };

  //개별 체크박스 핸들러
  const handleCheckItem = (dibsNum) => {
    if (checkedItems.includes(dibsNum)) {
      // 이미 체크되어 있으면 제거
      setCheckedItems(checkedItems.filter(num => num !== dibsNum));
    } else {
      // 체크되어 있지 않으면 추가
      setCheckedItems([...checkedItems, dibsNum]);
    }
  };

  console.log(checkedItems);

  //선택 삭제 함수
  const removeSelectedList = async () => {
    if (checkedItems.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    const confirmDelete = window.confirm(`선택한 ${checkedItems.length}개의 항목을 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    try {
      // URLSearchParams로 배열을 쿼리 파라미터로 변환
      const params = new URLSearchParams();
      checkedItems.forEach(num => params.append('dibsNumList', num));

      await axios.delete(`/api/dibs?${params.toString()}`);

      alert('삭제되었습니다.');

      // 목록 새로고침
      const memId = JSON.parse(loginData).memId;
      const res = await axios.get(`/api/dibs?memId=${memId}`);
      setDibsList(res.data);
      setCheckedItems([]); // 체크 초기화
    } catch (error) {
      console.log(error);
      alert(error.response?.data || '삭제에 실패했습니다.');
    }
  }

  // 장바구니에 담는 함수 (상품 하나만)
  // ✅ 수정: itemNum을 매개변수로 받아야 함
  const insertCart = async (itemNum) => {
    try {
      const res = await axios.post('/api/carts', {
        itemNum: itemNum,  // 개별 상품 번호
        cartCnt: 1,
        memId: JSON.parse(loginData).memId
      });
      
      alert('장바구니에 담겼습니다.');
      
    } catch (error) {
      console.log(error);
      alert(error.response?.data || '장바구니 담기에 실패했습니다.');
    }
  }

  // ✅ 추가: 찜 제거 함수 (개별 삭제)
  const removeSingleDib = async (dibsNum) => {
    const confirmDelete = window.confirm('이 항목을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/dibs/${dibsNum}`);
      alert('삭제되었습니다.');

      // 목록 새로고침
      const memId = JSON.parse(loginData).memId;
      const res = await axios.get(`/api/dibs?memId=${memId}`);
      setDibsList(res.data);
      setCheckedItems([]);
    } catch (error) {
      console.log(error);
      alert(error.response?.data || '삭제에 실패했습니다.');
    }
  }

  //전체 선택 여부 확인
  const isAllChecked = dibsList.length > 0 && checkedItems.length === dibsList.length;
  
  return (
    <div className={styles.container}>
      <PageTitle title='찜 리스트' />

      {dibsList.length === 0 ? (
        <div className={styles.empty_container}>
          <div className={styles.empty_icon}>
            <span><i className="fa-solid fa-heart-crack"></i></span>
          </div>
          <p className={styles.empty_message}>찜한 상품이 없습니다</p>
          <p className={styles.empty_description}>마음에 드는 상품을 찜해보세요!</p>
        </div>
      ) : (
        <>
          <div className={styles.table_wrapper}>
            <table className={styles.dibs_table}>
              <thead>
                <tr className={styles.table_header_row}>
                  <td className={styles.checkbox_cell}>
                    <input
                      type="checkbox"
                      checked={isAllChecked}
                      onChange={handleSelectAll}
                    />
                  </td>
                  <td className={styles.image_cell}>이미지</td>
                  <td className={styles.name_cell}>상품명</td>
                  <td className={styles.price_cell}>가격</td>
                  <td className={styles.date_cell}>담은 날짜</td>
                  <td className={styles.action_cell}>관리</td>
                </tr>
              </thead>
              <tbody>
                {
                  // ✅ 수정: 명확한 변수명 사용
                  dibsList.map((item, index) => {
                    //이미지 찾기
                    const imageUrl = `http://localhost:8080/upload/${item.itemDTO.imgList[0].attachedImgName}`

                    return (
                      <tr key={item.dibsNum} className={styles.table_body_row}>
                        <td className={styles.checkbox_cell}>
                          <input
                            type="checkbox"
                            checked={checkedItems.includes(item.dibsNum)}
                            onChange={() => handleCheckItem(item.dibsNum)}
                          />
                        </td>
                        <td className={styles.image_cell}>
                          {imageUrl ? (
                            <img src={imageUrl} alt={item.itemDTO.itemName} className={styles.item_image} />
                          ) : (
                            <div className={styles.no_image}>no image</div>
                          )}
                        </td>
                        <td className={styles.name_cell}>
                          <span
                            className={styles.item_name}
                            // ✅ 수정: 명확한 매개변수명 (event로 통일)
                            onClick={event => nav(`/product-detail/${item.itemNum}/intro`)}
                          >{item.itemDTO.itemName}</span>
                        </td>
                        <td className={styles.price_cell}>
                          <span className={styles.item_price}>{item.itemDTO.price.toLocaleString()}원</span>
                        </td>
                        <td className={styles.date_cell}>
                          {dayjs(item.dibsDate).format('YYYY년 MM월 DD일')}
                        </td>
                        <td className={styles.action_cell}>
                          <div className={styles.button_group}>
                            {/* ✅ 수정: itemNum을 전달해야 함 */}
                            <Button 
                              title='장바구니' 
                              onClick={(event) => insertCart(item.itemNum)} 
                            />
                            {/* ✅ 추가: 개별 삭제 버튼 */}
                            <Button 
                              title='삭제' 
                              color='gray'
                              onClick={(event) => removeSingleDib(item.dibsNum)}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>

          <div className={styles.summary_section}>
            <span className={styles.summary_text}>
              총 <strong>{dibsList.length}</strong>개의 상품
            </span>
            <Button
              title='선택 삭제'
              color='gray'
              size='150px'
              onClick={(event) => removeSelectedList()}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Dibs