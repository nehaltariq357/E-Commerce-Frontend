"use client"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { AuthInitializer } from "./components/auth/AuthInitializer"
import {AddressInitializer} from "./components/address/AddressInitializer"

export function Providers({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>
        <AuthInitializer>
            <AddressInitializer/>
            {children}
        </AuthInitializer>

    </Provider>
}