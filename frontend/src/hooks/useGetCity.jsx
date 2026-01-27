import React, { useEffect } from 'react'
import axios from "axios";
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setCity, setState, setUserData } from '../redux/userSlice';

function useGetCity() {
    const dispatch = useDispatch();
    const {userData} = useSelector(state=>state.user)
    const apikey = import.meta.env.VITE_GEOAPI;
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(async(position)=>{
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const result =await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`)
            dispatch(setCity(result?.data?.results[0].city))
            dispatch(setState(result?.data?.results[0].state))   
        })

    },[userData])

}

export default useGetCity
