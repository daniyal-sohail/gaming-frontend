"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Edit,
    Trash2,
    Pin,
    Lock,
    Flag,
    MessageSquare,
    User,
    Calendar,
    Tag,
    Loader2,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import { useForum } from "@/context/ForumContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import VotingButtons from "./VotingButtons";
import CommentSection from "./CommentSection";

export default function ThreadDetail() {
    const params = useParams();
    const router = useRouter();
    const { user, userType } = useAuth();
    const { success, error: showError } = useToast();
    const {
        currentThread,
        loading,
        error,
        fetchThreadById,
        deleteThread,
        lockThread,
        pinThread,
        report,
        isAdmin,
        isAuthor,
        clearCurrentThread,
    } = useForum();

    const threadId = params.threadId;
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");

    useEffect(() => {
        if (threadId) {
            fetchThreadById(threadId);
        }
        return () => {
            clearCurrentThread();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadId]);

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

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this thread?")) return;

        try {
            await deleteThread(threadId);
            success("Thread deleted successfully");
            router.push("/forum");
        } catch (err) {
            showError(err?.message || "Failed to delete thread");
        }
    };

    const handleLock = async () => {
        try {
            await lockThread(threadId);
            success(`Thread ${currentThread.status === "locked" ? "unlocked" : "locked"} successfully`);
        } catch (err) {
            showError(err?.message || "Failed to update thread status");
        }
    };

    const handlePin = async () => {
        try {
            await pinThread(threadId);
            success(`Thread ${currentThread.isPinned ? "unpinned" : "pinned"} successfully`);
        } catch (err) {
            showError(err?.message || "Failed to update thread pin status");
        }
    };

    const handleReport = async () => {
        if (!reportReason.trim() || reportReason.length < 10) {
            showError("Please provide a reason (at least 10 characters)");
            return;
        }

        try {
            await report(threadId, "thread", reportReason);
            success("Thread reported successfully");
            setShowReportModal(false);
            setReportReason("");
        } catch (err) {
            showError(err?.message || "Failed to report thread");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-black mb-2">Error Loading Thread</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!currentThread) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    const canEdit = isAuthor(currentThread.authorId?._id);
    const canDelete = canEdit || isAdmin;

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 mt-24">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Forum
                </button>

                {/* Thread Card */}
                <div className="bg-white border border-black/10 rounded-2xl overflow-hidden mb-6">
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            {/* Voting */}
                            <VotingButtons
                                targetId={currentThread._id}
                                targetType="thread"
                                votes={currentThread.votes}
                                authorId={currentThread.authorId?._id}
                            />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {currentThread.isPinned && (
                                                <Pin className="w-4 h-4 text-cyan-500" />
                                            )}
                                            {currentThread.status === "locked" && (
                                                <Lock className="w-4 h-4 text-yellow-500" />
                                            )}
                                            <h1 className="text-3xl font-bold text-black">
                                                {currentThread.title}
                                            </h1>
                                        </div>

                                        {/* Author Info */}
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                <span className="text-black">{currentThread.authorId?.name || "Anonymous"}</span>
                                                {currentThread.authorId?.karma !== undefined && (
                                                    <span className="text-cyan-500">({currentThread.authorId.karma} karma)</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatTimeAgo(currentThread.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {canEdit && (
                                            <button
                                                onClick={() => router.push(`/forum/edit/${threadId}`)}
                                                className="p-2 bg-black/5 border border-black/10 rounded-lg text-gray-600 hover:text-black hover:border-cyan-500 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button
                                                onClick={handleDelete}
                                                className="p-2 bg-black/5 border border-black/10 rounded-lg text-red-500 hover:border-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <>
                                                <button
                                                    onClick={handleLock}
                                                    className="p-2 bg-black/5 border border-black/10 rounded-lg text-yellow-500 hover:border-yellow-500 transition-colors"
                                                    title={currentThread.status === "locked" ? "Unlock Thread" : "Lock Thread"}
                                                >
                                                    <Lock className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handlePin}
                                                    className="p-2 bg-black/5 border border-black/10 rounded-lg text-cyan-500 hover:border-cyan-500 transition-colors"
                                                    title={currentThread.isPinned ? "Unpin Thread" : "Pin Thread"}
                                                >
                                                    <Pin className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                        {user && !canEdit && (
                                            <button
                                                onClick={() => setShowReportModal(true)}
                                                className="p-2 bg-black/5 border border-black/10 rounded-lg text-gray-600 hover:text-red-500 hover:border-red-500 transition-colors"
                                            >
                                                <Flag className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="prose prose-invert max-w-none mb-4">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {currentThread.content}
                                    </p>
                                </div>

                                {/* Tags */}
                                {currentThread.tags && currentThread.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {currentThread.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-cyan-500/10 text-cyan-500 text-sm rounded-lg border border-cyan-500/20"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-black/10">
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{currentThread.commentCount || 0} comments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <CommentSection threadId={threadId} isLocked={currentThread.status === "locked"} />

                {/* Report Modal */}
                {showReportModal && (
                    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white border border-black/10 rounded-2xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-black mb-4">Report Thread</h3>
                            <textarea
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="Please provide a reason for reporting this thread (min 10 characters)..."
                                rows={4}
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors mb-4"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowReportModal(false);
                                        setReportReason("");
                                    }}
                                    className="flex-1 px-4 py-2 bg-black/10 border border-black/10 text-black rounded-lg hover:bg-black/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReport}
                                    className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

