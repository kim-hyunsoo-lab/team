import React, { useEffect, useState } from 'react'
import styles from './MemberList.module.css'
import axios from 'axios'
import PageTitle from '../../common/PageTitle'
import dayjs from 'dayjs'
import MemberBuyDetail from './MemberBuyDetail'

const MemberList = () => {
  // 상세보기 Modal
  const [modalOpen, setModalOpen] = useState(false);

  const [memberList, setMemberList] = useState([]);  
  
  useEffect(()=>{axios.get('/api/members/selectmembers')
    .then(res=>{
      console.log(res.data);      
      setMemberList(res.data);})
    .catch(error=>console.log(error));
    }, []);

  const [detailData, setDetailData] = useState([]);

  // 행 클릭시 구매 상세 내역 조회하는 함수
  const getDetail = (memId) =>{
    axios.get(`/api/buy/${memId}`)
    .then(res=>{
      console.log(res.data);
      setDetailData(res.data);
    })
    .catch(e=>console.log(e))
  } 

  const handleRowClick = (memId) => {
    getDetail(memId);
    setModalOpen(true);
  };
  
  return (
    <div className={styles.container}>
      <PageTitle title='회원 목록' />

      <div>
        <table className={styles.memberListTable}>
          <colgroup>
            <col width="10%" />
            <col width="17%" />
            <col width="14%" />
            <col width="27%" />        
            <col width="*%" />        
          </colgroup>
          <thead>
            <tr>
              <td>No</td>
              <td>아이디</td>
              <td>이름</td>
              <td>가입일</td>
              <td>구매 목록</td>
            </tr>
          </thead>
          <tbody>
            {memberList.length == 0 ? 
            <tr>
              <td colSpan={4}>
                <span>등록된 회원이 없습니다</span>
              </td>
            </tr>
            :
            memberList.map((e, i)=>{
              return(
                <tr onClick={() => handleRowClick(e.memId)} key={i}>
                  <td>{memberList.length-i}</td>
                  <td>{e.memId}</td>
                  <td>{e.memName}</td>
                  <td>{dayjs(e.joinDate).format('YYYY년 MM월 DD일')}</td>
                  <td>{e.purchase}</td>
                </tr>
              )
            })
            }
          </tbody>
        </table>
      </div>

      {/* 구매 상세 내역 모달 */}
      <MemberBuyDetail onClose={()=>setModalOpen(false)} detailData={detailData} modalOpen={modalOpen} />

    </div>
  )
}

export default MemberList