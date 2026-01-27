import React from 'react'
import { useSelector } from 'react-redux';

import OwnerDashboard from '../components/OwnerDashboard';
import DeliveryboyDashboard from '../components/DeliveryboyDashboard';
import UserDashboard from '../components/UserDashboard';

function Home() {
    const {userData}= useSelector(state=>state.user)
  return (
    <div className='w-screen min-h-screen pt-25 flex flex-col items-center bg-[#fff9f6]'>
     
      {
        userData?.role =="user" && <UserDashboard/>
      }
      {
        userData?.role =="owner" && <OwnerDashboard/>
      }
      {
        userData?.role =="deliveryBoy" && <DeliveryboyDashboard/>
      }
      
    </div>
  )
}

export default Home
