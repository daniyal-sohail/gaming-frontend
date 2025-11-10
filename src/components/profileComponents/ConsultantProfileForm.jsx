"use client";

import React, { useState, useEffect } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import { useToast } from "@/context/ToastContext";
import { User, Briefcase, DollarSign, FileText, MapPin, Clock, Award, Link as LinkIcon, X, AlertCircle } from "lucide-react";

const ConsultantProfileForm = ({ existingProfile, isEditing, onCancel, onSuccess }) => {
    const { completeConsultantProfile, updateConsultantProfile, loading } = useOnboarding();
    const { success, error: showError } = useToast();

    const [formData, setFormData] = useState({
        headline: "",
        bio: "",
        roles: "",
        skills: "",
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
            hoursPerDay: 8,
            availableFrom: "",
            availableTo: "",
            remote: true,
        },
        locations: "",
        portfolioLinks: "",
    });

    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (existingProfile) {
            setFormData({
                headline: existingProfile.headline || "",
                bio: existingProfile.bio || "",
                roles: Array.isArray(existingProfile.roles) ? existingProfile.roles.join(", ") : existingProfile.roles || "",
                skills: Array.isArray(existingProfile.skills) ? existingProfile.skills.join(", ") : existingProfile.skills || "",
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
                    hoursPerDay: existingProfile.availability?.hoursPerDay || 8,
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
        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
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
        setFormData((prev) => {
            const newAvailability = {
                ...prev.availability,
                [name]: type === "checkbox" ? checked : (name === "hoursPerWeek" || name === "hoursPerDay" ? Number(value) || 0 : value),
            };

            // Auto-calculate hoursPerWeek when hoursPerDay changes
            // Only auto-calculate if hoursPerWeek hasn't been manually set or is at default (40)
            if (name === "hoursPerDay" && value) {
                const newHoursPerDay = Number(value);
                const currentHoursPerWeek = prev.availability.hoursPerWeek;
                
                // Auto-update hoursPerWeek if it's default (40) or matches calculated value from old hoursPerDay
                // This allows manual override while providing helpful auto-calculation
                if (currentHoursPerWeek === 40 || 
                    currentHoursPerWeek === (prev.availability.hoursPerDay || 8) * 5 ||
                    !currentHoursPerWeek) {
                    newAvailability.hoursPerWeek = newHoursPerDay * 5;
                }
            }

            return {
                ...prev,
                availability: newAvailability,
            };
        });
    };

    const validateForm = () => {
        const errors = {};

        if (formData.headline && formData.headline.length > 200) {
            errors.headline = "Headline cannot exceed 200 characters";
        }

        if (formData.bio && formData.bio.length > 2000) {
            errors.bio = "Bio cannot exceed 2000 characters";
        }

        if (formData.experienceYears && (formData.experienceYears < 0 || formData.experienceYears > 50)) {
            errors.experienceYears = "Experience must be between 0 and 50 years";
        }

        if (formData.availability.hoursPerDay && (formData.availability.hoursPerDay < 1 || formData.availability.hoursPerDay > 24)) {
            errors.hoursPerDay = "Hours per day must be between 1 and 24";
        }

        if (formData.availability.hoursPerWeek && (formData.availability.hoursPerWeek < 1 || formData.availability.hoursPerWeek > 168)) {
            errors.hoursPerWeek = "Hours per week must be between 1 and 168";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showError("Please fix the validation errors");
            return;
        }

        try {
            // Clean numeric values - convert 0 or empty to undefined for proper backend handling
            const cleanedAvailability = {
                ...formData.availability,
                hoursPerDay: formData.availability.hoursPerDay && formData.availability.hoursPerDay > 0 
                    ? formData.availability.hoursPerDay 
                    : undefined,
                hoursPerWeek: formData.availability.hoursPerWeek && formData.availability.hoursPerWeek > 0 
                    ? formData.availability.hoursPerWeek 
                    : undefined,
                timezone: formData.availability.timezone || undefined,
                remote: formData.availability.remote !== undefined ? formData.availability.remote : true,
                availableFrom: formData.availability.availableFrom || undefined,
                availableTo: formData.availability.availableTo || undefined,
            };

            // Remove undefined values from availability object
            Object.keys(cleanedAvailability).forEach(key => {
                if (cleanedAvailability[key] === undefined) {
                    delete cleanedAvailability[key];
                }
            });

            const submitData = {
                ...formData,
                roles: formData.roles ? formData.roles.split(",").map(r => r.trim()).filter(Boolean) : [],
                skills: formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
                locations: formData.locations ? formData.locations.split(",").map(l => l.trim()).filter(Boolean) : [],
                portfolioLinks: formData.portfolioLinks ? formData.portfolioLinks.split(",").map(p => p.trim()).filter(Boolean) : [],
                availability: Object.keys(cleanedAvailability).length > 0 ? cleanedAvailability : undefined,
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
        <div className="bg-white mt-32 border border-black/10 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-black">
                    {isEditing ? "Edit Profile" : "Complete Your Profile"}
                </h1>
                {isEditing && (
                    <button
                        onClick={onCancel}
                        className="text-gray-600 hover:text-black transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            <p className="text-gray-600 mb-8">
                {isEditing
                    ? "Update your professional information"
                    : "Please provide your professional details to get started"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-black border-b border-black/10 pb-2">
                        Basic Information
                    </h3>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 text-cyan-500" />
                            Professional Headline
                        </label>
                        <input
                            type="text"
                            name="headline"
                            value={formData.headline}
                            onChange={handleChange}
                            className={`w-full bg-white border ${validationErrors.headline ? 'border-red-500' : 'border-black/20'
                                } rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors`}
                            placeholder="e.g., Senior Strategy Consultant | MBA | 10+ Years Experience"
                        />
                        {validationErrors.headline && (
                            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {validationErrors.headline}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 text-cyan-500" />
                            Professional Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={5}
                            className={`w-full bg-white border ${validationErrors.bio ? 'border-red-500' : 'border-black/20'
                                } rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors resize-none`}
                            placeholder="Tell us about your professional background, expertise, and what makes you unique..."
                        />
                        {validationErrors.bio && (
                            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {validationErrors.bio}
                            </p>
                        )}
                    </div>
                </div>

                {/* Professional Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-black border-b border-black/10 pb-2">
                        Professional Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Briefcase className="w-4 h-4 text-cyan-500" />
                                Roles (comma-separated)
                            </label>
                            <input
                                type="text"
                                name="roles"
                                value={formData.roles}
                                onChange={handleChange}
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="Strategy Consultant, Business Analyst"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Award className="w-4 h-4 text-cyan-500" />
                                Level
                            </label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors"
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
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 text-cyan-500" />
                            Skills (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="Strategic Planning, Market Analysis, Financial Modeling"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Clock className="w-4 h-4 text-cyan-500" />
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            name="experienceYears"
                            value={formData.experienceYears}
                            onChange={handleChange}
                            min="0"
                            max="50"
                            className={`w-full bg-white border ${validationErrors.experienceYears ? 'border-red-500' : 'border-black/20'
                                } rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors`}
                            placeholder="5"
                        />
                        {validationErrors.experienceYears && (
                            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {validationErrors.experienceYears}
                            </p>
                        )}
                    </div>
                </div>

                {/* Rate */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-black border-b border-black/10 pb-2">
                        Base Rate
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 text-cyan-500" />
                                Currency
                            </label>
                            <select
                                name="currency"
                                value={formData.baseRate.currency}
                                onChange={handleBaseRateChange}
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="CAD">CAD</option>
                                <option value="AUD">AUD</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 text-cyan-500" />
                                Hourly Rate
                            </label>
                            <input
                                type="number"
                                name="hourly"
                                value={formData.baseRate.hourly}
                                onChange={handleBaseRateChange}
                                min="0"
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="150"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 text-cyan-500" />
                                Daily Rate (Optional)
                            </label>
                            <input
                                type="number"
                                name="daily"
                                value={formData.baseRate.daily}
                                onChange={handleBaseRateChange}
                                min="0"
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="1200"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 text-cyan-500" />
                                Weekly Rate (Optional)
                            </label>
                            <input
                                type="number"
                                name="weekly"
                                value={formData.baseRate.weekly}
                                onChange={handleBaseRateChange}
                                min="0"
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="6000"
                            />
                        </div>
                    </div>
                </div>

                {/* Availability */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-black border-b border-black/10 pb-2">
                        Availability
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4 text-cyan-500" />
                                Timezone
                            </label>
                            <input
                                type="text"
                                name="timezone"
                                value={formData.availability.timezone}
                                onChange={handleAvailabilityChange}
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="UTC"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4 text-cyan-500" />
                                Hours Per Week
                            </label>
                            <input
                                type="number"
                                name="hoursPerWeek"
                                value={formData.availability.hoursPerWeek}
                                onChange={handleAvailabilityChange}
                                min="1"
                                max="168"
                                className={`w-full bg-white border ${validationErrors.hoursPerWeek ? 'border-red-500' : 'border-black/20'
                                    } rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors`}
                                placeholder="40"
                            />
                            {validationErrors.hoursPerWeek && (
                                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {validationErrors.hoursPerWeek}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-600">
                                You can override the auto-calculated value
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4 text-cyan-500" />
                                Hours Per Day
                            </label>
                            <input
                                type="number"
                                name="hoursPerDay"
                                value={formData.availability.hoursPerDay}
                                onChange={handleAvailabilityChange}
                                min="1"
                                max="24"
                                className={`w-full bg-white border ${validationErrors.hoursPerDay ? 'border-red-500' : 'border-black/20'
                                    } rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors`}
                                placeholder="8"
                            />
                            {validationErrors.hoursPerDay && (
                                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {validationErrors.hoursPerDay}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-600">
                                Weekly hours will auto-calculate (hours/day × 5)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="remote"
                            name="remote"
                            checked={formData.availability.remote}
                            onChange={handleAvailabilityChange}
                            className="w-5 h-5 bg-white border-black/20 rounded text-cyan-500 focus:ring-cyan-500"
                        />
                        <label htmlFor="remote" className="text-sm font-medium text-gray-700">
                            Available for Remote Work
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 text-cyan-500" />
                            Locations (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="locations"
                            value={formData.locations}
                            onChange={handleChange}
                            className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="New York, Remote, London"
                        />
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-black border-b border-black/10 pb-2">
                        Additional Information
                    </h3>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <LinkIcon className="w-4 h-4 text-cyan-500" />
                            Portfolio Links (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="portfolioLinks"
                            value={formData.portfolioLinks}
                            onChange={handleChange}
                            className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="https://portfolio.com, https://linkedin.com/in/yourname"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 bg-white border border-black/20 text-black rounded-lg hover:bg-black/10 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-all hover:scale-105 active:scale-95 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                    >
                        {loading ? "Saving..." : isEditing ? "Save Changes" : "Complete Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsultantProfileForm;