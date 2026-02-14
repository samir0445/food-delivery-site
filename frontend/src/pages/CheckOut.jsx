import React, { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import { MapContainer, Marker } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { setAddress, setLocation } from '../redux/mapSlice';
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { serverUrl } from '../App';
import { addMyOrders } from '../redux/userSlice';




function RecenterMap({location}){
  
  if(location.lat && location.long){
    const map = useMap()
    map.setView([location.lat , location.long],15,{animate:true})
  }
  return null;

}

function CheckOut() {
  const {location , address} = useSelector(state=>state.map);
  const {cartItems,totalAmount} = useSelector(state=>state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apikey = import.meta.env.VITE_GEOAPI;
const [addressInput , setAddressInput] = useState("")
const[paymentMethod,setPaymentMethod] = useState("cod")

const deliveryFee = totalAmount>500?0:35
const grandTotal = totalAmount + deliveryFee;


const getAddressByLatLong = async(lat,long)=>{
  try {
     

    const result =await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&format=json&apiKey=${apikey}`)
   
    
    dispatch(setAddress(result?.data?.results[0].formatted))
  } catch (error) {
    console.log(error);
    
  }

}

const getCurrentLocaion = ()=>{
      navigator.geolocation.getCurrentPosition(async(position)=>{ 
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            dispatch(setLocation({lat:latitude,long:longitude}));
            getAddressByLatLong(latitude,longitude);
})}


const onDragEnd =(e)=>{
  const {lat,lng}=e.target._latlng;
  dispatch(setLocation({lat,long:lng}))
  
  getAddressByLatLong(lat,lng)
}

const getLatLng = async()=>{
  try {
    
    const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apikey}`)
    const{lat,lon} = result?.data?.features[0].properties;
    dispatch(setLocation({lat,long:lon}))

    
  } catch (error) {
    console.log(error);
    
  }
}
  
useEffect(()=>{
setAddressInput(address)
} ,[address])

const handlePlaceOrder =async()=> {
  try {
    const result = await axios.post(`${serverUrl}/api/order/place-order`,{
      paymentMethod,
      deliveryAddress :{
        text:addressInput,
        latitude:location.lat,
        longitude:location.long
      },
      totalAmount,
      cartItems
    },{withCredentials:true})
    
    dispatch(addMyOrders(result.data))
    navigate("/order-placed")
    
  } catch (error) {
    console.log(error);
    
  }

  
}

  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
      <div className='absolute top-[20px] left-[20px] z-[10]' onClick={()=>navigate("/")}>
         <IoMdArrowBack size={28} className='text-[#ff4d2d]'/>
       </div>

       <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Check Out</h1>

        <section>
          <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'> <IoLocationSharp size={28} className='text-[#ff4d2d]' /> Delivery Location </h2>

          <div className=' flex gap-2 mb-3'>
            <input type="text" className='flex-1 border-2 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter Your Delivery Address.....' value={addressInput} onChange={(e)=>setAddressInput(e.target.value)}/>
            <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center'onClick={()=>getLatLng()}>
              <IoSearchOutline size={18} />
            </button>

            <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer'onClick={getCurrentLocaion}>
              <BiCurrentLocation  size={18}/>
            </button>
          </div>
          <div className='rounded-xl border overflow-hidden'>
            <MapContainer className="w-full h-64 " center={[location?.lat,location?.long]} zoom={16} >
               <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location}/>
                <Marker position={[location?.lat,location?.long]} draggable eventHandlers={{dragend:onDragEnd}} >
                
                 </Marker>

            </MapContainer>

          </div>
        </section>

        <section>
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Payment Methods</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition${paymentMethod ==="cod"?"border-[#ff4d2d] bg-orange-50":"border-gray-200 hover:border-gray-300" }`} onClick={()=>setPaymentMethod("cod")}>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-200'>
                <MdDeliveryDining className='text-green-600 text-xl'/>

              </span>
              <div>
                <p className='font-medium text-gray-800'>Cash On Delivery</p>
                <p className='text-xs test-gray-500'>Pay on receiving order</p>
              </div>
              
            </div>
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition${paymentMethod ==="online"?"border-[#ff4d2d] bg-orange-50":"border-gray-200 hover:border-gray-300" }`} onClick={()=>setPaymentMethod("online")}>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                <FaMobileScreenButton className='text-purple-700 tetxt-lg'/>

              </span >
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-200'>
                <FaCreditCard className='text-blue-700 text-lg'/>

              </span >
              <div>
              <div>
                <p className='font-medium text-gray-800'>UPI / Credit /Debit Card</p>
                <p className='text-xs test-gray-500'>Pay Securely Online </p>
              </div>
              </div>

            </div>
          </div>
        </section>

        <section>
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Order Summery</h2>
          <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
            {cartItems.map((item,index)=>(
              <div key={index} className='flex justify-between text-sm text-gray-700'>
                <span> {item.name} X {item.quantity}</span>
                <span>₹  {item.price*item.quantity}</span>

              </div>
              
            ))}
            <hr className='border-gray-200 my-2'/>
            <div className='flex justify-between font-medium text-gray-900'>
              <span >Total Amount</span>
              <span>₹ {totalAmount}</span>
            </div>
            <div className='flex justify-between text-sm text-gray-900'>
              <span >Delivery Amount</span>
              <span>₹ {deliveryFee==0?"Free":deliveryFee}</span>
            </div>
            <div className='flex justify-between text-lg font-bold text-[#ff4d2d] pt-2'>
              <span className='font-semibold'>Total Payable Amount</span>
              <span>₹ {grandTotal}</span>
            </div>
          </div>

        </section>

        <button className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold' onClick={handlePlaceOrder}>
          {paymentMethod=="cod"?"Place Order" :"Pay & Place Order"}
        </button>


       </div>
      
    </div>
  )
}

export default CheckOut
