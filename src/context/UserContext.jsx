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
    const { user: authUser, isAuthenticated } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Clear profile when user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            setProfile(null);
            setError(null);
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
            const errorMessage = err.message || "Failed to fetch profile";
            setError(errorMessage);
            console.error("Profile fetch error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        try {
            setError(null);
            setLoading(true);

            const response = await updateUserProfile(profileData);

            // Backend returns { user, updates } in response.data
            if (response.data.user) {
                setProfile(response.data.user);
            }

            // Return full response including updates object for component use
            return {
                ...response,
                updates: response.data.updates // Expose updates (emailVerificationSent, passwordChanged, etc.)
            };
        } catch (err) {
            const errorMessage = err.message || "Failed to update profile";
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
            setLoading(true);

            const response = await verifyEmailChange(token);

            // Update profile with new verified email
            if (response.data.email) {
                setProfile(prev => prev ? {
                    ...prev,
                    email: response.data.email,
                    isVerified: true
                } : null);
            }

            return response;
        } catch (err) {
            const errorMessage = err.message || "Failed to verify email change";
            setError(errorMessage);
            console.error("Email verification error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Clear error
    const clearError = () => setError(null);

    const value = {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        handleVerifyEmailChange,
        clearError,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};