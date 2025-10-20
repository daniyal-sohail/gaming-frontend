import API from "@/config/ApiConfig";

// Get User Profile
export const getUserProfile = async () => {
    try {
        const response = await API.get("/users/profile");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update User Profile
export const updateUserProfile = async (profileData) => {
    try {
        const response = await API.put("/users/profile", profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Verify Email Change
export const verifyEmailChange = async (token) => {
    try {
        const response = await API.get(`/users/verify-email-change?token=${token}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};