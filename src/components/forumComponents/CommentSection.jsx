"use client";
import { useState } from "react";
import { MessageSquare, User, Calendar, Edit, Trash2, Loader2 } from "lucide-react";
import { useForum } from "@/context/ForumContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import VotingButtons from "./VotingButtons";

export default function CommentSection({ threadId, isLocked, compact = false }) {
    const { user, isAuthenticated } = useAuth();
    const { success, error: showError } = useToast();
    const {
        comments,
        loading,
        createComment,
        updateComment,
        deleteComment,
        isAuthor,
    } = useForum();

    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

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

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            showError("Please login to comment");
            return;
        }
        if (isLocked) {
            showError("This thread is locked");
            return;
        }
        if (!newComment.trim() || newComment.length < 1) {
            showError("Comment cannot be empty");
            return;
        }

        setSubmitting(true);
        try {
            await createComment({
                threadId,
                content: newComment.trim(),
            });
            setNewComment("");
            success("Comment added successfully");
        } catch (err) {
            showError(err?.message || "Failed to add comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleStartEdit = (comment) => {
        setEditingId(comment._id);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent("");
    };

    const handleSaveEdit = async (commentId) => {
        if (!editContent.trim() || editContent.length < 1) {
            showError("Comment cannot be empty");
            return;
        }

        setSubmitting(true);
        try {
            await updateComment(commentId, { content: editContent.trim() });
            setEditingId(null);
            setEditContent("");
            success("Comment updated successfully");
        } catch (err) {
            showError(err?.message || "Failed to update comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            await deleteComment(commentId);
            success("Comment deleted successfully");
        } catch (err) {
            showError(err?.message || "Failed to delete comment");
        }
    };

    if (compact) {
        return (
            <div>
                {/* Comment Form */}
                {isAuthenticated && !isLocked && (
                    <form onSubmit={handleSubmitComment} className="mb-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            rows={3}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors mb-2 resize-none text-sm"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                className="px-4 py-1.5 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    "Post"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {isLocked && (
                    <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-yellow-600 text-xs">This thread is locked. No new comments can be added.</p>
                    </div>
                )}

                {/* Comments List */}
                {loading && comments.length === 0 ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                formatTimeAgo={formatTimeAgo}
                                isEditing={editingId === comment._id}
                                editContent={editContent}
                                setEditContent={setEditContent}
                                onStartEdit={() => handleStartEdit(comment)}
                                onCancelEdit={handleCancelEdit}
                                onSaveEdit={() => handleSaveEdit(comment._id)}
                                onDelete={() => handleDelete(comment._id)}
                                canEdit={isAuthor(comment.authorId?._id)}
                                canDelete={isAuthor(comment.authorId?._id)}
                                submitting={submitting}
                                compact
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-cyan-500" />
                    Comments ({comments.length})
                </h2>

                {/* Comment Form */}
                {isAuthenticated && !isLocked && (
                    <form onSubmit={handleSubmitComment} className="mb-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            rows={4}
                            className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors mb-3 resize-none"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    "Post Comment"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {isLocked && (
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-yellow-600 text-sm">This thread is locked. No new comments can be added.</p>
                    </div>
                )}

                {/* Comments List */}
                {loading && comments.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                formatTimeAgo={formatTimeAgo}
                                isEditing={editingId === comment._id}
                                editContent={editContent}
                                setEditContent={setEditContent}
                                onStartEdit={() => handleStartEdit(comment)}
                                onCancelEdit={handleCancelEdit}
                                onSaveEdit={() => handleSaveEdit(comment._id)}
                                onDelete={() => handleDelete(comment._id)}
                                canEdit={isAuthor(comment.authorId?._id)}
                                canDelete={isAuthor(comment.authorId?._id)}
                                submitting={submitting}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function CommentItem({
    comment,
    formatTimeAgo,
    isEditing,
    editContent,
    setEditContent,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete,
    canEdit,
    canDelete,
    submitting,
    compact = false,
}) {
    const getInitials = (name) => {
        if (!name) return "A";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };
    if (isEditing) {
        return (
            <div className={`${compact ? "p-2" : "p-4"} bg-gray-50 border border-gray-200 rounded-lg`}>
                <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={compact ? 3 : 4}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors mb-2 resize-none text-sm"
                />
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onCancelEdit}
                        className="px-3 py-1.5 bg-gray-100 text-black rounded-full hover:bg-gray-200 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSaveEdit}
                        disabled={submitting || !editContent.trim()}
                        className="px-3 py-1.5 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }

    if (compact) {
        return (
            <div className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-semibold text-xs">
                        {getInitials(comment.authorId?.name)}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-black text-sm">
                            {comment.authorId?.name || "Anonymous"}
                        </span>
                        {comment.authorId?.karma !== undefined && (
                            <span className="text-gray-500 text-xs">
                                · {comment.authorId.karma} karma
                            </span>
                        )}
                        <span className="text-gray-500 text-xs">
                            · {formatTimeAgo(comment.createdAt)}
                        </span>
                        {(canEdit || canDelete) && (
                            <div className="flex items-center gap-1 ml-auto">
                                {canEdit && (
                                    <button
                                        onClick={onStartEdit}
                                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </button>
                                )}
                                {canDelete && (
                                    <button
                                        onClick={onDelete}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                        {comment.content}
                    </p>
                    <VotingButtons
                        targetId={comment._id}
                        targetType="comment"
                        votes={comment.votes}
                        authorId={comment.authorId?._id}
                        compact
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-black/5 border border-black/10 rounded-xl">
            <div className="flex items-start gap-4">
                {/* Voting */}
                <VotingButtons
                    targetId={comment._id}
                    targetType="comment"
                    votes={comment.votes}
                    authorId={comment.authorId?._id}
                    compact
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span className="text-black">{comment.authorId?.name || "Anonymous"}</span>
                                {comment.authorId?.karma !== undefined && (
                                    <span className="text-cyan-500">({comment.authorId.karma} karma)</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        {(canEdit || canDelete) && (
                            <div className="flex items-center gap-2">
                                {canEdit && (
                                    <button
                                        onClick={onStartEdit}
                                        className="p-1.5 text-gray-600 hover:text-black transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                )}
                                {canDelete && (
                                    <button
                                        onClick={onDelete}
                                        className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {comment.content}
                    </p>
                </div>
            </div>
        </div>
    );
}

