import React, { useEffect } from 'react'
import axios from "axios";
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setShopInMyCity, setUserData } from '../redux/userSlice';

function useGetShopBYCity() {
    const {city} = useSelector(state=>state.user)
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchShpos = async ()=>{
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-shops/${city}`,{withCredentials:true}) 
                console.log(result.data);
                 
                dispatch(setShopInMyCity(result.data))
                
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchShpos()
    },[city])

}

export default useGetShopBYCity
