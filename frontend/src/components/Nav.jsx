import axios from 'axios';
import React, { useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux"
import { serverUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { FaPlus } from "react-icons/fa6";
import { LuReceiptText } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Nav() {
  const { userData,city,cartItems,myOrders,} = useSelector(state => state.user);
  const { myShopData } = useSelector(state => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const[showSearch,setShowSearch] = useState(false);
  const [query,setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchItem = async()=>{
  try {
    const result = await axios.get(`${serverUrl}/api/item/search?query=${query}&city=${city}`,{withCredentials:true})
    console.log(result?.data);
    dispatch(setSearchItems(result?.data))
    
    
  } catch (error) {
    console.log(error);
    
  }

}
useEffect(()=>{
  if(query){
    handleSearchItem();

  }else{
    dispatch(setSearchItems(null))
  }
},[query])

  const handleLogout = async()=>{
    try {
      const result =await axios.post(`${serverUrl}/api/auth/signout`,{withCredentials:true})
      dispatch(setUserData(null))
    } catch (error) {
      console.log(error);
      
    }
  }


  return (
    <div className='w-full h-[80px] flex items-center justify-center md:justify-center  gap-[30px] px-[20px] z-[50] fixed top-0 bg-[#fff9f6] overflow-visible'>
      <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>Vingo</h1>
      { 
      userData?.role ==="user"
       && 
      <div className='md:[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex'>
        <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
          <FaLocationDot size={25} className=' text-[#ff4d2d]' />
          <div className='w-[80%] truncate text-gray-600'>{city}</div>
        </div>

        <div className='w-[80%] flex items-center gap-[10px]'>
          <IoSearch size={25} className=' text-[#ff4d2d]' />
          <input type="text" placeholder='Search delicious food....' className='px-[10px] text-gray-700 outline-0 w-full' onChange={(e)=>setQuery(e.target.value) } value={query}/>

        </div>

      </div>}

      <div className='flex items-center gap-4'>
        {userData?.role ==="user" &&
        <div className='relative cursor-pointer'onClick={()=>navigate("/cart")}>
          <IoCartOutline size={30} className='text-[#ff4d2d]' />
          <span className='absolute right-[-9px] top-[-12px] text-[#ff4d2d] '>{cartItems.length}</span>
        </div>}

        {userData?.role ==="owner"  &&
        <div className=' flex flex-row gap-4'>
          { myShopData && <button className='flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] font-semibold' onClick={()=>navigate("/add-item")}>
            <FaPlus size={22}/>
            <span>Add Food Item</span>

          </button>}
          <div className='flex items-center gap-2 cursor-pointer relative px-2 py-1 rounded-lg  bg-[#ff4d2d]/10 text-[#ff4d2d] font-semibold ' onClick={()=>navigate("/my-order")}>
            <LuReceiptText size={23} />
            <span>Orders</span>
            <span className='absolute -right-2 -top-2 text-xs font-bold text-white  bg-[#ff4d2d] rounded-full px-[6px] py-[1px]'>
              {myOrders.length}
            

            </span>

          </div>
        </div>
        }

        {userData?.role =="user" &&
        <button className='hidden md:block cursor-pointer px-3 py-1 rounded-lg bg-[#ff4d2d]/10
         text-[#ff4d2d] text-sm font-medium h-[35px]' onClick={()=>navigate("/my-order")}>My Order
        </button>}

        <div className='w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer' onClick={() => setShowInfo(prev => !prev)}>
          
          {userData?.fullName.slice(0,1)}
        </div>
        {showInfo &&
          <div className={`fixed top-[80px] right-[10px] ${userData.role=="deliveryBoy"?"md:right-[20%] lg:right-[40%]":"md:right-[10%] lg:right-[25%]"}  w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]`}>

            <div className='text-[17px] font-semibold'>
              {userData.fullName}
            </div>


            <div className=' md:hidden text-[#ff4d2d] font-semibold cursor-pointer'>
              My Order
            </div>

            <div className='text-[#ff4d2d] font-semibold cursor-pointer' onClick={handleLogout}>
              Log Out
            </div>

          </div>
        }

      </div>


    </div>
  )
}

export default Nav;
