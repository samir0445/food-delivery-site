import React, { useEffect, useRef, useState } from 'react';
import Nav from './Nav';
import { categories } from '../category';
import CategoryCard from './CategoryCard';
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCart from './FoodCart';
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';



function UserDashboard() {
  const {city,shopInMyCity,itemsInMyCity,searchItems} = useSelector(state=>state.user)
const cateScrollRef = useRef();
const shopScrollRef = useRef();
const [showLeftCateButton ,setShowLeftCateButton] = useState(false)
const [showRightCateButton ,setShowRightCateButton] = useState(false)
const[updatedItem,setUpdatedItem]=useState([]);
const navigate= useNavigate();

// const updateButton = (ref,setleft,setRight)=>{
//   const element = ref.current;
//   if(element){
//     setleft(element.scrollLeft>0);
//     setRight(element.scrollLeft+element.clientWidth<element.scrollWidth)
//   }

// }



const handleFilterByCategory= (category)=>{
  try {
    if(category=="All"){
      setUpdatedItem(itemsInMyCity);
    }else{
      const filterItems = itemsInMyCity.filter(i=>i.category===category);
      setUpdatedItem(filterItems);
    }
    
  } catch (error) {
    console.log(error);
    
  }
}

const scrollhandler = (ref,direction)=>{
  if(ref.current){
    ref.current.scrollBy({
      left:direction=="left"?-200:200,
      behavior :"smooth"
    })
  }

}
useEffect(()=>{
  setUpdatedItem(itemsInMyCity)
},[itemsInMyCity])

// useEffect(()=>{
//   if(cateScrollRef.current){
//     updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton);
//     cateScrollRef.current.addEventListener('scroll',()=>{
//       updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton);
//     })
//   }

//   return ()=>cateScrollRef.current.removeEventListener("scroll",()=>{
//       updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton);
//     })
// },[categories]);




  return (
    
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f9] overflow-y-auto'>
     <Nav/>
     {searchItems && searchItems.length>0 && (
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
        <h2 className='text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2'>Search results</h2>
        <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
          {searchItems.map((item ,index)=>(<FoodCart data={item} key={index}/>))}
        </div>

      </div>

     ) }
      

      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
          <h1 className='text-gray-800 text-2xl sm:text-3xl'>Explore For your First Order</h1>
        
          {/* slider for category */}
          <div className='relative w-full'>

            
            <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollhandler(cateScrollRef,"left")}>
            <FaCircleChevronLeft />
            </button>
           

            <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={cateScrollRef}>
              {categories.map((cate,index)=>(
                <CategoryCard name={cate.category} image={cate.image} key={index} onClick={()=>handleFilterByCategory(cate.category)} />
              ))}
          </div>

          
           <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'onClick={()=>scrollhandler(cateScrollRef,"right")} >
            <FaCircleChevronRight />
          </button>
          


        </div>

      </div>

      <div  className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]' >
         <h1 className='text-gray-800 text-2xl sm:text-3xl'> Explore Shop In {city}</h1>

          <div className='relative w-full'>

            
            <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollhandler(shopScrollRef,"left")}>
            <FaCircleChevronLeft />
            </button>
           

            <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={shopScrollRef}>
              {shopInMyCity?.map((shop,index)=>(
                <CategoryCard image={shop.image} name={shop.name} key={index} onClick={()=>navigate(`/shop/${shop._id}`)} />
              ))}
          </div>

          
           <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'onClick={()=>scrollhandler(shopScrollRef,"right")} >
            <FaCircleChevronRight />
          </button>
          


        </div>

      </div>
      
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl'> Suggested Food Items</h1>

        <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
          {updatedItem?.map((item,index)=>(
            <FoodCart key={index} data={item}/>
          ))}

        </div>

      </div>
      
    </div>
    
  )
}







export default UserDashboard
