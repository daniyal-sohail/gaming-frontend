import API from "@/config/ApiConfig";

// Helper function to clean data
const cleanData = (data) => {
    const cleaned = {};

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
                if (value.length > 0) cleaned[key] = value;
            } else if (typeof value === "object" && !(value instanceof Date)) {
                const cleanedObject = Object.entries(value).reduce((acc, [k, v]) => {
                    if (v !== "" && v !== null && v !== undefined) acc[k] = v;
                    return acc;
                }, {});
                if (Object.keys(cleanedObject).length > 0) cleaned[key] = cleanedObject;
            } else {
                cleaned[key] = value;
            }
        }
    });

    return cleaned;
};

// ----------------- CLIENT -----------------

export const getClientProfile = async () => {
    try {
        const response = await API.get("/onboarding/client/profile");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const completeClientProfile = async (profileData) => {
    try {
        const response = await API.post("/onboarding/client/profile", cleanData(profileData));
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateClientProfile = async (profileData) => {
    try {
        const response = await API.put("/onboarding/client/profile", cleanData(profileData));
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ----------------- CONSULTANT -----------------

export const getConsultantProfile = async () => {
    try {
        const response = await API.get("/onboarding/consultant/profile");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const completeConsultantProfile = async (profileData) => {
    try {
        const response = await API.post("/onboarding/consultant/profile", cleanData(profileData));
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateConsultantProfile = async (profileData) => {
    try {
        const response = await API.put("/onboarding/consultant/profile", cleanData(profileData));
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};