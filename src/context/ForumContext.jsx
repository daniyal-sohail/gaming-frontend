"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    getThreads as apiGetThreads,
    getThreadById as apiGetThreadById,
    createThread as apiCreateThread,
    updateThread as apiUpdateThread,
    deleteThread as apiDeleteThread,
    toggleThreadLock as apiToggleThreadLock,
    toggleThreadPin as apiToggleThreadPin,
    createComment as apiCreateComment,
    updateComment as apiUpdateComment,
    deleteComment as apiDeleteComment,
    vote as apiVote,
    reportContent as apiReportContent,
    getReports as apiGetReports,
    adjustUserKarma as apiAdjustUserKarma,
} from "@/api/ForumApi";

const ForumContext = createContext(null);

export const useForum = () => {
    const context = useContext(ForumContext);
    if (!context) {
        throw new Error("useForum must be used within a ForumProvider");
    }
    return context;
};

export const ForumProvider = ({ children }) => {
    const { isAuthenticated, user, userType } = useAuth();

    // Threads state
    const [threads, setThreads] = useState([]);
    const [currentThread, setCurrentThread] = useState(null);
    const [threadsPagination, setThreadsPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const [threadsFilters, setThreadsFilters] = useState({
        tags: [],
        status: null,
        sortBy: "newest",
    });

    // Comments state
    const [comments, setComments] = useState([]);

    // Votes cache - track user votes for threads/comments
    const [votesCache, setVotesCache] = useState({});

    // Reports state (admin only)
    const [reports, setReports] = useState([]);
    const [reportsPagination, setReportsPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper to extract error message
    const getErrorMessage = (err) => {
        return err?.message || err?.data?.message || err?.error || "An error occurred";
    };

    // ============================================
    // THREADS
    // ============================================

    const fetchThreads = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);

        try {
            const mergedFilters = { ...threadsFilters, ...filters };
            const response = await apiGetThreads({
                page: mergedFilters.page || threadsPagination.page,
                limit: mergedFilters.limit || threadsPagination.limit,
                tags: mergedFilters.tags,
                status: mergedFilters.status,
                sortBy: mergedFilters.sortBy || "newest",
            });

            const data = response.data || response;
            setThreads(data.threads || []);
            setThreadsPagination({
                page: data.page || 1,
                limit: data.limit || 20,
                total: data.total || 0,
                totalPages: data.totalPages || 0,
            });

            if (filters.tags !== undefined || filters.status !== undefined || filters.sortBy !== undefined) {
                setThreadsFilters(mergedFilters);
            }

            return data;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Fetch threads error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [threadsFilters, threadsPagination]);

    const fetchThreadById = useCallback(async (threadId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiGetThreadById(threadId);
            const thread = response.data || response;
            setCurrentThread(thread);
            setComments(thread.comments || []);
            return thread;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Fetch thread by ID error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewThread = useCallback(async (threadData) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);

        try {
            const response = await apiCreateThread(threadData);
            const thread = response.data || response;
            setThreads((prev) => [thread, ...prev]);
            return thread;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Create thread error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const updateExistingThread = useCallback(async (threadId, threadData) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);

        try {
            const response = await apiUpdateThread(threadId, threadData);
            const updatedThread = response.data || response;
            setThreads((prev) =>
                prev.map((t) => (t._id === threadId ? updatedThread : t))
            );
            if (currentThread?._id === threadId) {
                setCurrentThread(updatedThread);
            }
            return updatedThread;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Update thread error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentThread]);

    const removeThread = useCallback(async (threadId) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);

        try {
            await apiDeleteThread(threadId);
            setThreads((prev) => prev.filter((t) => t._id !== threadId));
            if (currentThread?._id === threadId) {
                setCurrentThread(null);
            }
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Delete thread error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentThread]);

    const lockUnlockThread = useCallback(async (threadId) => {
        if (userType !== "admin") throw new Error("Admin access required");

        setLoading(true);
        setError(null);

        try {
            const response = await apiToggleThreadLock(threadId);
            const updatedThread = response.data || response;
            setThreads((prev) =>
                prev.map((t) => (t._id === threadId ? updatedThread : t))
            );
            if (currentThread?._id === threadId) {
                setCurrentThread(updatedThread);
            }
            return updatedThread;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Toggle thread lock error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userType, currentThread]);

    const pinUnpinThread = useCallback(async (threadId) => {
        if (userType !== "admin") throw new Error("Admin access required");

        setLoading(true);
        setError(null);

        try {
            const response = await apiToggleThreadPin(threadId);
            const updatedThread = response.data || response;
            setThreads((prev) =>
                prev.map((t) => (t._id === threadId ? updatedThread : t))
            );
            if (currentThread?._id === threadId) {
                setCurrentThread(updatedThread);
            }
            return updatedThread;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Toggle thread pin error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userType, currentThread]);

    // ============================================
    // COMMENTS
    // ============================================

    const addComment = useCallback(async (commentData) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);

        try {
            const response = await apiCreateComment(commentData);
            const comment = response.data || response;
            setComments((prev) => [...prev, comment]);
            if (currentThread) {
                setCurrentThread({
                    ...currentThread,
                    commentCount: (currentThread.commentCount || 0) + 1,
                });
            }
            return comment;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Create comment error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentThread]);

    const updateExistingComment = useCallback(async (commentId, commentData) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);

        try {
            const response = await apiUpdateComment(commentId, commentData);
            const updatedComment = response.data || response;
            setComments((prev) =>
                prev.map((c) => (c._id === commentId ? updatedComment : c))
            );
            return updatedComment;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Update comment error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const removeComment = useCallback(async (commentId) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);

        try {
            await apiDeleteComment(commentId);
            setComments((prev) => prev.filter((c) => c._id !== commentId));
            if (currentThread) {
                setCurrentThread({
                    ...currentThread,
                    commentCount: Math.max(0, (currentThread.commentCount || 0) - 1),
                });
            }
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Delete comment error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentThread]);

    // ============================================
    // VOTING
    // ============================================

    const submitVote = useCallback(async (targetId, targetType, voteType) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setError(null);

        try {
            const response = await apiVote({
                targetId,
                targetType,
                type: voteType,
            });

            const { action, vote: voteData } = response.data || response;

            // Update votes cache
            setVotesCache((prev) => ({
                ...prev,
                [targetId]: voteData ? { type: voteData.type } : null,
            }));

            // Optimistically update thread/comment votes
            if (targetType === "thread") {
                setThreads((prev) =>
                    prev.map((t) => {
                        if (t._id === targetId) {
                            const newVotes = { ...t.votes };
                            if (action === "added") {
                                newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] =
                                    (newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] || 0) + 1;
                            } else if (action === "removed") {
                                newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] =
                                    Math.max(0, (newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] || 0) - 1);
                            } else if (action === "changed") {
                                // Remove old vote, add new vote
                                const oldType = voteType === "upvote" ? "downvote" : "upvote";
                                newVotes[oldType === "upvote" ? "upvotes" : "downvotes"] =
                                    Math.max(0, (newVotes[oldType === "upvote" ? "upvotes" : "downvotes"] || 0) - 1);
                                newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] =
                                    (newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] || 0) + 1;
                            }
                            return {
                                ...t,
                                votes: newVotes,
                                netVotes: newVotes.upvotes - newVotes.downvotes,
                            };
                        }
                        return t;
                    })
                );

                if (currentThread?._id === targetId) {
                    setCurrentThread((prev) => {
                        const newVotes = { ...prev.votes };
                        if (action === "added") {
                            newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] =
                                (newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] || 0) + 1;
                        } else if (action === "removed") {
                            newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] =
                                Math.max(0, (newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] || 0) - 1);
                        } else if (action === "changed") {
                            const oldType = voteType === "upvote" ? "downvote" : "upvote";
                            newVotes[oldType === "upvote" ? "upvotes" : "downvotes"] =
                                Math.max(0, (newVotes[oldType === "upvote" ? "upvotes" : "downvotes"] || 0) - 1);
                            newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] =
                                (newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] || 0) + 1;
                        }
                        return {
                            ...prev,
                            votes: newVotes,
                            netVotes: newVotes.upvotes - newVotes.downvotes,
                        };
                    });
                }
            } else if (targetType === "comment") {
                setComments((prev) =>
                    prev.map((c) => {
                        if (c._id === targetId) {
                            const newVotes = { ...c.votes };
                            if (action === "added") {
                                newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] =
                                    (newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] || 0) + 1;
                            } else if (action === "removed") {
                                newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] =
                                    Math.max(0, (newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] || 0) - 1);
                            } else if (action === "changed") {
                                const oldType = voteType === "upvote" ? "downvote" : "upvote";
                                newVotes[oldType === "upvote" ? "upvotes" : "downvotes"] =
                                    Math.max(0, (newVotes[oldType === "upvote" ? "upvotes" : "downvotes"] || 0) - 1);
                                newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] =
                                    (newVotes[voteType === "upvote" ? "upvotes" : "downvotes"] || 0) + 1;
                            }
                            return {
                                ...c,
                                votes: newVotes,
                                netVotes: newVotes.upvotes - newVotes.downvotes,
                            };
                        }
                        return c;
                    })
                );
            }

            return response;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Vote error:", err);
            throw err;
        }
    }, [isAuthenticated, currentThread]);

    // ============================================
    // REPORTING
    // ============================================

    const report = useCallback(async (targetId, targetType, reason) => {
        if (!isAuthenticated) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);

        try {
            const response = await apiReportContent({
                targetId,
                targetType,
                reason,
            });
            return response.data || response;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Report content error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // ============================================
    // ADMIN ACTIONS
    // ============================================

    const fetchReports = useCallback(async (filters = {}) => {
        if (userType !== "admin") throw new Error("Admin access required");

        setLoading(true);
        setError(null);

        try {
            const response = await apiGetReports({
                page: filters.page || reportsPagination.page,
                limit: filters.limit || reportsPagination.limit,
                status: filters.status,
            });

            const data = response.data || response;
            setReports(data.reports || []);
            setReportsPagination({
                page: data.page || 1,
                limit: data.limit || 20,
                total: data.total || 0,
                totalPages: data.totalPages || 0,
            });

            return data;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Fetch reports error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userType, reportsPagination]);

    const adjustKarma = useCallback(async (userId, karmaChange, reason) => {
        if (userType !== "admin") throw new Error("Admin access required");

        setLoading(true);
        setError(null);

        try {
            const response = await apiAdjustUserKarma({
                userId,
                karmaChange,
                reason,
            });
            return response.data || response;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error("Adjust karma error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userType]);

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearCurrentThread = useCallback(() => {
        setCurrentThread(null);
        setComments([]);
    }, []);

    const getUserVote = useCallback((targetId) => {
        return votesCache[targetId] || null;
    }, [votesCache]);

    const isAdmin = userType === "admin";
    const isAuthor = useCallback((authorId) => {
        return isAuthenticated && user?._id === authorId;
    }, [isAuthenticated, user]);

    const value = {
        // State
        threads,
        currentThread,
        comments,
        threadsPagination,
        threadsFilters,
        votesCache,
        reports,
        reportsPagination,
        loading,
        error,

        // Threads
        fetchThreads,
        fetchThreadById,
        createThread: createNewThread,
        updateThread: updateExistingThread,
        deleteThread: removeThread,
        lockThread: lockUnlockThread,
        pinThread: pinUnpinThread,

        // Comments
        createComment: addComment,
        updateComment: updateExistingComment,
        deleteComment: removeComment,

        // Voting
        vote: submitVote,
        getUserVote,

        // Reporting
        report,

        // Admin
        fetchReports,
        adjustKarma,
        isAdmin,

        // Utilities
        isAuthor,
        clearError,
        clearCurrentThread,
        setThreadsFilters,
    };

    return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
};

