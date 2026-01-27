import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';

function ForgotPassword() {

  const primarycClor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [err,setErr] = useState("");


  const navigate = useNavigate()

  const handleSendOtp = async()=>{
    try {
      const result = await axios.post(`${serverUrl}/api/auth/send-otp`,{
        email
      },{withCredentials:true})
      setStep(2)
      setErr("")
      
    } catch (error) {
      setErr(error?.response?.data?.message);

      
    }

  }

  const handleVerifyOtp = async()=>{
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verify-otp`,{
        email,otp
      },{withCredentials:true})
      setStep(3)
      setErr("")
      
    } catch (error) {
       setErr(error?.response?.data?.message);

      
    }

  }
  const handleResetPassword = async()=>{
    if(newPassword != confirmPassword){
      return null;
    }
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`,{
        email,newPassword
      },{withCredentials:true})
      setErr("")
      navigate("/signin")
      
      
    } catch (error) {
      setErr(error?.response?.data?.message);
      
    }

  }


  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[]2px] `} style={{
        border: `1px solid ${borderColor}`
      }}>
        <div className='flex  items-center gap-4 mb-4'>
          <IoMdArrowBack size={30} className='text-[#ff4d2d] cursor-pointer' onClick={()=>navigate("/signin")}/>

          <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>

        </div>
        {step == 1 &&
          <div>
            <div className='mt-6 mb-5'>
              <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email </label>
              <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Email' style={{
                border: `1px solid ${borderColor}`
              }} onChange={(e) => setEmail(e.target.value)} value={email} required/>
            </div>

           <button className={`w-full font-semibold mt-4 py-2 rounded-lg  transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer` } onClick={handleSendOtp} >
              Send OTP
            </button>
            {err && <p className='text-red-500 text-center my-3'>*{err}</p>}



          </div>
        }

        {step == 2 &&
          <div>
            <div className='mt-6 mb-5'>
              <label htmlFor="otp" className='block text-gray-700 font-medium mb-1'>Enter OTP </label>
              <input type="text" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Received OTP here' style={{
                border: `1px solid ${borderColor}`
              }} onChange={(e) => setOtp(e.target.value)} value={otp} required/>
            </div>

           <button className={`w-full font-semibold mt-4 py-2 rounded-lg  transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer` } onClick={handleVerifyOtp}>
              Verify OTP
            </button>
            {err && <p className='text-red-500 text-center my-3'>*{err}</p>}



          </div>
        }
        {step == 3 &&
          <div>
            <div className='mt-6 mb-5'>
              <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>Enter New Password </label>
              <input type="password" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter new password' style={{
                border: `1px solid ${borderColor}`
              }} onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required />

              
            </div>

            <div className='mt-6 mb-5'>
              <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>Enter Confirm Password </label>
              <input type="password" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Confirm password' style={{
                border: `1px solid ${borderColor}`
              }} onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required/>

            </div>


           <button onClick={handleResetPassword} className={`w-full font-semibold mt-4 py-2 rounded-lg  transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer` }  >
              Reset Password
            </button>
            {err && <p className='text-red-500 text-center my-3'>*{err}</p>}



          </div>
        }

       


      </div>

    </div>
  )
}

export default ForgotPassword
