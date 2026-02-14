import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        city:null,
        state:null,
        shopInMyCity :null,
        itemsInMyCity :null,
        cartItems:[],
        totalAmount:0,
        myOrders:[],
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload
        },
        setCity:(state,action)=>{
            state.city = action.payload
        },
        setState:(state,action)=>{
            state.state = action.payload
        },
        setShopInMyCity:(state,action)=>{
            state.shopInMyCity = action.payload
        },
        setItemsInMyCity:(state,action)=>{
            state.itemsInMyCity = action.payload
        },
        addToCart:(state,action)=>{
            const cartItems = action.payload;
            const existItem = state.cartItems.find(i=>i.id==cartItems.id);
            // .find give the item from that are
            if(existItem){
                existItem.quantity +=cartItems.quantity;
            }else{
                state.cartItems.push(cartItems)
            }
            state.totalAmount = state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
        },
        updateQuantiy:(state,action)=>{
            const{id,quantity}=action.payload;
            const item = state.cartItems.find(i=>i.id==id)
            if(item){
                item.quantity =quantity
            }
            state.totalAmount = state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
        },
        removeCartItem :(state,action)=>{
           state.cartItems = state.cartItems.filter(i=>i.id!==action.payload)
           state.totalAmount = state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
        },
        setMyOrders :(state,action)=>{
            state.myOrders = action.payload;
        },
        addMyOrders :(state,action)=>{
            state.myOrders=[action.payload,...state.myOrders]
        },
        updateOrderStatus :(state,action)=>{
            const {orderId,shopId,status} = action.payload;
            const order = state.myOrders.find(o=>o._id==orderId);
            if(order){
                if(order.shopOrders && order.shopOrders.shop._id==shopId){
                    order.shopOrders.status = status;
                }
            }
        },

       


    }
})

export const {setUserData ,setCity, setState ,setShopInMyCity , setItemsInMyCity ,addToCart,updateQuantiy ,removeCartItem,setMyOrders,addMyOrders,updateOrderStatus} = userSlice.actions;
export default userSlice.reducer;