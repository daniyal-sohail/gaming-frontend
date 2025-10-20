"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

// List of public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/why-choose", "/signin", "/signup", "/about", "/contact"];

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();

    // Check if the current path is in the public routes list
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname) ||
        PUBLIC_ROUTES.some(route => pathname.startsWith(route + "/"));

    // If route is public, show the content regardless of auth state
    if (isPublicRoute) {
        return <>{children}</>;
    }

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // If not authenticated and route is protected, show login required message
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Login Required</h1>
                <p className="text-lg mb-6">You must be logged in to access this page.</p>
                <Link
                    href="/login"
                    className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    // User is authenticated, show the protected content
    return <>{children}</>;
};

export default ProtectedRoute;