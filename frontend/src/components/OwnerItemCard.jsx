import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiFoodTag } from "react-icons/bi";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';



function OwnerItemCard({data}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRemoveItem = async()=>{
        try {
           const result= await axios.get(`${serverUrl}/api/item/remove/${data._id}`,{withCredentials:true});
           dispatch(setMyShopData(result.data))

        } catch (error) {
            console.log(error);
            
        }

    }
    
  return (
    <div className='flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl '>
        <div className='w-36 h-full flex-shrink-0 bg-gray-50'>
            <img src={data.image} alt="" className='w-full h-full object-cover'/>
        </div>
        <div className='flex flex-col justify-between p-3 flex-1'>
            <div >
                <h2 className='text-base font-semibold text-[#ff4d2d]'>{data.name}</h2>
                <p className=''><span className='font-medium text-gray-700'>Category </span> : {data.category}</p>
                <p className='flex'> <span className='font-medium text-gray-700'>Food Type</span> :{data.foodType} {data.foodType=="veg"?<BiFoodTag className='text-green-700' size={25}/>:<BiFoodTag className='text-red-600'size={25} />} </p>

            </div>

            <div className='flex items-center justify-between'>
                <div className='text-[#ff4d2d] font-bold'> <span className='font-medium text-gray-700'>Price </span> : {data.price} Rs</div>
                 <div className=' flex items-center gap-2 text-[#ff4d2d]'>   
                    <div className='p-2 rounded-full  hover:bg-[#ff4d2d]/10 ' onClick={()=>navigate(`/edit-item/${data._id}`)}><FaPen size={19} /></div>
                <div className='rounded-full  hover:bg-[#ff4d2d]/10 p-2' onClick={handleRemoveItem} > <FaTrashAlt size={19} /></div>

                </div>

                
            </div>

        </div>
      
    </div>
  )
}

export default OwnerItemCard
