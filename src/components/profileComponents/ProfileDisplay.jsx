"use client";

import React from "react";
import {
    Building2,
    MapPin,
    Globe,
    User,
    DollarSign,
    Clock,
    FileText,
    Edit,
    Download,
    Mail,
    Briefcase,
    Award,
    Link as LinkIcon,
    Languages,
} from "lucide-react";

const ProfileDisplay = ({ profile, userType, onEdit }) => {
    if (!profile) return null;

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-8 border-b border-gray-800">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-2">
                                {userType === "client" ? profile.companyName : profile.headline || "Consultant Profile"}
                            </h1>
                            {userType === "consultant" && profile.level && (
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary rounded-full text-sm font-medium">
                                        {profile.level}
                                    </span>
                                    {profile.experienceYears && (
                                        <span className="text-gray-300">
                                            {profile.experienceYears} years experience
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-[#e88540] transition-colors font-medium"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Cards */}
            {userType === "client" ? (
                <ClientProfileContent profile={profile} />
            ) : (
                <ConsultantProfileContent profile={profile} />
            )}
        </div>
    );
};

const ClientProfileContent = ({ profile }) => {
    const hasAddress = profile.billingAddress && (
        profile.billingAddress.line1 ||
        profile.billingAddress.city ||
        profile.billingAddress.country
    );

    return (
        <>
            {/* Company Information */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">Company Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {profile.companyName && (
                        <InfoItem
                            icon={Building2}
                            label="Company Name"
                            value={profile.companyName}
                        />
                    )}
                    {profile.companyWebsite && (
                        <InfoItem
                            icon={Globe}
                            label="Website"
                            value={profile.companyWebsite}
                            isLink
                        />
                    )}
                </div>
            </div>

            {/* Billing Information */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">Billing Information</h2>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {profile.billingContactName && (
                            <InfoItem
                                icon={User}
                                label="Contact Name"
                                value={profile.billingContactName}
                            />
                        )}
                        {profile.billingContactEmail && (
                            <InfoItem
                                icon={Mail}
                                label="Contact Email"
                                value={profile.billingContactEmail}
                                isEmail
                            />
                        )}
                    </div>
                    {hasAddress && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-sm text-gray-400 font-medium">Billing Address</span>
                            </div>
                            <div className="text-white font-medium pl-6 space-y-1">
                                {profile.billingAddress.line1 && <p>{profile.billingAddress.line1}</p>}
                                {profile.billingAddress.line2 && <p>{profile.billingAddress.line2}</p>}
                                <p>
                                    {[
                                        profile.billingAddress.city,
                                        profile.billingAddress.region,
                                        profile.billingAddress.postalCode
                                    ].filter(Boolean).join(", ")}
                                </p>
                                {profile.billingAddress.country && <p>{profile.billingAddress.country}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </>
    );
};

const ConsultantProfileContent = ({ profile }) => {
    const roles = Array.isArray(profile.roles) ? profile.roles : [];
    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    const badges = Array.isArray(profile.badges) ? profile.badges : [];
    const locations = Array.isArray(profile.locations) ? profile.locations : [];
    const portfolioLinks = Array.isArray(profile.portfolioLinks) ? profile.portfolioLinks : [];

    const baseRate = profile.baseRate || {};
    const availability = profile.availability || {};

    return (
        <>
            {/* Professional Overview */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">Professional Overview</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {baseRate.hourly && (
                        <InfoItem
                            icon={DollarSign}
                            label="Hourly Rate"
                            value={`${baseRate.currency || 'USD'} ${baseRate.hourly}/hour`}
                        />
                    )}
                    {baseRate.daily && (
                        <InfoItem
                            icon={DollarSign}
                            label="Daily Rate"
                            value={`${baseRate.currency || 'USD'} ${baseRate.daily}/day`}
                        />
                    )}
                    {baseRate.weekly && (
                        <InfoItem
                            icon={DollarSign}
                            label="Weekly Rate"
                            value={`${baseRate.currency || 'USD'} ${baseRate.weekly}/week`}
                        />
                    )}
                    {profile.experienceYears !== undefined && (
                        <InfoItem
                            icon={Clock}
                            label="Experience"
                            value={`${profile.experienceYears} years`}
                        />
                    )}
                    {availability.hoursPerWeek && (
                        <InfoItem
                            icon={Clock}
                            label="Hours Per Week"
                            value={`${availability.hoursPerWeek} hours`}
                        />
                    )}
                    {availability.timezone && (
                        <InfoItem
                            icon={Clock}
                            label="Timezone"
                            value={availability.timezone}
                        />
                    )}
                    {profile.level && (
                        <InfoItem
                            icon={Award}
                            label="Level"
                            value={profile.level}
                        />
                    )}
                    {availability.remote !== undefined && (
                        <InfoItem
                            icon={MapPin}
                            label="Remote Work"
                            value={availability.remote ? "Available" : "Not Available"}
                        />
                    )}
                </div>
            </div>

            {/* Bio */}
            {profile.bio && (
                <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4">Professional Bio</h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {profile.bio}
                    </p>
                </div>
            )}

            {/* Roles */}
            {roles.length > 0 && (
                <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        Roles
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {roles.map((role, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg text-sm font-medium"
                            >
                                {role}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Skills & Expertise
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Badges & Certifications */}
            {badges.length > 0 && (
                <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Certifications & Badges
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {badges.map((badge, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-emerald-950/30 border border-emerald-800/50 text-emerald-400 rounded-lg text-sm font-medium"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Locations */}
            {locations.length > 0 && (
                <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Available Locations
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {locations.map((location, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-blue-950/30 border border-blue-800/50 text-blue-400 rounded-lg text-sm font-medium"
                            >
                                {location}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Portfolio Links */}
            {portfolioLinks.length > 0 && (
                <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-primary" />
                        Portfolio & Links
                    </h2>
                    <div className="space-y-2">
                        {portfolioLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:text-[#e88540] transition-colors"
                            >
                                <LinkIcon className="w-4 h-4" />
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* CV/Resume */}
            {profile.cv && (
                <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        CV / Resume
                    </h2>
                    <a
                        href={profile.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg hover:bg-[#e88540] transition-colors font-medium"
                    >
                        <Download className="w-5 h-5" />
                        Download CV
                    </a>
                </div>
            )}
        </>
    );
};

const InfoItem = ({ icon: Icon, label, value, isLink, isEmail }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400 font-medium">{label}</span>
            </div>
            {isLink ? (
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-colors font-medium block truncate"
                >
                    {value}
                </a>
            ) : isEmail ? (
                <a
                    href={`mailto:${value}`}
                    className="text-white hover:text-primary transition-colors font-medium block truncate"
                >
                    {value}
                </a>
            ) : (
                <p className="text-white font-medium">{value}</p>
            )}
        </div>
    );
};

export default ProfileDisplay;