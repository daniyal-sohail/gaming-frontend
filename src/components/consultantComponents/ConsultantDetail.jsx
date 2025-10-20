"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConsultant } from "@/context/ConsultantContext";
import {
    ArrowLeft,
    Mail,
    MapPin,
    Clock,
    DollarSign,
    TrendingUp,
    Calendar,
    Globe,
    Shield,
    Award,
    Briefcase,
    Star,
    Check,
    X
} from "lucide-react";

export default function ConsultantDetail() {
    const params = useParams();
    const router = useRouter();
    const { selectedConsultant, loading, error, fetchConsultantDetails, clearError } = useConsultant();
    const consultantId = params.consultantId;

    useEffect(() => {
        if (consultantId) {
            fetchConsultantDetails(consultantId);
        }
    }, [consultantId]);

    if (loading) {
        return <DetailSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-10 h-10 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Error Loading Consultant</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!selectedConsultant) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const consultant = selectedConsultant;

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
                    Back to Consultants
                </button>

                {/* Profile Header */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-gray-800 rounded-2xl overflow-hidden mb-6 shadow-2xl">
                    <div className="h-40 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-20">
                            {/* Avatar */}
                            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-xl ring-4 ring-[#121212]">
                                {getInitials(consultant.user?.name)}
                            </div>

                            {/* Name and Quick Info */}
                            <div className="flex-1 md:mb-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-4xl font-bold text-white mb-2">
                                            {consultant.user?.name || "Anonymous Consultant"}
                                        </h1>
                                        <p className="text-xl text-gray-300 mb-2">{consultant.title || "Professional Consultant"}</p>
                                        {consultant.user?.isVerified && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                                                <Check className="w-4 h-4" />
                                                Verified Account
                                            </div>
                                        )}
                                    </div>
                                    <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all hover:scale-105 font-medium">
                                        Contact Consultant
                                    </button>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatCard
                                        icon={<TrendingUp className="w-5 h-5" />}
                                        label="Experience"
                                        value={`${consultant.experienceYears || 0} years`}
                                        color="green"
                                    />
                                    {consultant.baseRate?.hourly && (
                                        <StatCard
                                            icon={<DollarSign className="w-5 h-5" />}
                                            label="Hourly Rate"
                                            value={`$${consultant.baseRate.hourly}`}
                                            color="yellow"
                                        />
                                    )}
                                    <StatCard
                                        icon={<MapPin className="w-5 h-5" />}
                                        label="Location"
                                        value={consultant.availability?.remote ? "Remote" : "On-site"}
                                        color="purple"
                                    />
                                    {consultant.availability?.timezone && (
                                        <StatCard
                                            icon={<Clock className="w-5 h-5" />}
                                            label="Timezone"
                                            value={consultant.availability.timezone}
                                            color="blue"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        {consultant.bio && (
                            <Section title="About" icon={<Briefcase className="w-5 h-5" />}>
                                <p className="text-gray-300 leading-relaxed">{consultant.bio}</p>
                            </Section>
                        )}

                        {/* Skills */}
                        {consultant.skills && consultant.skills.length > 0 && (
                            <Section title="Skills & Expertise" icon={<Award className="w-5 h-5" />}>
                                <div className="flex flex-wrap gap-3">
                                    {consultant.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Certifications */}
                        {consultant.certifications && consultant.certifications.length > 0 && (
                            <Section title="Certifications" icon={<Shield className="w-5 h-5" />}>
                                <div className="space-y-4">
                                    {consultant.certifications.map((cert, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 bg-[#0d0d0d] rounded-xl border border-gray-800 hover:border-primary/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-white font-semibold mb-1">{cert.name}</h4>
                                                    {cert.issuer && (
                                                        <p className="text-sm text-gray-400">{cert.issuer}</p>
                                                    )}
                                                </div>
                                                {cert.year && (
                                                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">
                                                        {cert.year}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Education */}
                        {consultant.education && consultant.education.length > 0 && (
                            <Section title="Education" icon={<Award className="w-5 h-5" />}>
                                <div className="space-y-4">
                                    {consultant.education.map((edu, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 bg-[#0d0d0d] rounded-xl border border-gray-800"
                                        >
                                            <h4 className="text-white font-semibold mb-1">{edu.degree}</h4>
                                            {edu.institution && (
                                                <p className="text-gray-400 text-sm mb-1">{edu.institution}</p>
                                            )}
                                            {edu.year && (
                                                <p className="text-gray-500 text-sm">{edu.year}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}
                    </div>

                    {/* Right Column - Additional Info */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <Section title="Contact Information" icon={<Mail className="w-5 h-5" />}>
                            <div className="space-y-3">
                                <InfoRow
                                    icon={<Mail className="w-4 h-4" />}
                                    label="Email"
                                    value={consultant.user?.email || "Not provided"}
                                />
                            </div>
                        </Section>

                        {/* Availability */}
                        {consultant.availability && (
                            <Section title="Availability" icon={<Calendar className="w-5 h-5" />}>
                                <div className="space-y-3">
                                    <InfoRow
                                        icon={<MapPin className="w-4 h-4" />}
                                        label="Work Type"
                                        value={consultant.availability.remote ? "Remote" : "On-site"}
                                    />
                                    {consultant.availability.timezone && (
                                        <InfoRow
                                            icon={<Clock className="w-4 h-4" />}
                                            label="Timezone"
                                            value={consultant.availability.timezone}
                                        />
                                    )}
                                    {consultant.availability.hoursPerWeek && (
                                        <InfoRow
                                            icon={<Calendar className="w-4 h-4" />}
                                            label="Hours/Week"
                                            value={`${consultant.availability.hoursPerWeek} hours`}
                                        />
                                    )}
                                </div>
                            </Section>
                        )}

                        {/* Rates */}
                        {consultant.baseRate && (
                            <Section title="Rates" icon={<DollarSign className="w-5 h-5" />}>
                                <div className="space-y-3">
                                    {consultant.baseRate.hourly && (
                                        <InfoRow
                                            icon={<DollarSign className="w-4 h-4" />}
                                            label="Hourly Rate"
                                            value={`$${consultant.baseRate.hourly}/hr`}
                                        />
                                    )}
                                    {consultant.baseRate.daily && (
                                        <InfoRow
                                            icon={<DollarSign className="w-4 h-4" />}
                                            label="Daily Rate"
                                            value={`$${consultant.baseRate.daily}/day`}
                                        />
                                    )}
                                    {consultant.baseRate.monthly && (
                                        <InfoRow
                                            icon={<DollarSign className="w-4 h-4" />}
                                            label="Monthly Rate"
                                            value={`$${consultant.baseRate.monthly}/mo`}
                                        />
                                    )}
                                </div>
                            </Section>
                        )}

                        {/* Languages */}
                        {consultant.languages && consultant.languages.length > 0 && (
                            <Section title="Languages" icon={<Globe className="w-5 h-5" />}>
                                <div className="flex flex-wrap gap-2">
                                    {consultant.languages.map((lang, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm"
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Account Details */}
                        <Section title="Account Info" icon={<Shield className="w-5 h-5" />}>
                            <div className="space-y-3">
                                <InfoRow
                                    icon={<Shield className="w-4 h-4" />}
                                    label="Status"
                                    value={
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                            Approved
                                        </span>
                                    }
                                />
                                <InfoRow
                                    icon={<Globe className="w-4 h-4" />}
                                    label="Visibility"
                                    value={consultant.visibility || "Public"}
                                />
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Section Component
function Section({ title, icon, children }) {
    return (
        <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3 bg-gradient-to-r from-gray-900 to-[#121212]">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {icon}
                </div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

// Stat Card Component
function StatCard({ icon, label, value, color = "primary" }) {
    const colorClasses = {
        green: "text-green-400 bg-green-500/10",
        yellow: "text-yellow-400 bg-yellow-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        blue: "text-blue-400 bg-blue-500/10",
        primary: "text-primary bg-primary/10"
    };

    return (
        <div className="p-3 bg-[#0d0d0d] rounded-xl border border-gray-800">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colorClasses[color]}`}>
                {icon}
            </div>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
        </div>
    );
}

// Info Row Component
function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#0d0d0d] transition-colors">
            <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400 mb-0.5">{label}</p>
                <div className="text-white font-medium">
                    {typeof value === "string" ? value : value}
                </div>
            </div>
        </div>
    );
}

// Detail Skeleton Loader
function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="h-8 w-32 bg-gray-800 rounded mb-6 animate-pulse"></div>

                <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden mb-6">
                    <div className="h-40 bg-gray-800 animate-pulse"></div>
                    <div className="px-8 pb-8 pt-14">
                        <div className="h-10 bg-gray-800 rounded w-1/3 mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-800 rounded w-1/4 mb-4 animate-pulse"></div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-20 bg-gray-800 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
                                <div className="h-6 bg-gray-800 rounded w-1/4 mb-4 animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
                                <div className="h-6 bg-gray-800 rounded w-1/2 mb-4 animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}