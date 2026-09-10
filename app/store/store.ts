import {configureStore} from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import cartReduce from "../features/cart/cartSlice"
import addressReducer from "../features/address/addressSlice"
import orderReducer from "../features/order/orderSlice"
export const store = configureStore({
    reducer: {
        auth:authReducer,
        cart:cartReduce,
        address:addressReducer,
        order:orderReducer
    },
})

export type RootState = ReturnType<typeof store.getState> // useSelector
export type AppDispatch = typeof store.dispatch // useDispatch