"use client";
import { createContext, useContext, useState } from "react";
import {
    getAllConsultants,
    searchConsultants,
    getFeaturedConsultants,
    getConsultantsBySkills,
    getConsultantsByExperience,
    getConsultantDetails
} from "@/api/ConsultantApi";

const ConsultantContext = createContext(null);

export const useConsultant = () => {
    const context = useContext(ConsultantContext);
    if (!context) {
        throw new Error("useConsultant must be used within a ClientProvider");
    }
    return context;
};

export const ConsultantProvider = ({ children }) => {
    const [consultants, setConsultants] = useState([]);
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all consultants with pagination
    const fetchAllConsultants = async ({ page = 1, limit = 20, sort = "-createdAt" } = {}) => {
        try {
            setError(null);
            setLoading(true);

            const response = await getAllConsultants({ page, limit, sort });

            setConsultants(response.data.consultants);
            setPagination({
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.total,
                totalPages: response.data.totalPages
            });

            return response;
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch consultants";
            setError(errorMessage);
            console.error("Fetch consultants error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Search consultants with filters
    const searchConsultantsWithFilters = async (filters = {}, options = {}) => {
        try {
            setError(null);
            setLoading(true);

            const { page = 1, limit = 10, sort = "-createdAt" } = options;

            const response = await searchConsultants(filters, { page, limit, sort });

            setConsultants(response.data.consultants);
            setPagination({
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.total,
                totalPages: response.data.totalPages
            });

            return response;
        } catch (err) {
            const errorMessage = err.message || "Failed to search consultants";
            setError(errorMessage);
            console.error("Search consultants error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Fetch featured consultants
    const fetchFeaturedConsultants = async (limit = 10) => {
        try {
            setError(null);
            setLoading(true);

            const response = await getFeaturedConsultants(limit);

            setConsultants(response.data);

            return response;
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch featured consultants";
            setError(errorMessage);
            console.error("Fetch featured consultants error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Fetch consultants by skills
    const fetchConsultantsBySkills = async (skills, limit = 20) => {
        try {
            setError(null);
            setLoading(true);

            const response = await getConsultantsBySkills(skills, limit);

            setConsultants(response.data);

            return response;
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch consultants by skills";
            setError(errorMessage);
            console.error("Fetch consultants by skills error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Fetch consultants by experience
    const fetchConsultantsByExperience = async (minExperience, limit = 20) => {
        try {
            setError(null);
            setLoading(true);

            const response = await getConsultantsByExperience(minExperience, limit);

            setConsultants(response.data);

            return response;
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch consultants by experience";
            setError(errorMessage);
            console.error("Fetch consultants by experience error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Fetch single consultant details
    const fetchConsultantDetails = async (consultantId) => {
        try {
            setError(null);
            setLoading(true);

            const response = await getConsultantDetails(consultantId);

            setSelectedConsultant(response.data);

            return response;
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch consultant details";
            setError(errorMessage);
            console.error("Fetch consultant details error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Clear selected consultant
    const clearSelectedConsultant = () => {
        setSelectedConsultant(null);
    };

    // Clear consultants list
    const clearConsultants = () => {
        setConsultants([]);
        setPagination({
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
        });
    };

    // Clear error
    const clearError = () => {
        setError(null);
    };

    const value = {
        // State
        consultants,
        selectedConsultant,
        pagination,
        loading,
        error,

        // Methods
        fetchAllConsultants,
        searchConsultantsWithFilters,
        fetchFeaturedConsultants,
        fetchConsultantsBySkills,
        fetchConsultantsByExperience,
        fetchConsultantDetails,
        clearSelectedConsultant,
        clearConsultants,
        clearError,
    };

    return <ConsultantContext.Provider value={value}>{children}</ConsultantContext.Provider>;
};