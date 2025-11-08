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
    } = useForum();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

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
        <div className="min-h-screen bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8 mt-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Forum</h1>
                            <p className="text-gray-400">Discuss, share, and learn from the community</p>
                        </div>
                        {isAuthenticated && (
                            <button
                                onClick={() => router.push("/forum/create")}
                                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all hover:scale-105 font-medium flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Create Thread
                            </button>
                        )}
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search threads..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <select
                            value={threadsFilters.sortBy || "newest"}
                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                            className="px-4 py-3 bg-[#121212] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="newest">Newest</option>
                            <option value="popular">Most Popular</option>
                            <option value="trending">Trending</option>
                        </select>
                        <select
                            value={threadsFilters.status || ""}
                            onChange={(e) => handleFilterChange("status", e.target.value || null)}
                            className="px-4 py-3 bg-[#121212] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="">All Status</option>
                            <option value="open">Open</option>
                            <option value="locked">Locked</option>
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-400 font-medium">Error Loading Threads</p>
                            <p className="text-red-400/80 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && threads.length === 0 && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && threads.length === 0 && (
                    <div className="text-center py-16">
                        <MessageSquare className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Threads Yet</h3>
                        <p className="text-gray-400 mb-6">Be the first to start a discussion!</p>
                        {isAuthenticated && (
                            <button
                                onClick={() => router.push("/forum/create")}
                                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all"
                            >
                                Create First Thread
                            </button>
                        )}
                    </div>
                )}

                {/* Threads List */}
                {threads.length > 0 && (
                    <div className="space-y-4">
                        {/* Pinned Threads */}
                        {pinnedThreads.length > 0 && (
                            <div className="space-y-4 mb-8">
                                {pinnedThreads.map((thread) => (
                                    <ThreadCard key={thread._id} thread={thread} formatTimeAgo={formatTimeAgo} />
                                ))}
                            </div>
                        )}

                        {/* Regular Threads */}
                        {regularThreads.length > 0 && (
                            <div className="space-y-4">
                                {regularThreads.map((thread) => (
                                    <ThreadCard key={thread._id} thread={thread} formatTimeAgo={formatTimeAgo} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {threadsPagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(threadsPagination.page - 1)}
                                    disabled={threadsPagination.page === 1}
                                    className="px-4 py-2 bg-[#121212] border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-400">
                                    Page {threadsPagination.page} of {threadsPagination.totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(threadsPagination.page + 1)}
                                    disabled={threadsPagination.page >= threadsPagination.totalPages}
                                    className="px-4 py-2 bg-[#121212] border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ThreadCard({ thread, formatTimeAgo }) {
    const router = useRouter();
    const { user } = useAuth();
    const { getUserVote, vote } = useForum();
    const { success, error: showError } = useToast();

    const userVote = getUserVote(thread._id);
    const netVotes = thread.netVotes || (thread.votes?.upvotes || 0) - (thread.votes?.downvotes || 0);

    const handleVote = async (voteType) => {
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

    return (
        <div
            className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => router.push(`/forum/thread/${thread._id}`)}
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Voting Section */}
                    <div className="flex flex-col items-center gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleVote("upvote");
                            }}
                            disabled={thread.authorId?._id === user?._id}
                            className={`p-2 rounded-lg transition-all ${
                                userVote?.type === "upvote"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-[#0d0d0d] text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                            } ${thread.authorId?._id === user?._id ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <ArrowUp className="w-5 h-5" />
                        </button>
                        <span className={`text-sm font-bold ${netVotes >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {netVotes}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleVote("downvote");
                            }}
                            disabled={thread.authorId?._id === user?._id}
                            className={`p-2 rounded-lg transition-all ${
                                userVote?.type === "downvote"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-[#0d0d0d] text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                            } ${thread.authorId?._id === user?._id ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <ArrowDown className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    {thread.isPinned && (
                                        <Pin className="w-4 h-4 text-primary" />
                                    )}
                                    {thread.status === "locked" && (
                                        <Lock className="w-4 h-4 text-yellow-400" />
                                    )}
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                        {thread.title}
                                    </h3>
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                    {thread.content}
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        {thread.tags && thread.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {thread.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-lg border border-primary/20"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span className="text-white">{thread.authorId?.name || "Anonymous"}</span>
                                {thread.authorId?.karma !== undefined && (
                                    <span className="text-primary">({thread.authorId.karma} karma)</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{thread.commentCount || 0} comments</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatTimeAgo(thread.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

