"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, verifyEmailChange } from "@/api/UserApi";
import { useAuth } from "@/context/AuthContext";

const UserContext = createContext(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Helper to extract error message
    const getErrorMessage = (err) => {
        return err?.message || err?.data?.message || err?.error || "An error occurred";
    };

    // Clear profile when user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            setProfile(null);
            setError(null);
            setSuccessMessage(null);
        }
    }, [isAuthenticated]);

    // Auto-fetch profile on mount if authenticated
    useEffect(() => {
        if (isAuthenticated && !profile) {
            fetchProfile();
        }
    }, [isAuthenticated]);

    // Fetch user profile
    const fetchProfile = async () => {
        if (!isAuthenticated) {
            setProfile(null);
            return null;
        }

        try {
            setError(null);
            setLoading(true);

            const response = await getUserProfile();
            setProfile(response.data);

            return response;
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            console.error("Profile fetch error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        try {
            setError(null);
            setSuccessMessage(null);
            setLoading(true);

            const response = await updateUserProfile(profileData);

            // Update local profile state
            if (response.data?.user) {
                setProfile(response.data.user);
            }

            // Set success message
            setSuccessMessage(response.message || "Profile updated successfully");

            // Return full response including updates object
            return {
                ...response,
                updates: response.data?.updates
            };
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            console.error("Profile update error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Verify email change
    const handleVerifyEmailChange = async (token) => {
        try {
            setError(null);
            setSuccessMessage(null);
            setLoading(true);

            const response = await verifyEmailChange(token);

            // Update profile with new verified email
            if (response.data?.email) {
                setProfile(prev => prev ? {
                    ...prev,
                    email: response.data.email,
                    isVerified: true
                } : null);
            }

            setSuccessMessage(response.message || "Email verified successfully");
            return response;
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            console.error("Email verification error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Clear messages
    const clearMessages = () => {
        setError(null);
        setSuccessMessage(null);
    };

    const value = {
        profile,
        loading,
        error,
        successMessage,
        fetchProfile,
        updateProfile,
        handleVerifyEmailChange,
        clearMessages,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};