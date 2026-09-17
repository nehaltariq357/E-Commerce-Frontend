"use client"
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setUser, setLogout } from "../../features/auth/authSlice";
import { getCurrentUser, refreshAccessToken } from "../../features/auth/auth.api";
import { Spinner } from "@/components/ui/spinner"

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
                    dispatch(setLogout());
                }
            } finally {
                setLoading(false);
            }
        };
        checkAuthentication()
    }, [dispatch, setLoading])

//  if (loading) {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center gap-4">
//       <Spinner />
//       <p className="text-sm text-zinc-500">Loading...</p>
//     </div>
//   );
// }
    return <>{children}</>
}