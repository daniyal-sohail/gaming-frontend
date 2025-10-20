"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { Loader2 } from "lucide-react";
import ClientProfileForm from "@/components/profileComponents/ClientProfileForm";
import ConsultantProfileForm from "@/components/profileComponents/ConsultantProfileForm";
import ProfileDisplay from "@/components/profileComponents/ProfileDisplay";

const ProfilePage = () => {
    const { userType } = useAuth();
    const { clientProfile, consultantProfile, loading, fetchProfile } = useOnboarding();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const profile = userType === "client" ? clientProfile : consultantProfile;

    // Check if profile has actual data (not just an empty object)
    const hasProfile = profile && profile !== null && (
        (userType === "client" && profile.companyName) ||
        (userType === "consultant" && profile.headline)
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Show form if no profile exists or user is editing
    if (!hasProfile || isEditing) {
        return (
            <div className="min-h-screen bg-background py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {userType === "client" ? (
                        <ClientProfileForm
                            existingProfile={hasProfile ? profile : null}
                            isEditing={isEditing && hasProfile}
                            onCancel={() => setIsEditing(false)}
                            onSuccess={() => {
                                setIsEditing(false);
                                fetchProfile();
                            }}
                        />
                    ) : (
                        <ConsultantProfileForm
                            existingProfile={hasProfile ? profile : null}
                            isEditing={isEditing && hasProfile}
                            onCancel={() => setIsEditing(false)}
                            onSuccess={() => {
                                setIsEditing(false);
                                fetchProfile();
                            }}
                        />
                    )}
                </div>
            </div>
        );
    }

    // Show profile display
    return (
        <div className="min-h-screen bg-background py-8 px-4 mt-32">
            <div className="max-w-4xl mx-auto">
                <ProfileDisplay
                    profile={profile}
                    userType={userType}
                    onEdit={() => setIsEditing(true)}
                />
            </div>
        </div>
    );
};

export default ProfilePage;