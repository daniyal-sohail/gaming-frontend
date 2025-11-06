"use client";

import React, { useState, useEffect } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import { useToast } from "@/context/ToastContext";
import { Building2, Globe, User, Mail, MapPin, X, AlertCircle } from "lucide-react";

const ClientProfileForm = ({ existingProfile, isEditing, onCancel, onSuccess }) => {
    const { completeClientProfile, updateClientProfile, loading } = useOnboarding();
    const { success, error: showError } = useToast();

    const [formData, setFormData] = useState({
        companyName: "",
        companyWebsite: "",
        billingContactName: "",
        billingContactEmail: "",
        billingAddress: {
            line1: "",
            line2: "",
            city: "",
            region: "",
            postalCode: "",
            country: "",
        },
    });

    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (existingProfile) {
            setFormData({
                companyName: existingProfile.companyName || "",
                companyWebsite: existingProfile.companyWebsite || "",
                billingContactName: existingProfile.billingContactName || "",
                billingContactEmail: existingProfile.billingContactEmail || "",
                billingAddress: {
                    line1: existingProfile.billingAddress?.line1 || "",
                    line2: existingProfile.billingAddress?.line2 || "",
                    city: existingProfile.billingAddress?.city || "",
                    region: existingProfile.billingAddress?.region || "",
                    postalCode: existingProfile.billingAddress?.postalCode || "",
                    country: existingProfile.billingAddress?.country || "",
                },
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

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            billingAddress: {
                ...prev.billingAddress,
                [name]: value,
            },
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (formData.companyName && formData.companyName.length > 100) {
            errors.companyName = "Company name cannot exceed 100 characters";
        }

        if (formData.companyWebsite && !/^https?:\/\/.+/.test(formData.companyWebsite)) {
            errors.companyWebsite = "Please provide a valid website URL";
        }

        if (formData.billingContactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.billingContactEmail)) {
            errors.billingContactEmail = "Please provide a valid email address";
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
            if (isEditing) {
                await updateClientProfile(formData);
                success("Profile updated successfully!");
            } else {
                await completeClientProfile(formData);
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
                    ? "Update your company information"
                    : "Please provide your company details to get started"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                        Company Information
                    </h3>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            Company Name
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className={`w-full bg-[#1a1a1a] border ${validationErrors.companyName ? 'border-red-500' : 'border-gray-700'
                                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors`}
                            placeholder="Enter your company name"
                        />
                        {validationErrors.companyName && (
                            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {validationErrors.companyName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <Globe className="w-4 h-4 text-primary" />
                            Company Website
                        </label>
                        <input
                            type="url"
                            name="companyWebsite"
                            value={formData.companyWebsite}
                            onChange={handleChange}
                            className={`w-full bg-[#1a1a1a] border ${validationErrors.companyWebsite ? 'border-red-500' : 'border-gray-700'
                                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors`}
                            placeholder="https://example.com"
                        />
                        {validationErrors.companyWebsite && (
                            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {validationErrors.companyWebsite}
                            </p>
                        )}
                    </div>
                </div>

                {/* Billing Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                        Billing Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <User className="w-4 h-4 text-primary" />
                                Billing Contact Name
                            </label>
                            <input
                                type="text"
                                name="billingContactName"
                                value={formData.billingContactName}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Mail className="w-4 h-4 text-primary" />
                                Billing Contact Email
                            </label>
                            <input
                                type="email"
                                name="billingContactEmail"
                                value={formData.billingContactEmail}
                                onChange={handleChange}
                                className={`w-full bg-[#1a1a1a] border ${validationErrors.billingContactEmail ? 'border-red-500' : 'border-gray-700'
                                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors`}
                                placeholder="billing@example.com"
                            />
                            {validationErrors.billingContactEmail && (
                                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {validationErrors.billingContactEmail}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <MapPin className="w-4 h-4 text-primary" />
                            Billing Address
                        </label>

                        <input
                            type="text"
                            name="line1"
                            value={formData.billingAddress.line1}
                            onChange={handleAddressChange}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Address Line 1"
                        />

                        <input
                            type="text"
                            name="line2"
                            value={formData.billingAddress.line2}
                            onChange={handleAddressChange}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Address Line 2 (Optional)"
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="city"
                                value={formData.billingAddress.city}
                                onChange={handleAddressChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="City"
                            />

                            <input
                                type="text"
                                name="region"
                                value={formData.billingAddress.region}
                                onChange={handleAddressChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="State/Region"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.billingAddress.postalCode}
                                onChange={handleAddressChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Postal Code"
                            />

                            <input
                                type="text"
                                name="country"
                                value={formData.billingAddress.country}
                                onChange={handleAddressChange}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Country"
                            />
                        </div>
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
                        {loading ? "Saving..." : isEditing ? "Update Profile" : "Complete Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientProfileForm;