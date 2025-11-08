import API from "@/config/ApiConfig";

// ============================================
// THREADS
// ============================================

// List Threads (Public)
export const getThreads = async ({ page = 1, limit = 20, tags, status, sortBy = "newest" } = {}) => {
    try {
        const params = {
            page,
            limit,
            sortBy,
        };

        if (tags && tags.length > 0) {
            params.tags = Array.isArray(tags) ? tags.join(',') : tags;
        }
        if (status) {
            params.status = status;
        }

        const response = await API.get("/forum/threads", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get Single Thread (Public)
export const getThreadById = async (threadId) => {
    try {
        const response = await API.get(`/forum/thread/${threadId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Create Thread (Auth Required)
export const createThread = async (threadData) => {
    try {
        const response = await API.post("/forum/thread", threadData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update Thread (Auth Required - Author or Admin)
export const updateThread = async (threadId, threadData) => {
    try {
        const response = await API.put(`/forum/thread/${threadId}`, threadData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete Thread (Auth Required - Author or Admin)
export const deleteThread = async (threadId) => {
    try {
        const response = await API.delete(`/forum/thread/${threadId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Lock/Unlock Thread (Admin Only)
export const toggleThreadLock = async (threadId) => {
    try {
        const response = await API.post(`/forum/thread/${threadId}/lock`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Pin/Unpin Thread (Admin Only)
export const toggleThreadPin = async (threadId) => {
    try {
        const response = await API.post(`/forum/thread/${threadId}/pin`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ============================================
// COMMENTS
// ============================================

// Create Comment (Auth Required)
export const createComment = async (commentData) => {
    try {
        const response = await API.post("/forum/comment", commentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update Comment (Auth Required - Author or Admin)
export const updateComment = async (commentId, commentData) => {
    try {
        const response = await API.put(`/forum/comment/${commentId}`, commentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete Comment (Auth Required - Author or Admin)
export const deleteComment = async (commentId) => {
    try {
        const response = await API.delete(`/forum/comment/${commentId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ============================================
// VOTING
// ============================================

// Vote on Thread/Comment (Auth Required)
export const vote = async (voteData) => {
    try {
        const response = await API.post("/forum/vote", voteData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ============================================
// REPORTING
// ============================================

// Report Content (Auth Required)
export const reportContent = async (reportData) => {
    try {
        const response = await API.post("/forum/report", reportData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get Reports (Admin Only)
export const getReports = async ({ page = 1, limit = 20, status } = {}) => {
    try {
        const params = { page, limit };
        if (status) {
            params.status = status;
        }
        const response = await API.get("/forum/reports", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ============================================
// ADMIN ACTIONS
// ============================================

// Adjust User Karma (Admin Only)
export const adjustUserKarma = async (karmaData) => {
    try {
        const response = await API.put("/forum/reputation", karmaData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

