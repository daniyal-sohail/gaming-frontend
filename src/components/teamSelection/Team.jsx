"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    Plus,
    Search,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Clock,
    AlertCircle,
    X
} from "lucide-react";
import CreateTeamModal from "./CreateTeamModal";
import { useTeamSelection } from "@/context/TeamSelectionContext";

export default function TeamsPage() {
    const router = useRouter();
    const { teams, pagination, loading, error, getTeams, deleteTeam, clearError } = useTeamSelection();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        loadTeams();
    }, [currentPage]);

    const loadTeams = async () => {
        await getTeams({ page: currentPage, limit: 9 });
    };

    const handleDeleteTeam = async (teamId) => {
        try {
            await deleteTeam(teamId);
            setDeleteConfirm(null);
            if (teams.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                loadTeams();
            }
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 mt-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-black mb-2">My Teams</h1>
                            <p className="text-gray-600">
                                Manage your consultant teams ({teams.length}/3 teams created)
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            disabled={teams.length >= 3}
                            className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all hover:scale-105 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <Plus className="w-5 h-5" />
                            Create Team
                        </button>
                    </div>

                    {teams.length >= 3 && (
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-yellow-400 font-medium">Team Limit Reached</p>
                                <p className="text-yellow-400/80 text-sm">
                                    You've reached the maximum of 3 teams. Delete a team to create a new one.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start justify-between">
                        <p className="text-red-400 text-sm">{error}</p>
                        <button onClick={clearError} className="text-red-400 hover:text-red-300">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Search */}
                {teams.length > 0 && (
                    <div className="mb-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search teams..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-black/20 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        />
                    </div>
                )}

                {/* Teams Grid */}
                {loading ? (
                    <TeamsSkeleton />
                ) : filteredTeams.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {filteredTeams.map((team) => (
                                <TeamCard
                                    key={team._id}
                                    team={team}
                                    onView={() => router.push(`/teams/${team._id}`)}
                                    onDelete={() => setDeleteConfirm(team._id)}
                                />
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                ) : (
                    <EmptyState onCreateTeam={() => setShowCreateModal(true)} />
                )}
            </div>

            {/* Create Team Modal */}
            {showCreateModal && (
                <CreateTeamModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <DeleteConfirmModal
                    onConfirm={() => handleDeleteTeam(deleteConfirm)}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}
        </div>
    );
}

function TeamCard({ team, onView, onDelete }) {
    return (
        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all group">
            <div className="h-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-black mb-1 group-hover:text-cyan-500 transition-colors">
                            {team.name}
                        </h3>
                        {team.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {team.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-cyan-500" />
                        <span>
                            {team.members?.length || 0}/3 Members
                        </span>
                    </div>

                    {team.totalBudget && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span>
                                {team.totalBudget.currency} {team.totalBudget.amount?.toFixed(2) || "0.00"}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="capitalize">{team.billingPeriod || "Hourly"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onView}
                        className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        View Details
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ onCreateTeam }) {
    return (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">No teams yet</h3>
            <p className="text-gray-600 mb-6">
                Create your first team to start collaborating with consultants
            </p>
            <button
                onClick={onCreateTeam}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 inline-flex items-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Create Your First Team
            </button>
        </div>
    );
}

function TeamsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-black/10 rounded-2xl overflow-hidden">
                    <div className="h-3 bg-black/10 animate-pulse"></div>
                    <div className="p-6">
                        <div className="h-6 bg-black/10 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-black/10 rounded w-2/3 mb-4 animate-pulse"></div>
                        <div className="space-y-2 mb-4">
                            <div className="h-4 bg-black/10 rounded animate-pulse"></div>
                            <div className="h-4 bg-black/10 rounded animate-pulse"></div>
                            <div className="h-4 bg-black/10 rounded animate-pulse"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 h-10 bg-black/10 rounded animate-pulse"></div>
                            <div className="h-10 w-10 bg-black/10 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function DeleteConfirmModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm">
            <div className="bg-white border border-black/10 rounded-2xl p-6 max-w-md w-full">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-black text-center mb-2">Delete Team</h3>
                <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to delete this team? This action cannot be undone.
                </p>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 bg-black/10 text-black rounded-xl hover:bg-black/20 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;
        let start = Math.max(1, currentPage - Math.floor(showPages / 2));
        let end = Math.min(totalPages, start + showPages - 1);

        if (end - start < showPages - 1) {
            start = Math.max(1, end - showPages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-black/10 text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/10 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === currentPage
                        ? "bg-cyan-500 text-white"
                        : "bg-white border border-black/10 text-gray-600 hover:bg-black/10"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white border border-black/10 text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/10 transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}