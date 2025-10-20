'use client';

import { SignInForm } from '@/components/authComponents/SignIn';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const router = useRouter();

    const handleSignUpClick = () => {
        router.push('/signup');
    };

    return (
        <div className="min-h-screen bg-black">
            <SignInForm onSignUpClick={handleSignUpClick} />
        </div>
    );
}

