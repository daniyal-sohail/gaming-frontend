"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    getMyTeamAssignments as apiGetMyTeamAssignments,
    getTeamById as apiGetTeamById
} from "@/api/ConsultantTeam";

const ConsultantTeamContext = createContext(null);

export const useConsultantTeam = () => {
    const context = useContext(ConsultantTeamContext);
    if (!context) {
        throw new Error("useConsultantTeam must be used within a ConsultantTeamProvider");
    }
    return context;
};

export const ConsultantTeamProvider = ({ children }) => {
    const { isAuthenticated, userType } = useAuth();

    const [teamAssignments, setTeamAssignments] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper to extract error message
    const getErrorMessage = (err) => {
        return err?.message || err?.data?.message || err?.error || "An error occurred";
    };

    // Clear data when user logs out or user type changes
    useEffect(() => {
        if (!isAuthenticated || userType !== "consultant") {
            setTeamAssignments([]);
            setCurrentTeam(null);
            setError(null);
        }
    }, [isAuthenticated, userType]);

    // ============================================
    // GET MY TEAM ASSIGNMENTS
    // ============================================
    const fetchMyTeamAssignments = useCallback(async () => {
        if (!isAuthenticated || userType !== "consultant") {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await apiGetMyTeamAssignments();
            const assignments = response.data || response;
            setTeamAssignments(Array.isArray(assignments) ? assignments : []);
            return assignments;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Fetch team assignments error:", err);
            // Don't throw for 404 - consultant might not have any assignments yet
            if (err?.statusCode !== 404 && err?.status !== 404) {
                throw err;
            }
            return [];
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, userType]);

    // ============================================
    // GET TEAM BY ID
    // ============================================
    const fetchTeamById = useCallback(async (teamId) => {
        if (!isAuthenticated || userType !== "consultant") {
            throw new Error("User not authenticated or not a consultant");
        }

        if (!teamId) {
            throw new Error("Team ID is required");
        }

        setLoading(true);
        setError(null);

        try {
            const response = await apiGetTeamById(teamId);
            const team = response.data || response;
            setCurrentTeam(team);
            return team;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Fetch team by ID error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, userType]);

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const clearCurrentTeam = useCallback(() => {
        setCurrentTeam(null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refreshAssignments = useCallback(async () => {
        return await fetchMyTeamAssignments();
    }, [fetchMyTeamAssignments]);

    const value = {
        // State
        teamAssignments,
        currentTeam,
        loading,
        error,

        // Actions
        fetchMyTeamAssignments,
        fetchTeamById,
        refreshAssignments,
        clearCurrentTeam,
        clearError,
    };

    return (
        <ConsultantTeamContext.Provider value={value}>
            {children}
        </ConsultantTeamContext.Provider>
    );
};

