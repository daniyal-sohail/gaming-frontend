'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useState } from 'react';

export function SignInForm({ onSignUpClick }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const { login } = useAuth();
    const { success, error: showError } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await login({
                email: data.email,
                password: data.password
            });

            success('Login successful! Welcome back.');

            // Redirect to home after successful login
            setTimeout(() => {
                router.push('/');
            }, 500);
        } catch (err) {
            const errorMessage = err.message || 'Login failed. Please check your credentials.';
            showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-black">Welcome Back</h2>
                    <p className="text-gray-600">Login to your account</p>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-black">Email</label>
                            <input
                                {...register('email', {
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
                                {...register('password', { required: 'Password is required' })}
                                type="password"
                                disabled={isLoading}
                                className="w-full bg-white border border-black/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your password"
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
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don't have an account?{' '}
                        <button
                            onClick={onSignUpClick}
                            disabled={isLoading}
                            className="text-cyan-500 hover:underline disabled:opacity-50"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}