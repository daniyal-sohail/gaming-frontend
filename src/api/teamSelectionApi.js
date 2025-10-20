import API from "@/config/ApiConfig";

// ============================================
// TEAM MANAGEMENT
// ============================================

export const createTeam = async (teamData) => {
    try {
        const response = await API.post("/teams", teamData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getClientTeams = async (params = {}) => {
    try {
        const { page = 1, limit = 10, status } = params;
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...(status && { status })
        });
        const response = await API.get(`/teams?${queryParams}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getTeamById = async (teamId) => {
    try {
        const response = await API.get(`/teams/${teamId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateTeam = async (teamId, updateData) => {
    try {
        const response = await API.put(`/teams/${teamId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteTeam = async (teamId) => {
    try {
        const response = await API.delete(`/teams/${teamId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ============================================
// TEAM MEMBERS MANAGEMENT
// ============================================

export const addMemberToTeam = async (teamId, memberData) => {
    try {
        const response = await API.post(`/teams/${teamId}/members`, memberData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const addMultipleMembersToTeam = async (teamId, membersData) => {
    try {
        const response = await API.post(`/teams/${teamId}/members/bulk`, {
            members: membersData
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const removeMemberFromTeam = async (teamId, consultantId) => {
    try {
        const response = await API.delete(`/teams/${teamId}/members/${consultantId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateTeamMember = async (teamId, consultantId, updateData) => {
    try {
        const response = await API.put(
            `/teams/${teamId}/members/${consultantId}`,
            updateData
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ============================================
// RECOMMENDATIONS & PRICING
// ============================================

export const getRecommendedConsultants = async (teamId) => {
    try {
        const response = await API.get(`/teams/${teamId}/recommendations`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const calculateTeamPricing = async (teamId, pricingData = {}) => {
    try {
        const response = await API.post(`/teams/${teamId}/pricing`, pricingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const calculateLivePricing = async (pricingData) => {
    try {
        const response = await API.post("/teams/pricing/calculate", pricingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ============================================
// SHARE FUNCTIONALITY
// ============================================

export const generateTeamShareLink = async (teamId, expiresInDays = 30) => {
    try {
        const response = await API.post(`/teams/${teamId}/share`, {
            expiresInDays
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getSharedTeam = async (shareLinkId) => {
    try {
        const response = await API.get(`/teams/shared/${shareLinkId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};