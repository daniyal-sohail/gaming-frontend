import API from "@/config/ApiConfig";

// Get All Consultants with pagination
export const getAllConsultants = async ({ page = 1, limit = 20, sort = "-createdAt" } = {}) => {
    try {
        const response = await API.get("/client/consultants", {
            params: { page, limit, sort }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Search Consultants with filters
export const searchConsultants = async (filters = {}, { page = 1, limit = 10, sort = "-createdAt" } = {}) => {
    try {
        const { skills, minExperience, preferredTimezone, remote, maxHourlyRate } = filters;

        const params = {
            page,
            limit,
            sort
        };

        // Add optional filters
        if (skills && skills.length > 0) {
            params.skills = Array.isArray(skills) ? skills.join(',') : skills;
        }
        if (minExperience !== undefined) {
            params.minExperience = minExperience;
        }
        if (preferredTimezone) {
            params.preferredTimezone = preferredTimezone;
        }
        if (remote !== undefined) {
            params.remote = remote;
        }
        if (maxHourlyRate !== undefined) {
            params.maxHourlyRate = maxHourlyRate;
        }

        const response = await API.get("/client/consultants/search", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get Featured Consultants
export const getFeaturedConsultants = async (limit = 10) => {
    try {
        const response = await API.get("/client/consultants/featured", {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get Consultants by Skills
export const getConsultantsBySkills = async (skills, limit = 20) => {
    try {
        const skillsParam = Array.isArray(skills) ? skills.join(',') : skills;
        const response = await API.get("/client/consultants/skills", {
            params: { skills: skillsParam, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get Consultants by Experience
export const getConsultantsByExperience = async (minExperience, limit = 20) => {
    try {
        const response = await API.get("/client/consultants/experience", {
            params: { minExperience, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get Consultant Details
export const getConsultantDetails = async (consultantId) => {
    try {
        const response = await API.get(`/client/consultants/${consultantId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};