import React, { useEffect } from 'react'
import axios from "axios";
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setCity, setState, setUserData } from '../redux/userSlice';
import { setAddress, setLocation } from '../redux/mapSlice';

function useUpdateLocation() {
    const dispatch = useDispatch();
    const {userData} = useSelector(state=>state.user)
    
    useEffect(()=>{

        const updateLocation = async(lat,lon)=>{
            const result = await axios.post(`${serverUrl}/api/user/update-location`,{lat,lon},{withCredentials:true})
            console.log(result.data)
        }

        navigator.geolocation.watchPosition((pos)=>{
            const lati =pos.coords.latitude;
            const loni = pos.coords.longitude;
            console.log(lati , loni);
            
            updateLocation(lati,loni);
        })
    },[userData])

}

export default useUpdateLocation;
