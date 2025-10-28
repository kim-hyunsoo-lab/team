import React, { useEffect, useState } from 'react'
import styles from './Dibs.module.css'
import PageTitle from '../../../common/PageTitle'
import axios from 'axios'
import dayjs from 'dayjs'
import Button from '../../../common/Button'
import { useNavigate } from 'react-router'

const Dibs = () => {
  const nav = useNavigate();
  //찜한 상품 목록을 저장할 state 변수
  const [dibsList, setDibsList] = useState([]);

  //체크된 아이템들을 저장할 state 변수 (아이템 번호 배열)
  const [checkedItems, setCheckedItems] = useState([]);

  //백엔드에서 불러온 찜한 상품을 dibsList에 저장
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/dibs');
        console.log(res.data);
        setDibsList(res.data);
      } catch (error) {
        console.log(error);
        alert(error.response.data);
      }
    }
    fetchData();
  }, [])

  //전체 선택 체크박스 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // 모든 아이템의 번호를 배열에 추가
      const allItemNums = dibsList.map(item => item.itemNum);
      setCheckedItems(allItemNums);
    } else {
      // 전체 해제
      setCheckedItems([]);
    }
  };

  //개별 체크박스 핸들러
  const handleCheckItem = (itemNum) => {
    if (checkedItems.includes(itemNum)) {
      // 이미 체크되어 있으면 제거
      setCheckedItems(checkedItems.filter(num => num !== itemNum));
    } else {
      // 체크되어 있지 않으면 추가
      setCheckedItems([...checkedItems, itemNum]);
    }
  };

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
                  dibsList.map((item, i) => {
                    //이미지 찾기
                    const imageUrl = `http://localhost:8080/upload/${item.itemDTO.imgList[0].attachedImgName}`

                    return (
                      <tr key={i} className={styles.table_body_row}>
                        <td className={styles.checkbox_cell}>
                          <input
                            type="checkbox"
                            checked={checkedItems.includes(item.itemNum)}
                            onChange={() => handleCheckItem(item.itemNum)}
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
                            <Button title='장바구니' />
                            <Button title='삭제' color='gray' />
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
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Dibs