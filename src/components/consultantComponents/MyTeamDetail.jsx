"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Users,
    Building2,
    DollarSign,
    Clock,
    Calendar,
    Briefcase,
    TrendingUp,
    Award,
    MapPin,
    Globe,
    Mail,
    FileText,
    AlertCircle,
    Loader2,
    CheckCircle
} from "lucide-react";
import { useConsultantTeam } from "@/context/ConsultantTeamContext";

export default function MyTeamDetail() {
    const params = useParams();
    const router = useRouter();
    const { currentTeam, loading, error, fetchTeamById, clearError } = useConsultantTeam();
    const teamId = params.teamId;

    useEffect(() => {
        if (teamId) {
            fetchTeamById(teamId);
        }
        return () => {
            clearError();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamId]);

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
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Error Loading Team</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!currentTeam) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const myMemberInfo = {
        role: currentTeam.myRole,
        allocation: currentTeam.myAllocation || 100,
        startDate: currentTeam.myStartDate,
        endDate: currentTeam.myEndDate,
    };

    const getInitials = (name) => {
        if (!name) return "C";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8 mt-24">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to My Teams
                </button>

                {/* Team Header */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-gray-800 rounded-2xl overflow-hidden mb-6 shadow-2xl">
                    <div className="h-32 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    {currentTeam.name}
                                </h1>
                                {currentTeam.description && (
                                    <p className="text-gray-400 text-lg">
                                        {currentTeam.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${currentTeam.status === "active"
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : currentTeam.status === "completed"
                                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                    }`}>
                                    {currentTeam.status || "Pending"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        icon={<Users className="w-5 h-5" />}
                        label="Team Members"
                        value={`${currentTeam.members?.length || 0}`}
                        color="primary"
                    />
                    <StatCard
                        icon={<Clock className="w-5 h-5" />}
                        label="Billing Period"
                        value={currentTeam.billingPeriod || "N/A"}
                        color="blue"
                    />
                    <StatCard
                        icon={<Calendar className="w-5 h-5" />}
                        label="Duration"
                        value={currentTeam.projectDuration?.totalDays
                            ? `${currentTeam.projectDuration.totalDays} days`
                            : "N/A"}
                        color="purple"
                    />
                    <StatCard
                        icon={<DollarSign className="w-5 h-5" />}
                        label="Team Budget"
                        value={currentTeam.totalBudget
                            ? formatCurrency(currentTeam.totalBudget.amount, currentTeam.totalBudget.currency)
                            : "N/A"}
                        color="green"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - My Information & Project Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* My Role & Information */}
                        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" />
                                My Assignment
                            </h2>
                            <div className="space-y-4">
                                <InfoRow
                                    icon={<Briefcase className="w-4 h-4" />}
                                    label="Role"
                                    value={myMemberInfo.role || "Team Member"}
                                />
                                <InfoRow
                                    icon={<TrendingUp className="w-4 h-4" />}
                                    label="Allocation"
                                    value={`${myMemberInfo.allocation}%`}
                                />
                                {myMemberInfo.startDate && (
                                    <InfoRow
                                        icon={<Calendar className="w-4 h-4" />}
                                        label="Start Date"
                                        value={formatDate(myMemberInfo.startDate)}
                                    />
                                )}
                                {myMemberInfo.endDate && (
                                    <InfoRow
                                        icon={<Calendar className="w-4 h-4" />}
                                        label="End Date"
                                        value={formatDate(myMemberInfo.endDate)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Project Duration */}
                        {currentTeam.projectDuration && (
                            <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Project Duration
                                </h2>
                                <div className="space-y-4">
                                    {currentTeam.projectDuration.startDate && (
                                        <InfoRow
                                            icon={<Calendar className="w-4 h-4" />}
                                            label="Start Date"
                                            value={formatDate(currentTeam.projectDuration.startDate)}
                                        />
                                    )}
                                    {currentTeam.projectDuration.endDate && (
                                        <InfoRow
                                            icon={<Calendar className="w-4 h-4" />}
                                            label="End Date"
                                            value={formatDate(currentTeam.projectDuration.endDate)}
                                        />
                                    )}
                                    {currentTeam.projectDuration.estimatedHours && (
                                        <InfoRow
                                            icon={<Clock className="w-4 h-4" />}
                                            label="Estimated Hours"
                                            value={`${currentTeam.projectDuration.estimatedHours} hours`}
                                        />
                                    )}
                                    {currentTeam.projectDuration.totalDays && (
                                        <InfoRow
                                            icon={<FileText className="w-4 h-4" />}
                                            label="Total Duration"
                                            value={`${currentTeam.projectDuration.totalDays} days (${currentTeam.projectDuration.totalWeeks} weeks)`}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Client Information */}
                        {currentTeam.client && (
                            <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    Client Information
                                </h2>
                                <div className="space-y-4">
                                    <InfoRow
                                        icon={<Building2 className="w-4 h-4" />}
                                        label="Client Name"
                                        value={currentTeam.client.user?.name || currentTeam.client.companyName || "N/A"}
                                    />
                                    {currentTeam.client.user?.email && (
                                        <InfoRow
                                            icon={<Mail className="w-4 h-4" />}
                                            label="Email"
                                            value={currentTeam.client.user.email}
                                        />
                                    )}
                                    {currentTeam.client.companyWebsite && (
                                        <InfoRow
                                            icon={<Globe className="w-4 h-4" />}
                                            label="Website"
                                            value={currentTeam.client.companyWebsite}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Team Members */}
                        {currentTeam.members && currentTeam.members.length > 0 && (
                            <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    Team Members ({currentTeam.members.length})
                                </h2>
                                <div className="space-y-3">
                                    {currentTeam.members.map((member, index) => {
                                        const consultant = member.consultant;
                                        const isMe = member.isCurrentConsultant;
                                        return (
                                            <MemberCard
                                                key={index}
                                                member={member}
                                                consultant={consultant}
                                                isMe={isMe}
                                                getInitials={getInitials}
                                                formatCurrency={formatCurrency}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Pricing & Requirements */}
                    <div className="space-y-6">
                        {/* Pricing Information */}
                        {currentTeam.totalBudget && (
                            <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    Team Budget
                                </h2>
                                <div className="space-y-3">
                                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                                        <p className="text-sm text-gray-400 mb-1">Total Budget</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            {formatCurrency(
                                                currentTeam.totalBudget.amount,
                                                currentTeam.totalBudget.currency
                                            )}
                                        </p>
                                    </div>
                                    {currentTeam.pricingSnapshot && (
                                        <div className="space-y-2 text-sm">
                                            {Object.entries(currentTeam.pricingSnapshot).map(([key, value]) => (
                                                <div key={key} className="flex justify-between text-gray-400">
                                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                    <span className="text-white">
                                                        {typeof value === 'number'
                                                            ? formatCurrency(value, currentTeam.totalBudget.currency)
                                                            : value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Requirements */}
                        {currentTeam.requirements && Object.keys(currentTeam.requirements).length > 0 && (
                            <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Requirements
                                </h2>
                                <div className="space-y-3">
                                    {currentTeam.requirements.skills && currentTeam.requirements.skills.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-400 mb-2">Skills Required</p>
                                            <div className="flex flex-wrap gap-2">
                                                {currentTeam.requirements.skills.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-lg border border-primary/20"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {currentTeam.requirements.experienceYears && (
                                        <InfoRow
                                            icon={<Award className="w-4 h-4" />}
                                            label="Min Experience"
                                            value={`${currentTeam.requirements.experienceYears} years`}
                                        />
                                    )}
                                    {currentTeam.requirements.preferredTimezone && (
                                        <InfoRow
                                            icon={<Clock className="w-4 h-4" />}
                                            label="Timezone"
                                            value={currentTeam.requirements.preferredTimezone}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color = "primary" }) {
    const colorClasses = {
        green: "text-green-400 bg-green-500/10",
        yellow: "text-yellow-400 bg-yellow-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        blue: "text-blue-400 bg-blue-500/10",
        primary: "text-primary bg-primary/10"
    };

    return (
        <div className="p-4 bg-[#121212] rounded-xl border border-gray-800">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorClasses[color]}`}>
                {icon}
            </div>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-lg font-bold text-white capitalize">{value}</p>
        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#0d0d0d] transition-colors">
            <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400 mb-0.5">{label}</p>
                <p className="text-white font-medium">{value}</p>
            </div>
        </div>
    );
}

function MemberCard({ member, consultant, isMe, getInitials, formatCurrency }) {
    if (!consultant) return null;

    return (
        <div className={`p-4 bg-[#0d0d0d] rounded-xl border ${isMe ? 'border-primary/50 bg-primary/5' : 'border-gray-800'} transition-all`}>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                    {getInitials(consultant.user?.name)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-semibold">
                            {consultant.user?.name || "Anonymous"}
                        </h4>
                        {isMe && (
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded border border-primary/30">
                                You
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{member.role || consultant.headline || "Team Member"}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        {consultant.baseRate?.hourly && (
                            <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {formatCurrency(consultant.baseRate.hourly, consultant.baseRate.currency)}/hr
                            </span>
                        )}
                        {member.allocation && (
                            <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {member.allocation}% allocation
                            </span>
                        )}
                        {consultant.level && (
                            <span className="flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                {consultant.level}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

