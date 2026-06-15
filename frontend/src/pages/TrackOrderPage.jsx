import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { IoMdArrowBack } from "react-icons/io";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking';
import { useSelector } from 'react-redux';

function TrackOrderPage() {
  const{socket}=useSelector(state=>state.user);
  const navigate = useNavigate();
  const {orderId} = useParams();
  const [currOrder,setCurrOrder]=useState();
  const[liveLocation,setLiveLocation]=useState({})


  const handleGetOrder = async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`,{withCredentials:true})
      console.log(result.data);
      
      setCurrOrder(result?.data)

      
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
    socket.on('updateDeliveryLocation',({delievryBoyId,latitude,longitude})=>{
      setLiveLocation(prev=>({
        ...prev,
        [delievryBoyId]:{lat:latitude,lon:longitude}
      }))
    })

  },[socket])

  useEffect(()=>{
    handleGetOrder();
  },[orderId])
  
  return (
    <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>
      <div className='relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px]' onClick={()=>navigate("/")}>
           <IoMdArrowBack size={28} className='text-[#ff4d2d]'/>
           <h1 className='text-2xl font-bold md:text-center'>Track Order</h1>
        </div>
        {currOrder?.shopOrders?.map((shopOrder,index)=>(
          <div className='bg-white p-4 rounded-2xl shadow-md border-orange-100 space-y-4' key={index}>
            <div>
              <p className='text-lg font-bold mb-2 text-[#ff4d2d]'>{shopOrder.shop.name}</p>
              <p className='font-semibold'><span>Items : </span>{shopOrder?.shopOrderItem.map(i=>i.name).join(" , ")}</p>
              <p className='font-semibold text-[#ff4d2d]'> <span className='text-gray-600'>SubTotal : </span>₹ {shopOrder.subTotal} </p>
              <p className='font-semibold'> <span>Delivery Address : </span> {currOrder.deliveryAddress.text} </p>
            </div>
            {shopOrder.status!="delivered"?
            <>
              
              {shopOrder.assignedDeliveryBoy? <div className='text-sm text-gray-700'>
                <p className='font-semibold'> <span>DeliveryBoy Name: </span> {shopOrder.assignedDeliveryBoy.fullName}</p>
                <p className='font-semibold'> <span>mobile : </span>{shopOrder.assignedDeliveryBoy.mobile}</p>
                
              </div>: <p className='font-semibold'>DeliveryBoy not Assigned</p> }

            </>:<p className='text-green-600 font-semibold text-lg'>Order has been delivered</p>}

            {shopOrder.deliveryOtp?(
              <div className='flex justify-center mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md'><h1><span>DeliveryOtp : </span>{shopOrder.deliveryOtp}</h1>

              </div>
            ):null}

            {(shopOrder.assignedDeliveryBoy && shopOrder.status!="delivered") &&
            <div className='h-[400px] w-full rounded-2xl overflow-hidden shadow-md'>

              <DeliveryBoyTracking data={{
                deliveryBoyLocation:liveLocation[shopOrder.assignedDeliveryBoy._id] ||{
                  lat:shopOrder.assignedDeliveryBoy.location.coordinates[1],
                  lon:shopOrder.assignedDeliveryBoy.location.coordinates[0],
                },
                customerLocation:{
                  lat:currOrder.deliveryAddress.latitude,
                  lon:currOrder.deliveryAddress.longitude,
                }
  
              }}/>
            </div>
             }

            



          </div>
        ))}

      
    </div>
  )
}

export default TrackOrderPage
