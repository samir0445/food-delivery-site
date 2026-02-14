import{ configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"
import mapSlice from "./mapSlice"

export const store = configureStore({
    reducer:{
        owner:ownerSlice,
        user:userSlice,
        map:mapSlice,
        
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
    
})