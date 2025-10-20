"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    getClientProfile as apiGetClientProfile,
    completeClientProfile as apiCompleteClientProfile,
    updateClientProfile as apiUpdateClientProfile,
    getConsultantProfile as apiGetConsultantProfile,
    completeConsultantProfile as apiCompleteConsultantProfile,
    updateConsultantProfile as apiUpdateConsultantProfile
} from "@/api/OnboardingApi";

const OnboardingContext = createContext(null);

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) throw new Error("useOnboarding must be used within an OnboardingProvider");
    return context;
};

export const OnboardingProvider = ({ children }) => {
    const { isAuthenticated, userType } = useAuth();

    const [clientProfile, setClientProfile] = useState(null);
    const [consultantProfile, setConsultantProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Helper to extract error message
    const getErrorMessage = (err, defaultMsg) => {
        return err?.message || err?.data?.message || err?.error || defaultMsg;
    };

    // ----------------- FETCH PROFILE -----------------
    const fetchProfile = async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        try {
            if (userType === "client") {
                const response = await apiGetClientProfile();
                setClientProfile(response.data ?? response);
            } else if (userType === "consultant") {
                const response = await apiGetConsultantProfile();
                setConsultantProfile(response.data ?? response);
            }
        } catch (err) {
            const message = getErrorMessage(err, "Failed to fetch profile");
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [isAuthenticated, userType]);

    // ----------------- CLIENT -----------------
    const completeClientProfile = async (profileData) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await apiCompleteClientProfile(profileData);
            setClientProfile(response.data ?? response);
            setSuccessMessage(response?.message || "Client profile saved successfully");
            return response;
        } catch (err) {
            const message = getErrorMessage(err, "Failed to save client profile");
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateClientProfile = async (profileData) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await apiUpdateClientProfile(profileData);
            setClientProfile(response.data ?? response);
            setSuccessMessage(response?.message || "Client profile updated successfully");
            return response;
        } catch (err) {
            const message = getErrorMessage(err, "Failed to update client profile");
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ----------------- CONSULTANT -----------------
    const completeConsultantProfile = async (profileData) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await apiCompleteConsultantProfile(profileData);
            setConsultantProfile(response.data ?? response);
            setSuccessMessage(response?.message || "Consultant profile saved successfully");
            return response;
        } catch (err) {
            const message = getErrorMessage(err, "Failed to save consultant profile");
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateConsultantProfile = async (profileData) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await apiUpdateConsultantProfile(profileData);
            setConsultantProfile(response.data ?? response);
            setSuccessMessage(response?.message || "Consultant profile updated successfully");
            return response;
        } catch (err) {
            const message = getErrorMessage(err, "Failed to update consultant profile");
            setError(message);
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
        clientProfile,
        consultantProfile,
        loading,
        error,
        successMessage,
        fetchProfile,
        completeClientProfile,
        updateClientProfile,
        completeConsultantProfile,
        updateConsultantProfile,
        clearMessages,
    };

    return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};