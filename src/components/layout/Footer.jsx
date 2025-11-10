import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white text-black border-t border-black/10">
            <div className="max-w-6xl mx-auto px-5 py-15">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-8 md:gap-0 items-start">
                    {/* For Clients Column */}
                    <div className="md:col-span-1 px-0 md:px-2">
                        <h3 className="text-2xl font-semibold mb-7 tracking-tight">For Clients</h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="/hire-freelancers"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Hire Freelancers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/post-project"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Post a Project
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/browse-teams"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Browse Teams
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-30 bg-gradient-to-b from-transparent via-black/20 to-transparent mx-auto mt-5"></div>

                    {/* For Freelancers Column */}
                    <div className="md:col-span-1 px-0 md:px-2">
                        <h3 className="text-2xl font-semibold mb-7 tracking-tight">For Freelancers</h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="/find-work"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Find Work
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/create-profile"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Create Profile
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/join-team"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Join a Team
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/success-stories"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Success Stories
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-30 bg-gradient-to-b from-transparent via-black/20 to-transparent mx-auto mt-5"></div>

                    {/* Company Column */}
                    <div className="md:col-span-1 px-0 md:px-2">
                        <h3 className="text-2xl font-semibold mb-7 tracking-tight">Company</h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="/about"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/careers"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-30 bg-gradient-to-b from-transparent via-black/20 to-transparent mx-auto mt-5"></div>

                    {/* Legal Column */}
                    <div className="md:col-span-1 px-0 md:px-2">
                        <h3 className="text-2xl font-semibold mb-7 tracking-tight">Legal</h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="/terms"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Terms & conditions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/privacy"
                                    className="text-black/70 hover:text-cyan-500 transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    Privacy policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-15 pt-5 border-t border-black/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-black/60">
                        <span>© 2025, Interactive Gaming Inc.</span>
                        <span>Connecting Talent with Opportunity</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;