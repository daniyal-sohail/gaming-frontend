'use client';

import { useState } from 'react';
import { UserTypePopup, SignupForm } from '@/components/authComponents/SignUp';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const [showUserTypePopup, setShowUserTypePopup] = useState(true);
    const [userType, setUserType] = useState(null);
    const router = useRouter();

    const handleUserTypeSelect = (type) => {
        setUserType(type);
        setShowUserTypePopup(false);
    };

    const handleSignInClick = () => {
        router.push('/signin');
    };

    const handleBackToUserType = () => {
        setShowUserTypePopup(true);
        setUserType(null);
    };

    return (
        <div className="min-h-screen bg-black">
            <UserTypePopup
                isOpen={showUserTypePopup}
                onClose={() => router.push('/')}
                onSelect={handleUserTypeSelect}
            />

            {userType && (
                <SignupForm
                    userType={userType}
                    onSignInClick={handleSignInClick}
                    onBackClick={handleBackToUserType}
                />
            )}
        </div>
    );
}

