import React, { useEffect, useState } from 'react'
import styles from './MemberList.module.css'
import axios from 'axios'
import PageTitle from '../../common/PageTitle'
import dayjs from 'dayjs'

const MemberList = () => {
  const [memberList, setMemberList] = useState([]);
  
  
  useEffect(()=>{axios.get('/api/members/list')
    .then((res)=>{
      console.log(res.data)      
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
            <col width="20%" />
            <col width="10%" />
            <col width="20%" />        
          </colgroup>
          <thead>
            <tr>
              <td>No</td>
              <td>아이디</td>
              <td>이름</td>
              <td>가입일</td>
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
                <tr key={i}>
                  <td>{memberList.length-i}</td>
                  <td>{e.memId}</td>
                  <td>{e.memName}</td>
                  <td>{dayjs(e.joinDate).format('YYYY.MM.DD HH:mm')}</td>
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