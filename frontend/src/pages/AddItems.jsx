import React, { useRef, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';


function AddItems() {
    const navigate = useNavigate();
    const {myShopData} = useSelector(state=>state.owner);
   

    const dispatch = useDispatch();
    

    const[name ,setName] = useState("");
    const[price ,setPrice] = useState(0);
    
    
    const[frontendImage ,setFrontendImage] = useState(null);
    const[backendImage ,setBackendImage] = useState(null);
    const[category,setCategory]=useState("")
    const[foodType,setFoodType]=useState("veg")

    const categories=[
            "Snacks","Main Course","Desserts", "Pizza", "Burger","Sandwiches","South Indian","North India","Chinese","Fast Food","Other"
        ]

    const handleImage =(e)=>{
        const file = e.target.files[0]; 
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
    const handleSubmit = async(e)=>{
         e.preventDefault();
        try {
            const formdata = new FormData();
            formdata.append("name",name) 
            // .append(backendvarible,frontendvariable)
            formdata.append("category",category) 
            formdata.append("price",price)
            formdata.append("foodType",foodType)
            if(backendImage){
                formdata.append("image",backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/item/add-item`,formdata ,{withCredentials:true})
            console.log(result.data);
            
            dispatch(setMyShopData(result.data))
            navigate("/");
            
        } catch (error) {
            console.log(error)
        }
        
    }

  return (
    <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
        <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]' onClick={()=>navigate("/")}>
            <IoMdArrowBack size={28} className='text-[#ff4d2d]'/>
        </div>

        <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
            <div className='flex flex-col items-center mb-6'>
                <div className='bg-orange-100 p-4 rounded-full mb-4'>
                    <FaUtensils className='text-[#ff4d2d] w-16 h-16 '/>

                </div>
                <div className='text-3xl font-bold text-gray-900'>
                    Add Items

                </div>
            </div>
            <form className='space-y-5' onSubmit={handleSubmit}>
                {/* name */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Item Name</label>
                    <input placeholder='Enter Item Name' type="text" className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e)=>setName(e.target.value)} value={name}/>
                </div>
                {/* image */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Item image</label>
                    <input  type="file" accept='image/*' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e)=>{handleImage(e)}}/>
                    {frontendImage &&
                    <div className='mt-4'>
                        <img src={frontendImage}  className='w-full h-48 object-cover rounded-lg border'/>
                    </div>
                        }
                </div>
                {/* price */}
                 <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                    <input placeholder='ex.100(in Rupees)' type="number" className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e)=>setPrice(e.target.value)} value={price}/>
                </div>
                {/* category */}
                 <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                    <select className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e)=>setCategory(e.target.value)} value={category}>
                      <option value="">Select Category
                      </option>
                      {categories.map((cate,index)=>(
                        <option value={cate} key={index}>{cate}</option>
                      ))}
                    </select>
                </div>
                {/* food type */}
                 <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Food Type</label>
                    <select className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e)=>setFoodType(e.target.value)} value={foodType}>
                      
                      
                        <option value="veg" >veg</option>
                        <option value="non-veg" >non-veg</option>
                      
                    </select>
                </div>

                

                {/* button */}
                <button type ="submit" className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer'>
                    Save
                </button>

            </form>
        </div>
      
    </div>
  )
}

export default AddItems
