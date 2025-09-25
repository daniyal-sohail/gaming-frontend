"use client";
import Button from "@/components/ui/moving-border";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/cn";

const HomeHero = () => {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center bg-black  overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <Spotlight fill="#f59e0b" />
            </div>
            {/* Grid background pattern */}
            <div
                className={cn(
                    "absolute inset-0 w-full h-full z-[1]",
                    "bg-[size:60px_60px]",
                    "bg-[linear-gradient(to_right,rgba(252,150,76,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(252,150,76,0.1)_1px,transparent_1px)]",
                    "opacity-30 pointer-events-none"
                )}
            />

            {/* Theme color blur - top right (positioned from section edge) */}
            <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-bl from-amber-500/30 via-orange-500/20 to-transparent rounded-full blur-3xl z-0"></div>

            {/* Additional smaller blur for depth */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-bl from-amber-400/40 via-orange-400/30 to-transparent rounded-full blur-2xl z-0"></div>

            <div className="w-full px-4 sm:px-6 lg:px-8 py-20 relative z-10">

                {/* Spotlight positioned absolutely */}

                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Main content container - centered */}
                    <div className="flex flex-col items-center justify-center text-center space-y-4 mt-18">

                        {/* Title badge */}
                        <div className="inline-flex items-center px-4 py-2 cursor-pointer rounded-full border border-[#fc964c] bg-[#fc964c]/10 backdrop-blur-sm">
                            <span className="text-sm font-light text-[#fff]">
                                The Future of Freelancing
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                            Connect with{" "}
                            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                                Expert Teams
                            </span>
                            {" "}or Find Your Next Project
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                            The ultimate platform where clients discover skilled freelancer teams and talented professionals find their next big opportunity.
                        </p>

                        {/* CTA button */}
                        <div className="flex justify-center lg:justify-start 
                            pt-4">
                            <Button
                                borderRadius=".75rem"
                                className="bg-[#141414] text-white"
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;