"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react"; // ✅ using lucide-react
import Link from "next/link";
import Image from "next/image";

const navigation = [
    { name: "Find Talent", href: "/find-talent" },
    { name: "Find Work", href: "/find-work" },
    {
        name: "Why Us",
        href: "/why-us",
        dropdown: true,
        items: [
            { name: "Success Stories", href: "/success-stories" },
            { name: "How it Works", href: "/how-it-works" },
            { name: "Trust & Safety", href: "/trust-safety" },
            { name: "Reviews", href: "/reviews" },
        ],
    },
    { name: "Enterprise", href: "/enterprise" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav className="fixed inset-x-0 top-0 z-50">
            {/* Glassy pill container */}
            <div
                className={[
                    "mx-auto mt-6 w-[95%] max-w-6xl",
                    "backdrop-blur-2xl",
                    scrolled || mobileMenuOpen
                        ? "bg-black/20 border-white/20"
                        : "bg-black/90 border-black/10",
                    "rounded-2xl",
                    "border",
                    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.4)]",
                    "transition-all duration-500 ease-in-out",
                    "supports-[backdrop-filter]:bg-white/5",
                ].join(" ")}
            >
                <div className="px-4 sm:px-6">
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
                            <span className="font-semibold text-white/90 tracking-tight">
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
                                            className="relative z-10 flex items-center gap-1 px-4 py-2 rounded-lg text-white/85 hover:text-white transition"
                                        >
                                            {item.name}
                                            <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
                                        </Link>

                                        {/* Dropdown */}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition">
                                            <div className="w-64 rounded-xl bg-black border border-white/20 shadow-xl overflow-hidden">
                                                {item.items.map((sub) => (
                                                    <Link
                                                        key={sub.name}
                                                        href={sub.href}
                                                        className="flex items-center gap-3 px-4 py-3 text-white/85 hover:bg-white/5 hover:text-white transition"
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
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
                                        className="px-4 py-2 rounded-lg text-white/85 hover:text-white hover:bg-white/5 transition"
                                    >
                                        {item.name}
                                    </Link>
                                )
                            )}
                        </div>

                        {/* Auth Buttons - Right */}
                        <div className="hidden lg:flex items-center gap-3">
                            {/* Login - transparent like other nav links */}
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg text-white/85 hover:text-white hover:bg-white/5 transition"
                            >
                                Login
                            </Link>

                            {/* Signup - primary button */}
                            <Link
                                href="/signup"
                                className="px-4 py-2 rounded-lg bg-black/80 text-white font-medium hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all duration-200 text-sm"
                            >
                                Sign Up
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden p-2 rounded-lg text-white/90 hover:bg-white/5 transition cursor-pointer"
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
                    <div className="lg:hidden border-t border-white/10">
                        <div className="px-4 py-4 space-y-1">
                            {navigation.map((item) =>
                                item.dropdown ? (
                                    <div key={item.name} className="rounded-xl overflow-hidden">
                                        <div className="px-4 py-3 text-white/85 font-semibold">
                                            {item.name}
                                        </div>
                                        <div className="pl-2">
                                            {item.items.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="block px-4 py-2 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition"
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

                            {/* Mobile Auth Buttons */}
                            <div className="mt-3 space-y-2 px-4">
                                {/* Login - simple like other nav links */}
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-2 rounded-lg text-white/85 hover:bg-white/5 hover:text-white transition"
                                >
                                    Login
                                </Link>

                                {/* Signup - primary button */}
                                <Link
                                    href="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full px-4 py-3 rounded-lg bg-black/80 text-white font-medium text-center hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
