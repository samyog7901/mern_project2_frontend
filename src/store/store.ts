import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import productSlice from "./productSlice"
import cartSlice from "./cartSlice"
import checkoutSlice from "./checkoutSlice"
import categorySlice from "./categorySlice"


const store = configureStore({
    reducer: {
        auth : authSlice,
        product : productSlice,
        carts : cartSlice,
        orders : checkoutSlice,
        category : categorySlice
    }
})

export default store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>