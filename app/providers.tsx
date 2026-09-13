"use client"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { AuthInitializer } from "./components/auth/AuthInitializer"
import {AddressInitializer} from "./components/address/AddressInitializer"
import Navbar from "./components/Navbar";

export function Providers({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>
        <AuthInitializer>
            <AddressInitializer/>
            <Navbar/>
            {children}
        </AuthInitializer>

    </Provider>
}