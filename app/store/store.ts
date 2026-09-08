import {configureStore} from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import cartReduce from "../features/cart/cartSlice"
export const store = configureStore({
    reducer: {
        auth:authReducer,
        cart:cartReduce
    },
})

export type RootState = ReturnType<typeof store.getState> // useSelector
export type AppDispatch = typeof store.dispatch // useDispatch