import React from 'react'
import MypageHeader from '../../layout/user/MypageHeader'
import MypageSide from '../../layout/user/MypageSide'
import { Outlet } from 'react-router'

const Mypage = () => {
  return (
    <div>
      <div>
        <MypageHeader/>
      </div>
      <div>
        <div>
          <MypageSide/>
        </div>
        <div>
          <Outlet/>
        </div>
      </div>

    </div>
  )
}

export default Mypage