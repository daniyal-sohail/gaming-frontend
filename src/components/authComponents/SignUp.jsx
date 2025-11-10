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
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 relative border border-black/10 shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-2 text-black">Sign Up</h2>
                <p className="text-gray-600 mb-8">Choose your account type</p>

                <div className="space-y-4">
                    <button
                        onClick={() => onSelect('consultant')}
                        className="w-full bg-white hover:bg-black/5 border border-black/20 hover:border-cyan-500 rounded-xl p-6 transition-all group"
                    >
                        <div className="text-4xl mb-2">👔</div>
                        <h3 className="text-xl font-semibold mb-1 text-black group-hover:text-cyan-500 transition-colors">Consultant</h3>
                        <p className="text-sm text-gray-600">Offer your expertise and services</p>
                    </button>

                    <button
                        onClick={() => onSelect('client')}
                        className="w-full bg-white hover:bg-black/5 border border-black/20 hover:border-cyan-500 rounded-xl p-6 transition-all group"
                    >
                        <div className="text-4xl mb-2">🎯</div>
                        <h3 className="text-xl font-semibold mb-1 text-black group-hover:text-cyan-500 transition-colors">Client</h3>
                        <p className="text-sm text-gray-600">Find and hire consultants</p>
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <button
                        onClick={onBackClick}
                        disabled={isLoading}
                        className="mb-4 text-gray-600 hover:text-black transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                        ← Back to account type selection
                    </button>
                    <h2 className="text-3xl font-bold mb-2 text-black">
                        Sign Up as {userType === 'consultant' ? 'Consultant' : 'Client'}
                    </h2>
                    <p className="text-gray-600">Create your account</p>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-black">Name</label>
                            <input
                                {...registerField('name', { required: 'Name is required' })}
                                disabled={isLoading}
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-black">Email</label>
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
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-black">Password</label>
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
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{' '}
                        <button
                            onClick={onSignInClick}
                            disabled={isLoading}
                            className="text-cyan-500 hover:underline disabled:opacity-50"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}