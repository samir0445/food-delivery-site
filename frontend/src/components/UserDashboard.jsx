import React, { useEffect, useRef, useState } from 'react';
import Nav from './Nav';
import { categories } from '../category';
import CategoryCard from './CategoryCard';
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCart from './FoodCart';



function UserDashboard() {
  const {city,shopInMyCity,itemsInMyCity} = useSelector(state=>state.user)
const cateScrollRef = useRef();
const shopScrollRef = useRef();
const [showLeftCateButton ,setShowLeftCateButton] = useState(false)
const [showRightCateButton ,setShowRightCateButton] = useState(false)

// const updateButton = (ref,setleft,setRight)=>{
//   const element = ref.current;
//   if(element){
//     setleft(element.scrollLeft>0);
//     setRight(element.scrollLeft+element.clientWidth<element.scrollWidth)
//   }

// }

const scrollhandler = (ref,direction)=>{
  if(ref.current){
    ref.current.scrollBy({
      left:direction=="left"?-200:200,
      behavior :"smooth"
    })
  }

}

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
    <>
    <Nav/>
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f9] overflow-y-auto'>
      

      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
          <h1 className='text-gray-800 text-2xl sm:text-3xl'>Explore For your First Order</h1>
        
          {/* slider for category */}
          <div className='relative w-full'>

            
            <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollhandler(cateScrollRef,"left")}>
            <FaCircleChevronLeft />
            </button>
           

            <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={cateScrollRef}>
              {categories.map((cate,index)=>(
                <CategoryCard name={cate.category} image={cate.image} key={index} />
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
                <CategoryCard image={shop.image} name={shop.name} key={index} />
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
          {itemsInMyCity?.map((item,index)=>(
            <FoodCart key={index} data={item}/>
          ))}

        </div>

      </div>
      
    </div>
    </>
  )
}







export default UserDashboard
