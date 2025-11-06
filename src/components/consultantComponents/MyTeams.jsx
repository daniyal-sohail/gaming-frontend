"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    Building2,
    DollarSign,
    Clock,
    Calendar,
    ArrowRight,
    Briefcase,
    TrendingUp,
    AlertCircle,
    Loader2
} from "lucide-react";
import { useConsultantTeam } from "@/context/ConsultantTeamContext";

export default function MyTeams() {
    const router = useRouter();
    const { teamAssignments, loading, error, fetchMyTeamAssignments } = useConsultantTeam();

    useEffect(() => {
        fetchMyTeamAssignments();
    }, []);

    const formatCurrency = (amount, currency = "USD") => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: "bg-green-500/10 text-green-400 border-green-500/20", label: "Active" },
            pending: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", label: "Pending" },
            completed: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Completed" },
            cancelled: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Cancelled" },
        };
        const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8 mt-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">My Team Assignments</h1>
                    <p className="text-gray-400">
                        View all teams you're assigned to and track your projects
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-400 font-medium">Error Loading Assignments</p>
                            <p className="text-red-400/80 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && teamAssignments.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Team Assignments</h3>
                        <p className="text-gray-400 mb-6">
                            You haven't been assigned to any teams yet.
                        </p>
                    </div>
                )}

                {/* Team Assignments Grid */}
                {teamAssignments.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamAssignments.map((assignment) => (
                            <TeamAssignmentCard
                                key={assignment.teamId}
                                assignment={assignment}
                                onView={() => router.push(`/consultants/teams/${assignment.teamId}`)}
                                formatCurrency={formatCurrency}
                                formatDate={formatDate}
                                getStatusBadge={getStatusBadge}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TeamAssignmentCard({ assignment, onView, formatCurrency, formatDate, getStatusBadge }) {
    const {
        teamId,
        teamName,
        teamDescription,
        client,
        status,
        billingPeriod,
        projectDuration,
        role,
        allocation,
        startDate,
        endDate,
        rate,
        paymentAmount,
        paymentBreakdown,
        currency,
    } = assignment;

    return (
        <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer"
            onClick={onView}>
            <div className="h-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>

            <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors flex-1">
                            {teamName}
                        </h3>
                        {getStatusBadge(status)}
                    </div>
                    {teamDescription && (
                        <p className="text-sm text-gray-400 line-clamp-2">
                            {teamDescription}
                        </p>
                    )}
                </div>

                {/* Client Info */}
                {client && (
                    <div className="mb-4 p-3 bg-[#0d0d0d] rounded-xl border border-gray-800">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                            <Building2 className="w-4 h-4 text-primary" />
                            <span className="font-medium">Client</span>
                        </div>
                        <p className="text-white font-medium">
                            {client.user?.name || client.companyName || "N/A"}
                        </p>
                    </div>
                )}

                {/* Role & Allocation */}
                <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span className="text-gray-400">Role:</span>
                        <span className="text-white font-medium">{role || "Team Member"}</span>
                    </div>
                    {allocation && (
                        <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-gray-400">Allocation:</span>
                            <span className="text-white font-medium">{allocation}%</span>
                        </div>
                    )}
                </div>

                {/* Project Duration */}
                {projectDuration && (
                    <div className="mb-4 p-3 bg-[#0d0d0d] rounded-xl border border-gray-800">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span className="font-medium">Project Duration</span>
                        </div>
                        {startDate && endDate && (
                            <div className="text-xs text-gray-300 space-y-1">
                                <p>Start: {formatDate(startDate)}</p>
                                <p>End: {formatDate(endDate)}</p>
                            </div>
                        )}
                        {projectDuration.totalDays && (
                            <p className="text-xs text-gray-400 mt-2">
                                {projectDuration.totalDays} days ({projectDuration.totalWeeks} weeks)
                            </p>
                        )}
                    </div>
                )}

                {/* Payment Info */}
                {paymentAmount !== undefined && (
                    <div className="mb-4 p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <span>Payment</span>
                            </div>
                            <span className="text-lg font-bold text-green-400">
                                {formatCurrency(paymentAmount, currency)}
                            </span>
                        </div>
                        {paymentBreakdown && (
                            <p className="text-xs text-gray-500 mt-2">
                                {paymentBreakdown.calculation}
                            </p>
                        )}
                    </div>
                )}

                {/* Billing Period & Rate */}
                <div className="mb-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Billing: {billingPeriod || "N/A"}</span>
                    </div>
                    {rate && (
                        <div className="flex items-center gap-2 text-gray-400">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span>
                                Rate: {formatCurrency(rate.hourly || 0, rate.currency)}/hr
                            </span>
                        </div>
                    )}
                </div>

                {/* View Details Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onView();
                    }}
                    className="w-full mt-4 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium flex items-center justify-center gap-2 transition-all group-hover:bg-primary group-hover:text-white"
                >
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

