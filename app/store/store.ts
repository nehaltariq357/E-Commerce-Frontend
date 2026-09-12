import {configureStore} from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import cartReduce from "../features/cart/cartSlice"
import addressReducer from "../features/address/addressSlice"
import orderReducer from "../features/order/orderSlice"
import adminOrderReducer from "../features/admin-order/admin-orderSlice"
export const store = configureStore({
    reducer: {
        auth:authReducer,
        cart:cartReduce,
        address:addressReducer,
        order:orderReducer,
        adminOrder:adminOrderReducer
    },
})

export type RootState = ReturnType<typeof store.getState> // useSelector
export type AppDispatch = typeof store.dispatch // useDispatch