"use client"
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setUser, logout } from "../../features/auth/authSlice";
import { getCurrentUser, refreshAccessToken } from "../../features/auth/auth.api";


export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // current user check
                const response = await getCurrentUser();

                dispatch(setUser(response.data));
            } catch {
                try {
                    //  Access token expire?
                    // Refresh token ---> new access token 
                    await refreshAccessToken();

                    //  again current user fetch 
                    const response = await getCurrentUser();

                    dispatch(setUser(response.data));
                } catch {
                    //  Refresh fail
                    dispatch(logout());
                }
            } finally {
                setLoading(false);
            }
        };
        checkAuthentication()
    }, [dispatch])

    if (loading) {
        return <div>Loading...</div>
    }
    return <>{children}</>
}