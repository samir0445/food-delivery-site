import{ configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"

export const store = configureStore({
    reducer:{
        owner:ownerSlice,
        user:userSlice
        
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
    
})