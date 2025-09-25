import React, { useEffect, useState } from 'react'
import styles from './MemberList.module.css'
import axios from 'axios'
import PageTitle from '../../common/PageTitle'
import dayjs from 'dayjs'

const MemberList = () => {
  const [memberList, setMemberList] = useState([]);  
  
  useEffect(()=>{axios.get('/api/members/selectmembers')
    .then((res)=>{
      console.log(res.data);      
      setMemberList(res.data);})
    .catch(error=>console.log(error));
    }, []);
  
  return (
    <div className={styles.container}>
      <PageTitle title='회원 목록' />

      <div>
        <table>
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
                <tr data-details="test" key={i}>
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
      
      




    </div>
  )
}

export default MemberList