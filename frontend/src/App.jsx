import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/forgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import useGetMyShop from './hooks/useGetMyShop'
import CreateEditShop from './pages/createEditShop'
import AddItems from './pages/AddItems'
import EditItem from './pages/EditItem'
import useGetShopBYCity from './hooks/useGetShopByCity'
import useGetItemsBYCity from './hooks/useGetItemsByCity'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrder from './pages/MyOrder'
import useGetMyOrders from './hooks/useGetMyOrder'
import useUpdateLocation from './hooks/useUpdateLocation'
import TrackOrderPage from './pages/TrackOrderPage'
export const serverUrl ="http://localhost:3000"

function App() {
  useGetCity();
  useUpdateLocation();
  useGetCurrentUser();
  useGetMyOrders();
  useGetItemsBYCity(); 
  useGetShopBYCity();
  useGetMyShop();
  

  const {userData} = useSelector(state=>state.user)
  return (
  <Routes>
    <Route path="/signup" element ={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
    <Route path="/signin" element ={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
    <Route path="/forgot-password" element ={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
    <Route path="/" element ={userData?<Home/>:<Navigate to={"/signin"} />}/>
    <Route path="/create-edit-shop" element ={userData?<CreateEditShop/>:<Navigate to={"/signin"} />}/>
    <Route path="/add-item" element ={userData?<AddItems/>:<Navigate to={"/signin"} />}/>
    <Route path="/edit-item/:itemId" element ={userData?<EditItem/>:<Navigate to={"/signin"} />}/>
    <Route path="/cart" element ={userData?<CartPage/>:<Navigate to={"/signin"} />}/>
    <Route path="/checkout" element ={userData?<CheckOut/>:<Navigate to={"/"} />}/>
    <Route path="/order-placed" element ={userData?<OrderPlaced/>:<Navigate to={"/"} />}/>
    <Route path="/my-order" element ={userData?<MyOrder/>:<Navigate to={"/"} />}/>
    <Route path="/track-order/:orderId" element ={userData?<TrackOrderPage/>:<Navigate to={"/"} />}/>
    
  </Routes>
  )
}

export default App
