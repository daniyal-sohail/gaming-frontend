"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    MessageSquare,
    ArrowUp,
    ArrowDown,
    Pin,
    Lock,
    Plus,
    Search,
    Filter,
    Loader2,
    AlertCircle,
    Tag,
    User,
    Calendar,
} from "lucide-react";
import { useForum } from "@/context/ForumContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import CommentSection from "./CommentSection";

export default function ThreadList() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { success, error: showError } = useToast();
    const {
        threads,
        threadsPagination,
        threadsFilters,
        loading,
        error,
        fetchThreads,
        setThreadsFilters,
        fetchThreadById,
    } = useForum();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [expandedThreadId, setExpandedThreadId] = useState(null);

    useEffect(() => {
        fetchThreads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...threadsFilters, [key]: value };
        setThreadsFilters(newFilters);
        fetchThreads(newFilters);
    };

    const handlePageChange = (newPage) => {
        fetchThreads({ page: newPage });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    const filteredThreads = threads.filter((thread) => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                thread.title.toLowerCase().includes(searchLower) ||
                thread.content.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    // Separate pinned threads
    const pinnedThreads = filteredThreads.filter((t) => t.isPinned);
    const regularThreads = filteredThreads.filter((t) => !t.isPinned);

    return (
        <div className="min-h-screen bg-gray-50 py-4 mt-24">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="sticky top-24 z-10 bg-white border-b border-gray-200 px-4 py-3 mb-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-black">Forum</h1>
                        {isAuthenticated && (
                            <button
                                onClick={() => router.push("/forum/create")}
                                className="px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-all font-medium flex items-center gap-2 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                New Thread
                            </button>
                        )}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="px-4 mb-4 space-y-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search threads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-colors text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={threadsFilters.sortBy || "newest"}
                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-100 border-0 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-colors text-sm"
                        >
                            <option value="newest">Newest</option>
                            <option value="popular">Most Popular</option>
                            <option value="trending">Trending</option>
                        </select>
                        <select
                            value={threadsFilters.status || ""}
                            onChange={(e) => handleFilterChange("status", e.target.value || null)}
                            className="flex-1 px-3 py-2 bg-gray-100 border-0 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-colors text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="open">Open</option>
                            <option value="locked">Locked</option>
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-4 mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-500 font-medium text-sm">Error Loading Threads</p>
                            <p className="text-red-600/80 text-xs">{error}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && threads.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && threads.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="text-center py-16 px-4">
                            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-black mb-2">No Threads Yet</h3>
                            <p className="text-gray-600 mb-6 text-sm">Be the first to start a discussion!</p>
                            {isAuthenticated && (
                                <button
                                    onClick={() => router.push("/forum/create")}
                                    className="px-6 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-all text-sm font-medium"
                                >
                                    Create First Thread
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Threads List */}
                {threads.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        {/* Pinned Threads */}
                        {pinnedThreads.length > 0 && (
                            <div className="border-b border-gray-200">
                                {pinnedThreads.map((thread) => (
                                    <ThreadCard
                                        key={thread._id}
                                        thread={thread}
                                        formatTimeAgo={formatTimeAgo}
                                        isExpanded={expandedThreadId === thread._id}
                                        onExpand={() => {
                                            if (expandedThreadId === thread._id) {
                                                setExpandedThreadId(null);
                                            } else {
                                                setExpandedThreadId(thread._id);
                                                fetchThreadById(thread._id);
                                            }
                                        }}
                                        onViewFull={() => router.push(`/forum/thread/${thread._id}`)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Regular Threads */}
                        {regularThreads.length > 0 && (
                            <div>
                                {regularThreads.map((thread) => (
                                    <ThreadCard
                                        key={thread._id}
                                        thread={thread}
                                        formatTimeAgo={formatTimeAgo}
                                        isExpanded={expandedThreadId === thread._id}
                                        onExpand={() => {
                                            if (expandedThreadId === thread._id) {
                                                setExpandedThreadId(null);
                                            } else {
                                                setExpandedThreadId(thread._id);
                                                fetchThreadById(thread._id);
                                            }
                                        }}
                                        onViewFull={() => router.push(`/forum/thread/${thread._id}`)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {threadsPagination.totalPages > 1 && (
                            <div className="px-4 py-4 border-t border-gray-200 bg-white">
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => handlePageChange(threadsPagination.page - 1)}
                                        disabled={threadsPagination.page === 1}
                                        className="px-4 py-2 bg-gray-100 rounded-full text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-gray-600 text-sm">
                                        Page {threadsPagination.page} of {threadsPagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(threadsPagination.page + 1)}
                                        disabled={threadsPagination.page >= threadsPagination.totalPages}
                                        className="px-4 py-2 bg-gray-100 rounded-full text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ThreadCard({ thread, formatTimeAgo, isExpanded, onExpand, onViewFull }) {
    const { user } = useAuth();
    const { getUserVote, vote } = useForum();
    const { error: showError } = useToast();

    const userVote = getUserVote(thread._id);
    const netVotes = thread.netVotes || (thread.votes?.upvotes || 0) - (thread.votes?.downvotes || 0);

    const handleVote = async (voteType, e) => {
        e.stopPropagation();
        if (!user) {
            showError("Please login to vote");
            return;
        }
        if (thread.authorId?._id === user._id) {
            showError("You cannot vote on your own content");
            return;
        }

        try {
            await vote(thread._id, "thread", voteType);
        } catch (err) {
            showError(err?.message || "Failed to vote");
        }
    };

    const getInitials = (name) => {
        if (!name) return "A";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const authorName = thread.authorId?.name || "Anonymous";
    const authorInitials = getInitials(authorName);

    return (
        <article className="border-b border-gray-200">
            <div
                className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={onExpand}
            >
                <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm">
                            {authorInitials}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-black hover:underline">
                                {authorName}
                            </span>
                            {thread.authorId?.karma !== undefined && (
                                <span className="text-gray-500 text-sm">
                                    · {thread.authorId.karma} karma
                                </span>
                            )}
                            <span className="text-gray-500 text-sm">
                                · {formatTimeAgo(thread.createdAt)}
                            </span>
                            {thread.isPinned && (
                                <Pin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                            )}
                            {thread.status === "locked" && (
                                <Lock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-black mb-1">
                            {thread.title}
                        </h3>

                        {/* Content */}
                        <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                            {thread.content}
                        </p>

                        {/* Tags */}
                        {thread.tags && thread.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {thread.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-cyan-500/10 text-cyan-600 text-xs rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-8 mt-3 text-gray-500">
                            {/* Comment */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onExpand();
                                }}
                                className="flex items-center gap-2 hover:text-cyan-500 transition-colors group"
                            >
                                <div className={`p-2 rounded-full transition-colors ${isExpanded ? "bg-cyan-500/20 text-cyan-500" : "group-hover:bg-cyan-500/10"
                                    }`}>
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <span className="text-sm">{thread.commentCount || 0}</span>
                            </button>

                            {/* Upvote */}
                            <button
                                onClick={(e) => handleVote("upvote", e)}
                                disabled={thread.authorId?._id === user?._id}
                                className={`flex items-center gap-2 transition-colors group ${userVote?.type === "upvote"
                                    ? "text-green-500"
                                    : "hover:text-green-500"
                                    } ${thread.authorId?._id === user?._id ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <div className={`p-2 rounded-full transition-colors ${userVote?.type === "upvote"
                                    ? "bg-green-500/20"
                                    : "group-hover:bg-green-500/10"
                                    }`}>
                                    <ArrowUp className="w-4 h-4" />
                                </div>
                                <span className={`text-sm ${netVotes >= 0 ? "text-green-500" : "text-gray-500"}`}>
                                    {netVotes > 0 ? `+${netVotes}` : netVotes}
                                </span>
                            </button>

                            {/* Downvote */}
                            <button
                                onClick={(e) => handleVote("downvote", e)}
                                disabled={thread.authorId?._id === user?._id}
                                className={`flex items-center gap-2 transition-colors group ${userVote?.type === "downvote"
                                    ? "text-red-500"
                                    : "hover:text-red-500"
                                    } ${thread.authorId?._id === user?._id ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <div className={`p-2 rounded-full transition-colors ${userVote?.type === "downvote"
                                    ? "bg-red-500/20"
                                    : "group-hover:bg-red-500/10"
                                    }`}>
                                    <ArrowDown className="w-4 h-4" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Comments Section */}
            {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50" onClick={(e) => e.stopPropagation()}>
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-700">Comments</h4>
                            <button
                                onClick={onViewFull}
                                className="text-xs text-cyan-500 hover:text-cyan-600 hover:underline"
                            >
                                View full thread →
                            </button>
                        </div>
                        <CommentSection threadId={thread._id} isLocked={thread.status === "locked"} compact />
                    </div>
                </div>
            )}
        </article>
    );
}

