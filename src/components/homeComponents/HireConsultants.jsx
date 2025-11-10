"use client";
import React from 'react';
import { MapPin, Calendar, Globe, Trophy } from 'lucide-react';
import Title from '@/common/Title';
import Heading from '@/common/Heading';

const HireConsultants = () => {
    const consultant = {
        name: "Virat Kohli",
        avatar: "/img.jpeg",
        title: "Web Developer",
        expertise: "AI Expert",
        skills: [
            { name: "Docker", type: "primary" },
            { name: "Express.js", type: "primary" },
            { name: "JavaScript", type: "primary" },
            { name: "Node.js", type: "primary" },
            { name: "D3.js", type: "secondary" },
            { name: "Python", type: "secondary" },
            { name: "Prompt Engineering", type: "secondary" }
        ],
        stats: {
            wins: 60,
            location: "Vienna, Austria",
            memberSince: "Jan 2010",
            languages: ["English"]
        }
    };

    const getSkillStyle = (type) => {
        return type === 'primary'
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-black/10 text-black/70 border border-black/20";
    };

    return (
        <section className="bg-white text-black py-20  max-w-6xl mx-auto">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side - Header */}
                    <div>
                        <div className="mb-6">
                            <Title title="Expert Consultants" />
                        </div>

                        <div className="mb-8">
                            <Heading
                                headOne="Hire Top Tier"
                                headTwo="Consultants"
                                headThree=""
                                align="left"
                            />
                        </div>

                        <p className="text-black/70 text-lg leading-relaxed mb-8">
                            Connect with elite consultants who bring years of expertise and proven track records.
                            Our vetted professionals are ready to take your projects to the next level.
                        </p>

                        <div className="flex items-center space-x-6 text-black/60">
                            <div className="flex items-center space-x-2">
                                <Trophy className="w-5 h-5 text-cyan-500" />
                                <span className="text-sm">Top 1% Talent</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Globe className="w-5 h-5 text-cyan-500" />
                                <span className="text-sm">Global Network</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Consultant Card */}
                    <div className="lg:flex lg:justify-end">
                        <div className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-6 hover:bg-black/10 hover:border-black/20 hover:shadow-[inset_0_1px_0_0_rgba(0,0,0,0.1),0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 max-w-sm w-full">
                            {/* Header with Avatar and Basic Info */}
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="relative">
                                    <img
                                        src={consultant.avatar}
                                        alt={consultant.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-black/20"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-black mb-1">
                                        {consultant.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                                            {consultant.title}
                                        </span>
                                        <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                                            {consultant.expertise}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {consultant.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className={`text-xs px-3 py-1 rounded-full ${getSkillStyle(skill.type)}`}
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 text-black/80">
                                    <Trophy className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                    <span className="text-sm">{consultant.stats.wins} wins</span>
                                </div>

                                <div className="flex items-center space-x-3 text-black/80">
                                    <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                    <span className="text-sm">{consultant.stats.location}</span>
                                </div>

                                <div className="flex items-center space-x-3 text-black/80">
                                    <Calendar className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                    <span className="text-sm">Member Since {consultant.stats.memberSince}</span>
                                </div>

                                <div className="flex items-center space-x-3 text-black/80">
                                    <Globe className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                    <span className="text-sm">Speaks {consultant.stats.languages.join(", ")}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6 pt-4 border-t border-black/10">
                                <button className="w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 cursor-pointer bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HireConsultants;