import React, { useState } from 'react'
import { BiFoodTag } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from '../redux/userSlice';






function FoodCart({data}) {
    const [quantity,setQuantity] = useState(0);
    const{cartItems}= useSelector(state=>state.user)
    const dispatch = useDispatch();

    const renderStars = (rating)=>{
        const stars =[];
        for(let i=1 ; i<=5;i++){
            stars.push(
                (i<=rating)?(<FaStar className='text-yellow-500 text-lg'/>):(<FaRegStar className='text-lg text-yellow-500 ' />)
            )
        }
        return stars;


    }
    const handleIncrease = ()=>{
        const newQty =quantity+1;
        setQuantity(newQty)
    }
    const handleDecrease = ()=>{
        if(quantity>0){
            const newQty =quantity-1;
        setQuantity(newQty)

        }
        
    }

  return (
    <div className='w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col'>
        <div className='relative w-full h-[170px] flex justify-center items-center bg-white'>

            <div className='absolute top-3 right-3 bg-white rounded-full p-1 shadow'>
                {data.foodType=="veg"?<BiFoodTag className='text-green-700' size={25}/>:<BiFoodTag className='text-red-600'size={25} />}
            </div>
            <img src={data.image}  className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'/>

        </div>

        <div className='flex-1 flex flex-col p-4'>
            <h1 className='font-semibold text-gray-900 text-base truncate'>{data.name}</h1>
            <div className='flex items-center gap-1 mt-1'>
                {renderStars(data.rating.average|| 0)}
                <span className='text-xs text-gray-500'>{data.rating.count || 0}</span>
            </div>

        </div>

        <div className='flex items-center justify-between mt-auto p-3'>
            <span className='ml-1.5 font-bold  text-[#ff4d2d] text-lg'>
                {data.price}
            </span>
            <div className='flex items-center border rounded-full overflow-hidden shadow-sm'>
                <button className='px-2 py-1 hover:bg-gray-100 transition' onClick={handleDecrease}><FaMinus size={12}/></button>
                <span>{quantity}</span>
                <button className='px-2 py-1 hover:bg-gray-100 transition' onClick={handleIncrease}><FaPlus size={12}/></button>

                <button className={`${cartItems.some(i=>i.id==data._id)?"bg-gray-900":"bg-[#ff4d2d]"} text-white px-3 py-2 transition-colors`} onClick={()=>
                {quantity>0?dispatch(addToCart({
                     id:data._id,
                     name:data.name,
                     price:data.price,
                     image:data.image,
                     shop:data.shop,
                     quantity,
                    foodType:data.foodType,
                })):null}
                }>
                    <FaShoppingCart size={16} />
                </button>
                
            </div>

        </div>
      
    </div>
  )
}

export default FoodCart
