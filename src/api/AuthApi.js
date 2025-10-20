import API from "@/config/ApiConfig";

// Regular Registration
export const registerUser = async (userData) => {
    try {
        const response = await API.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Regular Login
export const loginUser = async (credentials) => {
    try {
        const response = await API.post("/auth/login", credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Google Registration
export const registerWithGoogle = async (idToken, user_type) => {
    try {
        const response = await API.post("/auth/register/google", {
            idToken,
            user_type,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Google Login
export const loginWithGoogle = async (idToken) => {
    try {
        const response = await API.post("/auth/login/google", { idToken });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Refresh Token
export const refreshToken = async () => {
    try {
        const response = await API.post("/auth/refresh-token");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Logout
export const logoutUser = async () => {
    try {
        const response = await API.post("/auth/logout");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Verify Email (optional - usually accessed via email link)
export const verifyEmail = async (token) => {
    try {
        const response = await API.get(`/auth/verify-email?token=${token}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};