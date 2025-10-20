"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

// User Type Selection Popup
export function UserTypePopup({ isOpen, onClose, onSelect }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0f0f0f] rounded-2xl max-w-md w-full p-8 relative border border-[#1a1a1a]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
                <p className="text-gray-400 mb-8">Choose your account type</p>

                <div className="space-y-4">
                    <button
                        onClick={() => onSelect('consultant')}
                        className="w-full bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] hover:border-[#fc964c] rounded-xl p-6 transition-all group"
                    >
                        <div className="text-4xl mb-2">👔</div>
                        <h3 className="text-xl font-semibold mb-1 group-hover:text-[#fc964c] transition-colors">Consultant</h3>
                        <p className="text-sm text-gray-400">Offer your expertise and services</p>
                    </button>

                    <button
                        onClick={() => onSelect('client')}
                        className="w-full bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] hover:border-[#fc964c] rounded-xl p-6 transition-all group"
                    >
                        <div className="text-4xl mb-2">🎯</div>
                        <h3 className="text-xl font-semibold mb-1 group-hover:text-[#fc964c] transition-colors">Client</h3>
                        <p className="text-sm text-gray-400">Find and hire consultants</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Signup Form Component
export function SignupForm({ userType, onSignInClick, onBackClick }) {
    const { register: registerField, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const { register } = useAuth();
    const { success, error: showError } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await register({
                name: data.name,
                email: data.email,
                password: data.password,
                user_type: userType
            });

            success('Account created successfully! Please check your email to verify your account.');

            // Redirect to home after successful registration
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (err) {
            const errorMessage = err.message || 'Registration failed. Please try again.';
            showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <button
                        onClick={onBackClick}
                        disabled={isLoading}
                        className="mb-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                        ← Back to account type selection
                    </button>
                    <h2 className="text-3xl font-bold mb-2">
                        Sign Up as {userType === 'consultant' ? 'Consultant' : 'Client'}
                    </h2>
                    <p className="text-gray-400">Create your account</p>
                </div>

                <div className="bg-[#0f0f0f] rounded-2xl p-8 border border-[#1a1a1a]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                {...registerField('name', { required: 'Name is required' })}
                                disabled={isLoading}
                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 focus:outline-none focus:border-[#fc964c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                {...registerField('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                type="email"
                                disabled={isLoading}
                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 focus:outline-none focus:border-[#fc964c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <input
                                {...registerField('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                type="password"
                                disabled={isLoading}
                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 focus:outline-none focus:border-[#fc964c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#fc964c] hover:bg-[#fd8a35] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{' '}
                        <button
                            onClick={onSignInClick}
                            disabled={isLoading}
                            className="text-[#fc964c] hover:underline disabled:opacity-50"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}