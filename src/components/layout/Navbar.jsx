"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, Settings, LogOut, Briefcase } from "lucide-react"; // ✅ using lucide-react
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

// Base navigation items
// const baseNavigation = [
//     {
//         name: "Why Us",
//         href: "/why-us",
//         dropdown: true,
//         items: [
//             { name: "Success Stories", href: "/success-stories" },
//             { name: "How it Works", href: "/how-it-works" },
//             { name: "Trust & Safety", href: "/trust-safety" },
//             { name: "Reviews", href: "/reviews" },
//         ],
//     },
//     { name: "Enterprise", href: "/enterprise" },
// ];

// Navigation items for consultants (show "Find Work" and "My Works")
const consultantNavigation = [
    { name: "Find Work", href: "/find-work" },
    { name: "My Works", href: "/consultants/teams" },
    { name: "Forum", href: "/forum" },
    // ...baseNavigation,
];

// Navigation items for clients (show "Find Talent")
const clientNavigation = [
    { name: "Find Talent", href: "/consultants" },
    { name: "My Teams", href: "/teams" },
    { name: "Forum", href: "/forum" },
    // ...baseNavigation,
];

// Navigation items for unauthenticated users (show both)
const guestNavigation = [
    { name: "Find Talent", href: "/find-talent" },
    { name: "Find Work", href: "/find-work" },
    { name: "Forum", href: "/forum" },
    // ...baseNavigation,
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const { user, isAuthenticated, logout, loading, userType } = useAuth();

    // Determine which navigation to show based on user type
    const getNavigation = () => {
        if (!isAuthenticated) {
            return guestNavigation;
        }

        if (userType === 'consultant') {
            return consultantNavigation;
        } else if (userType === 'client') {
            return clientNavigation;
        }

        // Default to guest navigation if user type is not recognized
        return guestNavigation;
    };

    const navigation = getNavigation();

    // Check if user exists in localStorage to prevent flash - do this synchronously
    const [hasStoredUser, setHasStoredUser] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem("user");
        }
        return false;
    });

    // Update hasStoredUser when user changes
    useEffect(() => {
        setHasStoredUser(!!user);
    }, [user]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownOpen && !event.target.closest('[data-user-dropdown]')) {
                setUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userDropdownOpen]);

    const handleLogout = async () => {
        try {
            await logout();
            setUserDropdownOpen(false);
            setMobileMenuOpen(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="fixed inset-x-0 top-0 z-50">
            {/* Glassy pill container */}
            <div
                className={[
                    "w-full",
                    "backdrop-blur-2xl",
                    "bg-white/95 border-b border-black/20",
                    "shadow-[inset_0_1px_0_0_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)]",
                    "transition-all duration-300 ease-in-out",
                    "supports-[backdrop-filter]:bg-white/95",
                ].join(" ")}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex h-16 sm:h-18 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="Interactive Gaming"
                                width={40}
                                height={40}
                                className="h-9 w-9 rounded-full"
                                priority
                            />
                            <span className="font-semibold text-black/90 tracking-tight">
                                Interactive Gaming
                            </span>
                        </Link>

                        {/* Desktop Nav - Center */}
                        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                            {navigation.map((item) =>
                                item.dropdown ? (
                                    <div key={item.name} className="relative group">
                                        <Link
                                            href={item.href}
                                            className="relative z-10 flex items-center gap-1 px-4 py-2 rounded-lg text-black/85 hover:text-black transition"
                                        >
                                            {item.name}
                                            <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
                                        </Link>

                                        {/* Dropdown */}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition">
                                            <div className="w-64 rounded-xl bg-white border border-black/20 shadow-xl overflow-hidden">
                                                {item.items.map((sub) => (
                                                    <Link
                                                        key={sub.name}
                                                        href={sub.href}
                                                        className="flex items-center gap-3 px-4 py-3 text-black/85 hover:bg-black/5 hover:text-black transition"
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-black/30" />
                                                        <span className="font-medium">{sub.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="px-4 py-2 rounded-lg text-black/85 hover:text-black hover:bg-black/5 transition"
                                    >
                                        {item.name}
                                    </Link>
                                )
                            )}
                        </div>

                        {/* Auth Buttons or User Profile - Right */}
                        <div className="hidden lg:flex items-center gap-3">
                            {loading ? (
                                /* Loading state - show skeleton for user profile */
                                <div className="flex items-center gap-3 px-4 py-2">
                                    <div className="h-8 w-8 rounded-full bg-black/10 animate-pulse"></div>
                                    <div className="h-4 w-20 bg-black/10 animate-pulse rounded"></div>
                                </div>
                            ) : isAuthenticated ? (
                                /* User Profile Dropdown */
                                <div className="relative" data-user-dropdown>
                                    <button
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-black/85 hover:text-black hover:bg-black/5 transition"
                                    >
                                        {/* User Avatar */}
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        {/* User Name */}
                                        <span className="font-medium">{user?.name || 'User'}</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {userDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-black/20 shadow-xl overflow-hidden z-50">
                                            {/* User Info Header */}
                                            <div className="px-4 py-3 border-b border-black/10">
                                                <div className="flex items-center gap-3">

                                                    <div>
                                                        <p className="font-medium text-black">{user?.name || 'User'}</p>
                                                        <p className="text-sm text-black/60">{user?.email}</p>
                                                        {userType && (
                                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-black/10 text-black/80 rounded-full mt-1">
                                                                {userType === 'consultant' ? 'Consultant' : userType === 'client' ? 'Client' : userType}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-3 px-4 py-3 text-black/85 hover:bg-black/5 hover:text-black transition"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                >
                                                    <User className="h-4 w-4" />
                                                    <span>Profile</span>
                                                </Link>
                                                <Link
                                                    href="/account"
                                                    className="flex items-center gap-3 px-4 py-3 text-black/85 hover:bg-black/5 hover:text-black transition"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                >
                                                    <User className="h-4 w-4" />
                                                    <span>Account</span>
                                                </Link>

                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-3 text-white/85 hover:bg-white/5 hover:text-white transition w-full text-left"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Login/Signup Buttons */
                                <>
                                    <Link
                                        href="/signin"
                                        className="px-4 py-2 rounded-lg text-black/85 hover:text-black hover:bg-black/5 transition"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="px-4 py-2 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 transition-all duration-200 text-sm"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden p-2 rounded-lg text-black/90 hover:bg-black/5 transition cursor-pointer"
                            onClick={() => setMobileMenuOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-black/10">
                        <div className="px-4 py-4 space-y-1">
                            {navigation.map((item) =>
                                item.dropdown ? (
                                    <div key={item.name} className="rounded-xl overflow-hidden">
                                        <div className="px-4 py-3 text-black/85 font-semibold">
                                            {item.name}
                                        </div>
                                        <div className="pl-2">
                                            {item.items.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="block px-4 py-2 rounded-lg text-black/80 hover:bg-black/5 hover:text-black transition"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block px-4 py-2 rounded-lg text-white/85 hover:bg-white/5 hover:text-white transition"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            )}

                            {/* Mobile Auth Buttons or User Profile */}
                            <div className="mt-3 space-y-2 px-4">
                                {loading ? (
                                    /* Mobile Loading state - show skeleton for user profile */
                                    <div className="px-4 py-3 border-b border-black/10 mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-black/10 animate-pulse"></div>
                                            <div>
                                                <div className="h-4 w-24 bg-black/10 animate-pulse rounded mb-2"></div>
                                                <div className="h-3 w-32 bg-black/10 animate-pulse rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : isAuthenticated ? (
                                    /* Mobile User Profile */
                                    <>
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-black/10 mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-semibold">
                                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-black">{user?.name || 'User'}</p>
                                                    <p className="text-sm text-black/60">{user?.email}</p>
                                                    {userType && (
                                                        <span className="inline-block px-2 py-1 text-xs font-medium bg-black/10 text-black/80 rounded-full mt-1">
                                                            {userType === 'consultant' ? 'Consultant' : userType === 'client' ? 'Client' : userType}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Menu Items */}
                                        <Link
                                            href="/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-black/85 hover:bg-black/5 hover:text-black transition"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-black/85 hover:bg-black/5 hover:text-black transition"
                                        >
                                            <Settings className="h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/85 hover:bg-white/5 hover:text-white transition w-full text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    /* Mobile Login/Signup Buttons */
                                    <>
                                        <Link
                                            href="/signin"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 rounded-lg text-white/85 hover:bg-white/5 hover:text-white transition"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full px-4 py-3 rounded-lg bg-cyan-500 text-white font-medium text-center hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
