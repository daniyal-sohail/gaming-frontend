"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { X, Mail, Phone, User, Calendar, Shield, Edit2, Check, AlertCircle } from "lucide-react";

export default function Setting() {
    const { profile, loading, error, fetchProfile, updateProfile } = useUser();
    const { user: authUser } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editSection, setEditSection] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                email: profile.email || "",
                bio: profile.bio || "",
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const openEditModal = (section) => {
        setEditSection(section);
        setIsEditModalOpen(true);
        setSaveError(null);
        setSaveSuccess(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditSection(null);
        setSaveError(null);
        setSaveSuccess(null);
        if (profile) {
            setFormData({
                name: profile.name || "",
                email: profile.email || "",
                bio: profile.bio || "",
            });
        }
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            // Only send fields that have changed
            const changedFields = {};

            if (formData.name !== profile?.name) {
                changedFields.name = formData.name;
            }
            if (formData.email !== profile?.email) {
                changedFields.email = formData.email;
            }

            if (formData.bio !== profile?.bio) {
                changedFields.bio = formData.bio;
            }

            // If no fields changed, don't make the API call
            if (Object.keys(changedFields).length === 0) {
                setSaveError("No changes detected");
                setSaveLoading(false);
                return;
            }

            const response = await updateProfile(changedFields);

            if (response.updates?.emailVerificationSent) {
                setSaveSuccess("Profile updated! Verification email sent to your new email address.");
            } else {
                setSaveSuccess("Profile updated successfully!");
            }

            setTimeout(() => {
                closeEditModal();
            }, 2000);
        } catch (err) {
            setSaveError(err.message || "Failed to update profile");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        setSaveError(null);
        setSaveSuccess(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setSaveError("New passwords do not match");
            setSaveLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setSaveError("Password must be at least 6 characters");
            setSaveLoading(false);
            return;
        }

        try {
            const response = await updateProfile({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            setSaveSuccess("Password changed successfully!");

            setTimeout(() => {
                closeEditModal();
            }, 2000);
        } catch (err) {
            setSaveError(err.message || "Failed to change password");
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
                    <p className="text-gray-400">Manage your profile and account preferences</p>
                </div>

                {/* Global Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Profile Header Card */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-gray-800 rounded-2xl overflow-hidden mb-6 shadow-2xl">
                    <div className="h-32 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20"></div>
                    <div className="px-8 pb-8">
                        <div className="flex items-end -mt-16 mb-6">
                            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl ring-4 ring-[#121212]">
                                {getInitials(profile?.name || authUser?.name)}
                            </div>
                            <div className="ml-6 mb-4">
                                <h2 className="text-3xl font-bold text-white mb-1">
                                    {profile?.name || "User"}
                                </h2>
                                <p className="text-gray-400 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {profile?.email || "No email"}
                                </p>
                                {profile?.isVerified && (
                                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                                        <Check className="w-4 h-4" />
                                        Verified Account
                                    </div>
                                )}
                            </div>
                        </div>

                        {profile?.bio && (
                            <div className="mt-4 p-4 bg-[#0d0d0d] rounded-xl border border-gray-800">
                                <p className="text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information Card */}
                    <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-[#121212]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                            </div>
                            <button
                                onClick={() => openEditModal("profile")}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <InfoRow icon={<User className="w-5 h-5" />} label="Full Name" value={profile?.name} />
                            <InfoRow icon={<Mail className="w-5 h-5" />} label="Email" value={profile?.email} />
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-[#121212]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Security</h3>
                            </div>
                            {profile?.oauthProvider === "local" && (
                                <button
                                    onClick={() => openEditModal("password")}
                                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-all hover:scale-105 flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Change
                                </button>
                            )}
                        </div>
                        <div className="p-6 space-y-4">
                            <InfoRow
                                icon={<Shield className="w-5 h-5" />}
                                label="Password"
                                value={profile?.oauthProvider === "local" ? "••••••••" : "OAuth Login"}
                            />
                            <InfoRow
                                icon={<Shield className="w-5 h-5" />}
                                label="Login Method"
                                value={profile?.oauthProvider || "Local"}
                            />
                            <InfoRow
                                icon={<Calendar className="w-5 h-5" />}
                                label="Member Since"
                                value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : "N/A"}
                            />
                        </div>
                    </div>
                </div>

                {/* Account Details Card */}
                <div className="mt-6 bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="px-6 py-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-[#121212]">
                        <h3 className="text-lg font-semibold text-white">Account Details</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-[#0d0d0d] rounded-xl border border-gray-800">
                                <p className="text-gray-400 text-sm mb-1">Account ID</p>
                                <p className="text-white font-mono text-sm">{profile?.id || authUser?.id || "N/A"}</p>
                            </div>
                            <div className="p-4 bg-[#0d0d0d] rounded-xl border border-gray-800">
                                <p className="text-gray-400 text-sm mb-1">Status</p>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    Active
                                </span>
                            </div>
                            <div className="p-4 bg-[#0d0d0d] rounded-xl border border-gray-800">
                                <p className="text-gray-400 text-sm mb-1">Verification</p>
                                {profile?.isVerified ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                                        <Check className="w-3 h-3" />
                                        Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-400 rounded-full">
                                        <AlertCircle className="w-3 h-3" />
                                        Unverified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 transition-opacity bg-black/80 backdrop-blur-sm"
                            onClick={closeEditModal}
                        ></div>

                        {/* Modal Panel */}
                        <div className="inline-block align-bottom bg-[#121212] rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-800 relative z-10">
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-[#121212]">
                                <h3 className="text-xl font-semibold text-white">
                                    {editSection === "profile" ? "Edit Profile" : "Change Password"}
                                </h3>
                                <button
                                    onClick={closeEditModal}
                                    className="w-8 h-8 rounded-lg hover:bg-gray-800 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Messages */}
                            {saveSuccess && (
                                <div className="mx-6 mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-green-400 text-sm">{saveSuccess}</p>
                                </div>
                            )}

                            {saveError && (
                                <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-red-400 text-sm">{saveError}</p>
                                </div>
                            )}

                            {/* Form Content */}
                            {editSection === "profile" ? (
                                <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="Enter your email"
                                        />
                                        <p className="mt-2 text-xs text-gray-400">
                                            Changing your email will require verification
                                        </p>
                                    </div>



                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                            placeholder="Tell us about yourself"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={saveLoading}
                                            className="flex-1 px-6 py-3 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeEditModal}
                                            disabled={saveLoading}
                                            className="flex-1 px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleSavePassword} className="p-6 space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                            placeholder="Enter current password"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                            placeholder="Enter new password"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={saveLoading}
                                            className="flex-1 px-6 py-3 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {saveLoading ? "Changing..." : "Change Password"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeEditModal}
                                            disabled={saveLoading}
                                            className="flex-1 px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Info Row Component
function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#0d0d0d] transition-colors">
            <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400 mb-1">{label}</p>
                <p className="text-white font-medium truncate">{value || "Not provided"}</p>
            </div>
        </div>
    );
}