"use client";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useForum } from "@/context/ForumContext";
import { useToast } from "@/context/ToastContext";

export default function VotingButtons({ targetId, targetType, votes, authorId, compact = false }) {
    const { user } = useAuth();
    const { getUserVote, vote } = useForum();
    const { error: showError } = useToast();

    const userVote = getUserVote(targetId);
    const netVotes = votes?.netVotes || (votes?.upvotes || 0) - (votes?.downvotes || 0);
    const isOwnContent = authorId === user?._id;

    const handleVote = async (voteType) => {
        if (!user) {
            showError("Please login to vote");
            return;
        }
        if (isOwnContent) {
            showError("You cannot vote on your own content");
            return;
        }

        try {
            await vote(targetId, targetType, voteType);
        } catch (err) {
            showError(err?.message || "Failed to vote");
        }
    };

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleVote("upvote")}
                    disabled={isOwnContent}
                    className={`p-1.5 rounded transition-all ${
                        userVote?.type === "upvote"
                        ? "bg-green-500/20 text-green-500"
                        : "text-gray-600 hover:text-green-500 hover:bg-green-500/10"
                    } ${isOwnContent ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <ArrowUp className="w-4 h-4" />
                </button>
                <span className={`text-sm font-bold min-w-[2rem] text-center ${netVotes >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {netVotes}
                </span>
                <button
                    onClick={() => handleVote("downvote")}
                    disabled={isOwnContent}
                    className={`p-1.5 rounded transition-all ${
                        userVote?.type === "downvote"
                        ? "bg-red-500/20 text-red-500"
                        : "text-gray-600 hover:text-red-500 hover:bg-red-500/10"
                    } ${isOwnContent ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <ArrowDown className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={() => handleVote("upvote")}
                disabled={isOwnContent}
                className={`p-2 rounded-lg transition-all ${
                    userVote?.type === "upvote"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-black/5 text-gray-600 hover:text-green-500 hover:bg-green-500/10"
                } ${isOwnContent ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <ArrowUp className="w-5 h-5" />
            </button>
            <span className={`text-sm font-bold ${netVotes >= 0 ? "text-green-500" : "text-red-500"}`}>
                {netVotes}
            </span>
            <button
                onClick={() => handleVote("downvote")}
                disabled={isOwnContent}
                className={`p-2 rounded-lg transition-all ${
                    userVote?.type === "downvote"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-black/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10"
                } ${isOwnContent ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <ArrowDown className="w-5 h-5" />
            </button>
        </div>
    );
}

