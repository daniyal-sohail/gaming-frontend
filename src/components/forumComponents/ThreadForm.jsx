"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, X, Loader2, AlertCircle } from "lucide-react";
import { useForum } from "@/context/ForumContext";
import { useToast } from "@/context/ToastContext";

export default function ThreadForm() {
    const router = useRouter();
    const params = useParams();
    const { success, error: showError } = useToast();
    const {
        currentThread,
        loading,
        fetchThreadById,
        createThread,
        updateThread,
    } = useForum();

    const isEditing = params.threadId && params.threadId !== "create";
    const threadId = params.threadId;

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: [],
    });
    const [tagInput, setTagInput] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isEditing && threadId) {
            fetchThreadById(threadId);
        }
    }, [isEditing, threadId]);

    useEffect(() => {
        if (isEditing && currentThread) {
            setFormData({
                title: currentThread.title || "",
                content: currentThread.content || "",
                tags: currentThread.tags || [],
            });
        }
    }, [isEditing, currentThread]);

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim() || formData.title.length < 3) {
            errors.title = "Title must be at least 3 characters";
        } else if (formData.title.length > 200) {
            errors.title = "Title cannot exceed 200 characters";
        }

        if (!formData.content.trim() || formData.content.length < 10) {
            errors.content = "Content must be at least 10 characters";
        } else if (formData.content.length > 10000) {
            errors.content = "Content cannot exceed 10000 characters";
        }

        if (formData.tags.length > 10) {
            errors.tags = "Maximum 10 tags allowed";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (!tag) return;

        if (formData.tags.length >= 10) {
            showError("Maximum 10 tags allowed");
            return;
        }

        if (formData.tags.includes(tag)) {
            showError("Tag already added");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            tags: [...prev.tags, tag],
        }));
        setTagInput("");
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showError("Please fix the validation errors");
            return;
        }

        setSubmitting(true);
        try {
            if (isEditing) {
                await updateThread(threadId, formData);
                success("Thread updated successfully");
            } else {
                await createThread(formData);
                success("Thread created successfully");
            }
            router.push(isEditing ? `/forum/thread/${threadId}` : "/forum");
        } catch (err) {
            showError(err?.message || `Failed to ${isEditing ? "update" : "create"} thread`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 mt-24">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                {/* Form Card */}
                <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-black mb-6">
                            {isEditing ? "Edit Thread" : "Create New Thread"}
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, title: e.target.value }));
                                        if (validationErrors.title) {
                                            setValidationErrors((prev) => {
                                                const newErrors = { ...prev };
                                                delete newErrors.title;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    placeholder="Enter thread title (3-200 characters)"
                                    maxLength={200}
                                    className={`w-full bg-white border ${
                                        validationErrors.title ? "border-red-500" : "border-black/20"
                                    } rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors`}
                                />
                                <div className="flex items-center justify-between mt-1">
                                    {validationErrors.title && (
                                        <p className="text-xs text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {validationErrors.title}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 ml-auto">
                                        {formData.title.length}/200
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, content: e.target.value }));
                                        if (validationErrors.content) {
                                            setValidationErrors((prev) => {
                                                const newErrors = { ...prev };
                                                delete newErrors.content;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    placeholder="Write your thread content (10-10000 characters)..."
                                    rows={12}
                                    maxLength={10000}
                                    className={`w-full bg-white border ${
                                        validationErrors.content ? "border-red-500" : "border-black/20"
                                    } rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none`}
                                />
                                <div className="flex items-center justify-between mt-1">
                                    {validationErrors.content && (
                                        <p className="text-xs text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {validationErrors.content}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 ml-auto">
                                        {formData.content.length}/10000
                                    </p>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags (Optional, max 10)
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                        placeholder="Add a tag and press Enter"
                                        className="flex-1 bg-white border border-black/20 rounded-lg px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        disabled={formData.tags.length >= 10}
                                        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-500 text-sm rounded-lg border border-cyan-500/20"
                                            >
                                                #{tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="text-cyan-500 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {validationErrors.tags && (
                                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {validationErrors.tags}
                                    </p>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="flex-1 px-6 py-3 bg-black/10 border border-black/10 text-black rounded-lg hover:bg-black/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {isEditing ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        isEditing ? "Update Thread" : "Create Thread"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

