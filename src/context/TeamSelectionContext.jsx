"use client";

import { createContext, useContext, useState, useCallback } from "react";
import {
    createTeam,
    getClientTeams,
    getTeamById,
    updateTeam,
    deleteTeam,
    addMemberToTeam,
    addMultipleMembersToTeam,
    removeMemberFromTeam,
    updateTeamMember,
    getRecommendedConsultants,
    calculateTeamPricing,
    calculateLivePricing,
    generateTeamShareLink,
    getSharedTeam
} from "@/api/teamSelectionApi";
import { useToast } from "./ToastContext";

const TeamSelectionContext = createContext(null);

export const useTeamSelection = () => {
    const context = useContext(TeamSelectionContext);
    if (!context) {
        throw new Error("useTeamSelection must be used within TeamSelectionProvider");
    }
    return context;
};

export const TeamSelectionProvider = ({ children }) => {
    const toast = useToast();

    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [pricing, setPricing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // ============================================
    // TEAM MANAGEMENT
    // ============================================

    const handleCreateTeam = useCallback(async (teamData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createTeam(teamData);
            setTeams(prev => [response.data, ...prev]);
            toast.success(response.message || "Team created successfully");
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to create team";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleGetTeams = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getClientTeams(params);
            setTeams(response.data.teams || []);
            setPagination({
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.total,
                totalPages: response.data.totalPages
            });
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch teams";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleGetTeamById = useCallback(async (teamId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getTeamById(teamId);
            setCurrentTeam(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch team";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleUpdateTeam = useCallback(async (teamId, updateData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateTeam(teamId, updateData);
            setCurrentTeam(response.data);
            setTeams(prev =>
                prev.map(team => team._id === teamId ? response.data : team)
            );
            toast.success(response.message || "Team updated successfully");
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to update team";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleDeleteTeam = useCallback(async (teamId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deleteTeam(teamId);
            setTeams(prev => prev.filter(team => team._id !== teamId));
            if (currentTeam?._id === teamId) {
                setCurrentTeam(null);
            }
            toast.success(response.message || "Team deleted successfully");
            return response;
        } catch (err) {
            const errorMessage = err.message || "Failed to delete team";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentTeam, toast]);

    // ============================================
    // TEAM MEMBERS MANAGEMENT
    // ============================================

    const handleAddMember = useCallback(async (teamId, memberData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await addMemberToTeam(teamId, memberData);
            setCurrentTeam(response.data);
            setTeams(prev =>
                prev.map(team => team._id === teamId ? response.data : team)
            );
            toast.success(response.message || "Member added successfully");
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to add member";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleAddMultipleMembers = useCallback(async (teamId, membersData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await addMultipleMembersToTeam(teamId, membersData);
            setCurrentTeam(response.data);
            setTeams(prev =>
                prev.map(team => team._id === teamId ? response.data : team)
            );
            toast.success(response.message || "Members added successfully");
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to add members";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleRemoveMember = useCallback(async (teamId, consultantId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await removeMemberFromTeam(teamId, consultantId);
            setCurrentTeam(response.data);
            setTeams(prev =>
                prev.map(team => team._id === teamId ? response.data : team)
            );
            toast.success(response.message || "Member removed successfully");
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to remove member";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleUpdateMember = useCallback(async (teamId, consultantId, updateData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateTeamMember(teamId, consultantId, updateData);
            setCurrentTeam(response.data);
            setTeams(prev =>
                prev.map(team => team._id === teamId ? response.data : team)
            );
            toast.success(response.message || "Member updated successfully");
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to update member";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // ============================================
    // RECOMMENDATIONS & PRICING
    // ============================================

    const handleGetRecommendations = useCallback(async (teamId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getRecommendedConsultants(teamId);
            setRecommendations(response.data || []);
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch recommendations";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleCalculatePricing = useCallback(async (teamId, pricingData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await calculateTeamPricing(teamId, pricingData);
            setPricing(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to calculate pricing";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleCalculateLivePricing = useCallback(async (pricingData) => {
        setError(null);
        try {
            const response = await calculateLivePricing(pricingData);
            setPricing(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to calculate live pricing";
            setError(errorMessage);
            throw err;
        }
    }, []);

    // ============================================
    // SHARE FUNCTIONALITY
    // ============================================

    const handleGenerateShareLink = useCallback(async (teamId, expiresInDays) => {
        setLoading(true);
        setError(null);
        try {
            const response = await generateTeamShareLink(teamId, expiresInDays);
            toast.success(response.message || "Share link generated successfully");
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to generate share link";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleGetSharedTeam = useCallback(async (shareLinkId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSharedTeam(shareLinkId);
            setCurrentTeam(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch shared team";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    const clearCurrentTeam = useCallback(() => {
        setCurrentTeam(null);
        setPricing(null);
        setRecommendations([]);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = {
        // State
        teams,
        currentTeam,
        recommendations,
        pricing,
        loading,
        error,
        pagination,

        // Team Management
        createTeam: handleCreateTeam,
        getTeams: handleGetTeams,
        getTeamById: handleGetTeamById,
        updateTeam: handleUpdateTeam,
        deleteTeam: handleDeleteTeam,

        // Member Management
        addMember: handleAddMember,
        addMultipleMembers: handleAddMultipleMembers,
        removeMember: handleRemoveMember,
        updateMember: handleUpdateMember,

        // Recommendations & Pricing
        getRecommendations: handleGetRecommendations,
        calculatePricing: handleCalculatePricing,
        calculateLivePricing: handleCalculateLivePricing,

        // Share Functionality
        generateShareLink: handleGenerateShareLink,
        getSharedTeam: handleGetSharedTeam,

        // Utilities
        clearCurrentTeam,
        clearError
    };

    return (
        <TeamSelectionContext.Provider value={value}>
            {children}
        </TeamSelectionContext.Provider>
    );
};