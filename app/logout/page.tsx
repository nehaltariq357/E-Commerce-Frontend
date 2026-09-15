"use client"
import React from 'react'
import { logout } from "../features/auth/auth.api";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { setLogout} from "../features/auth/authSlice";
import { useAppDispatch } from "../store/hooks";
import { toast } from "sonner"

const Logout = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleLogout = async () => {
        try {
            setIsSubmitting(true);
            setError("");
            await logout();
            dispatch(setLogout());
            toast("Logout successful!");
            router.push("/login");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Logout failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <button onClick={handleLogout} disabled={isSubmitting}>
                {isSubmitting ? "Logging out..." : "Logout"}
            </button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Logout