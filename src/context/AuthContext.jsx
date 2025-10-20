"use client";
// must be a client component because it uses React context/hooks
import { createContext, useContext, useState, useEffect } from "react";
import {
    loginUser,
    registerUser,
    loginWithGoogle,
    registerWithGoogle,
    logoutUser,
    refreshToken,
} from "@/api/AuthApi";
import { setClearSession } from "@/config/ApiConfig";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set the clearSession reference for API config
    useEffect(() => {
        setClearSession(() => {
            setUser(null);
            localStorage.removeItem("user");
        });
    }, []);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    // Small delay to ensure loading state is visible
                    setTimeout(() => {
                        setLoading(false);
                    }, 50);

                    // Try to refresh token in background (don't await)
                    refreshToken()
                        .then(() => console.log("Token refreshed successfully"))
                        .catch(err => console.warn("Token refresh failed, but keeping user logged in:", err));
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error("Auth initialization error:", err);
                localStorage.removeItem("user");
                setUser(null);
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Register
    const register = async (userData) => {
        try {
            setError(null);
            setLoading(true);

            const response = await registerUser(userData);
            const user = response.data.user;

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));

            return response;
        } catch (err) {
            const errorMessage = err.message || "Registration failed";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Login
    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);

            const response = await loginUser(credentials);
            const user = response.data.user;

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));

            return response;
        } catch (err) {
            const errorMessage = err.message || "Login failed";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Google Register
    const googleRegister = async (idToken, userType) => {
        try {
            setError(null);
            setLoading(true);

            const response = await registerWithGoogle(idToken, userType);
            const user = response.data.user;

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));

            return response;
        } catch (err) {
            const errorMessage = err.message || "Google registration failed";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Google Login
    const googleLogin = async (idToken) => {
        try {
            setError(null);
            setLoading(true);

            const response = await loginWithGoogle(idToken);
            const user = response.data.user;

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));

            return response;
        } catch (err) {
            const errorMessage = err.message || "Google login failed";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        try {
            setError(null);
            await logoutUser();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
        }
    };


    const value = {
        user,
        loading,
        error,
        register,
        login,
        googleRegister,
        googleLogin,
        logout,
        isAuthenticated: !!user,
        isVerified: user?.isVerified || false,
        userType: user?.user_type || null,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};