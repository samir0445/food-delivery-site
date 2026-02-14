import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { useEffect } from 'react'
import { useState } from 'react'
import DeliveryBoyTracking from './DeliveryBoyTracking'

function DeliveryboyDashboard() {
  const{userData} = useSelector(state=>state.user)
  const [availableAssignment , setAvailableAssignment] = useState([]);
  const [currOrder,setCurrOrder]= useState()
  const [showOtpBox,setShowOtpBox]=useState(false);
  
  const getAssignments= async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`,{withCredentials:true})
      console.log(result.data)
      setAvailableAssignment(result?.data);
      
    } catch (error) {
      console.log(error)
    }

  
  }

  const getCurrentOrder = async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`,{withCredentials:true})
      setCurrOrder(result.data);
      
      
    } catch (error) {
      console.log(error);
      
    }
  }
  const handleOtp = (e)=>{
    setShowOtpBox(true)
  }


  const acceptOrder = async(assignmentId)=>{
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`,{withCredentials:true})
      console.log(result.data)
      await getCurrentOrder();
      
      
    } catch (error) {
      console.log(error);
      
    }
  }


  useEffect(()=>{
    getAssignments();
    getCurrentOrder();
  },[userData])

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f9] overflow-y-auto'>
      <Nav/>
      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
        <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2'>
          <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome, {userData?.fullName}</h1>
          <p className='text-[#ff4d2d] '>
            <span className='font-semibold'>Latitude : </span> : {userData?.location.coordinates[1]} , <span className='font-semibold'>Longitude :</span> : {userData?.location.coordinates[0]}
          </p>

        </div>

        {!currOrder &&
        <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-gray-100'>
          <h1 className='text-lg font-bold mb-4 items-center gap-2'>Available Orders</h1>

        
          <div className='space-y-4'>
            {availableAssignment.length>0?(
              availableAssignment.map((a,index)=>(
                <div className='border rounded-lg p-4 flex justify-between items-center ' key={index}>
                  <div className=''>
                    <p className='text-sm font-semibold'>{a.shopName}</p>
                    <p className='text-sm text-gray-500'><span className='font-semibold'>Delivery Address</span> : {a.deliveryAddress.text}</p>
                    <p className='text-xs text-gray-400'>{a.items.length} Items | {a.subTotal}</p>
                  </div>
                  <button className='bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600' onClick={()=>acceptOrder(a.assignmentId)}>Accept</button>

                </div>
              ))
            ): <p className='text-gray-400 text-sm'>NO Availabe Orders</p> }
          </div>

        </div>}

        {currOrder &&
          <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
            <h2 className='text-lg font-bold mb-3'>Current Order</h2>
            <div className='border rounded-lg p-4 mb-3'>
              <p className='font-semibold text-sm'>{currOrder?.shopOrder.shop.name}</p>
              <p className='text-sm text-gray-500'>{currOrder?.deliveryAddress.text}</p>
              <p className='text-xs text-gray-400'>{currOrder.shopOrder.shopOrderItem.length} Items | {currOrder.shopOrder.subTotal}</p>
            </div>
            <DeliveryBoyTracking data={currOrder}/>

            {!showOtpBox ?
            <button className='mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200' onClick={handleOtp}>Mark As Delivered</button>:
            <div className='t-4 p-4 border rounded-xl bg-gray-50'>
              <p className='text-sm font-semibold mb-2'>Enter Otp send to <span className='text-orange-500'>{currOrder.user.fullName}</span> </p>
              <input type="text" placeholder='Enter Otp ' className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400' />
              <button className='w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all'>Submit OTP</button>

            </div>
            }
            

          </div>
        }

      </div>
    </div>
  )
}

export default  DeliveryboyDashboard
