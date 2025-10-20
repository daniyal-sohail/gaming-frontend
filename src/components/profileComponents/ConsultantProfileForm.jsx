"use client";

import React, { useState, useEffect } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import { useToast } from "@/context/ToastContext";
import { User, Briefcase, DollarSign, FileText, Upload, MapPin, Clock, Award, Link as LinkIcon, X } from "lucide-react";

const ConsultantProfileForm = ({ existingProfile, isEditing, onCancel, onSuccess }) => {
    const { completeConsultantProfile, updateConsultantProfile, loading } = useOnboarding();
    const { success, error: showError } = useToast();

    const [formData, setFormData] = useState({
        headline: "",
        bio: "",
        roles: "",
        skills: "",
        badges: "",
        level: "LV1",
        baseRate: {
            currency: "USD",
            hourly: "",
            daily: "",
            weekly: "",
        },
        experienceYears: "",
        availability: {
            timezone: "UTC",
            hoursPerWeek: 40,
            availableFrom: "",
            availableTo: "",
            remote: true,
        },
        locations: "",
        portfolioLinks: "",
    });


    useEffect(() => {
        if (existingProfile) {
            setFormData({
                headline: existingProfile.headline || "",
                bio: existingProfile.bio || "",
                roles: Array.isArray(existingProfile.roles) ? existingProfile.roles.join(", ") : existingProfile.roles || "",
                skills: Array.isArray(existingProfile.skills) ? existingProfile.skills.join(", ") : existingProfile.skills || "",
                badges: Array.isArray(existingProfile.badges) ? existingProfile.badges.join(", ") : existingProfile.badges || "",
                level: existingProfile.level || "LV1",
                baseRate: {
                    currency: existingProfile.baseRate?.currency || "USD",
                    hourly: existingProfile.baseRate?.hourly || "",
                    daily: existingProfile.baseRate?.daily || "",
                    weekly: existingProfile.baseRate?.weekly || "",
                },
                experienceYears: existingProfile.experienceYears || "",
                availability: {
                    timezone: existingProfile.availability?.timezone || "UTC",
                    hoursPerWeek: existingProfile.availability?.hoursPerWeek || 40,
                    availableFrom: existingProfile.availability?.availableFrom || "",
                    availableTo: existingProfile.availability?.availableTo || "",
                    remote: existingProfile.availability?.remote !== undefined ? existingProfile.availability.remote : true,
                },
                locations: Array.isArray(existingProfile.locations) ? existingProfile.locations.join(", ") : existingProfile.locations || "",
                portfolioLinks: Array.isArray(existingProfile.portfolioLinks) ? existingProfile.portfolioLinks.join(", ") : existingProfile.portfolioLinks || "",
            });

        }
    }, [existingProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBaseRateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            baseRate: {
                ...prev.baseRate,
                [name]: value === "" ? "" : Number(value),
            },
        }));
    };

    const handleAvailabilityChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            availability: {
                ...prev.availability,
                [name]: type === "checkbox" ? checked : (name === "hoursPerWeek" ? Number(value) : value),
            },
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Convert comma-separated strings to arrays
            const submitData = {
                ...formData,
                roles: formData.roles.split(",").map(r => r.trim()).filter(Boolean),
                skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
                badges: formData.badges ? formData.badges.split(",").map(b => b.trim()).filter(Boolean) : [],
                locations: formData.locations.split(",").map(l => l.trim()).filter(Boolean),
                portfolioLinks: formData.portfolioLinks ? formData.portfolioLinks.split(",").map(p => p.trim()).filter(Boolean) : [],
            };



            if (isEditing) {
                await updateConsultantProfile(submitData);
                success("Profile updated successfully!");
            } else {
                await completeConsultantProfile(submitData);
                success("Profile completed successfully!");
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            showError(err?.message || "Failed to save profile");
        }
    };

    return (
        <div className="bg-[#0f0f0f] mt-32 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">
                    {isEditing ? "Edit Profile" : "Complete Your Profile"}
                </h1>
                {isEditing && (
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            <p className="text-gray-400 mb-8">
                {isEditing
                    ? "Update your professional information"
                    : "Please provide your professional details to get started"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                        Basic Information
                    </h3>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <User className="w-4 h-4 text-primary" />
                            Professional Headline
                        </label>
                        <input
                            type="text"
                            name="headline"
                            value={formData.headline}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="e.g., Senior Strategy Consultant | MBA | 10+ Years Experience"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Professional Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={5}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                            placeholder="Tell us about your professional background, expertise, and what makes you unique..."
                        />
                    </div>
                </div>

                {/* Professional Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                        Professional Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Briefcase className="w-4 h-4 text-primary" />
                                Roles (comma-separated)
                            </label>
                            <input
                                type="text"
                                name="roles"
                                value={formData.roles}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Strategy Consultant, Business Analyst"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Award className="w-4 h-4 text-primary" />
                                Level
                            </label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="LV1">LV1</option>
                                <option value="LV2">LV2</option>
                                <option value="LV3">LV3</option>
                                <option value="LV4">LV4</option>
                                <option value="LV5">LV5</option>
                                <option value="LV6">LV6</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Skills (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Strategic Planning, Market Analysis, Financial Modeling"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <Award className="w-4 h-4 text-primary" />
                            Badges / Certifications (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="badges"
                            value={formData.badges}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="PMP, Six Sigma, MBA, CFA"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            name="experienceYears"
                            value={formData.experienceYears}
                            onChange={handleChange}
                            min="0"
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="5"
                        />
                    </div>
                </div>

                {/* Rate */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                        Base Rate
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <DollarSign className="w-4 h-4 text-primary" />
                                Currency
                            </label>
                            <select
                                name="currency"
                                value={formData.baseRate.currency}
                                onChange={handleBaseRateChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="CAD">CAD</option>
                                <option value="AUD">AUD</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <DollarSign className="w-4 h-4 text-primary" />
                                Hourly Rate
                            </label>
                            <input
                                type="number"
                                name="hourly"
                                value={formData.baseRate.hourly}
                                onChange={handleBaseRateChange}
                                min="0"
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="150"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <DollarSign className="w-4 h-4 text-primary" />
                                Daily Rate (Optional)
                            </label>
                            <input
                                type="number"
                                name="daily"
                                value={formData.baseRate.daily}
                                onChange={handleBaseRateChange}
                                min="0"
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="1200"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <DollarSign className="w-4 h-4 text-primary" />
                                Weekly Rate (Optional)
                            </label>
                            <input
                                type="number"
                                name="weekly"
                                value={formData.baseRate.weekly}
                                onChange={handleBaseRateChange}
                                min="0"
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="6000"
                            />
                        </div>
                    </div>
                </div>

                {/* Availability */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                        Availability
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Timezone
                            </label>
                            <input
                                type="text"
                                name="timezone"
                                value={formData.availability.timezone}
                                onChange={handleAvailabilityChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="UTC"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Hours Per Week
                            </label>
                            <input
                                type="number"
                                name="hoursPerWeek"
                                value={formData.availability.hoursPerWeek}
                                onChange={handleAvailabilityChange}
                                min="1"
                                max="168"
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="40"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Available From (Optional)
                            </label>
                            <input
                                type="date"
                                name="availableFrom"
                                value={formData.availability.availableFrom}
                                onChange={handleAvailabilityChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Available To (Optional)
                            </label>
                            <input
                                type="date"
                                name="availableTo"
                                value={formData.availability.availableTo}
                                onChange={handleAvailabilityChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="remote"
                            name="remote"
                            checked={formData.availability.remote}
                            onChange={handleAvailabilityChange}
                            className="w-5 h-5 bg-[#1a1a1a] border-gray-700 rounded text-primary focus:ring-primary"
                        />
                        <label htmlFor="remote" className="text-sm font-medium text-gray-300">
                            Available for Remote Work
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Locations (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="locations"
                            value={formData.locations}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="New York, Remote, London"
                        />
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                        Additional Information
                    </h3>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <LinkIcon className="w-4 h-4 text-primary" />
                            Portfolio Links (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="portfolioLinks"
                            value={formData.portfolioLinks}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="https://portfolio.com, https://linkedin.com/in/yourname"
                        />
                    </div>


                </div>

                <div className="flex gap-4 pt-4">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg hover:bg-[#242424] transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-[#e88540] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving..." : isEditing ? "Save Changes" : "Complete Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsultantProfileForm;