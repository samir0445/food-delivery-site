import React, { useEffect } from 'react'
import axios from "axios";
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setItemsInMyCity, setShopInMyCity, setUserData } from '../redux/userSlice';

function useGetItemsBYCity() {
    const {city} = useSelector(state=>state.user)
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchItems = async ()=>{
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-by-city/${city}`,{withCredentials:true}) 
                console.log(result.data);
                 
                dispatch(setItemsInMyCity(result.data))
                
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchItems()
    },[city])

}

export default useGetItemsBYCity
