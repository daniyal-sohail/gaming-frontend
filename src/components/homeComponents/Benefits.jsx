"use client";
import React from 'react';
import { Clock, Briefcase, Shield, CheckCircle, Star, Users, Zap, Award, Globe, Lock } from 'lucide-react';
import Title from '@/common/Title';
import Heading from '@/common/Heading';

const Benefits = () => {
    const serviceTypes = [
        {
            title: "Game Development",
            icon: Clock,
            color: "amber",
            description: "Complete game development from concept to launch with cutting-edge technology",
            features: [
                "Custom game mechanics",
                "Cross-platform compatibility",
                "Performance optimization",
                "Real-time multiplayer",
                "Advanced graphics rendering"
            ],
            highlight: "End-to-end game creation"
        },
        {
            title: "Interactive Design",
            icon: Briefcase,
            color: "orange",
            description: "Immersive user experiences and stunning visual design for gaming platforms",
            features: [
                "UI/UX for gaming interfaces",
                "Character and asset design",
                "Animation and effects",
                "Interactive prototyping",
                "Brand identity design"
            ],
            highlight: "Visual excellence guaranteed"
        },
        {
            title: "Technical Consulting",
            icon: Shield,
            color: "gold",
            description: "Expert technical guidance and architecture planning for gaming projects",
            features: [
                "Technology stack selection",
                "Performance optimization",
                "Security implementation",
                "Scalability planning",
                "Code review and auditing"
            ],
            highlight: "Expert technical guidance"
        }
    ];



    const getColorClasses = (color) => {
        const colorMap = {
            amber: {
                bg: "bg-amber-500/20",
                text: "text-amber-400",
                border: "border-amber-500/30",
                icon: "text-amber-400"
            },
            orange: {
                bg: "bg-orange-500/20",
                text: "text-orange-400",
                border: "border-orange-500/30",
                icon: "text-orange-400"
            },
            gold: {
                bg: "bg-yellow-500/20",
                text: "text-yellow-400",
                border: "border-yellow-500/30",
                icon: "text-yellow-400"
            }
        };
        return colorMap[color] || colorMap.amber;
    };

    return (
        <section className="bg-black text-white py-12 max-w-6xl mx-auto">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="mb-6">
                        <Title title="Our Gaming Solutions" />
                    </div>

                    <div className="mb-8">
                        <Heading
                            headOne="Comprehensive"
                            headTwo="Gaming Services"
                            headThree="for Every Need"
                        />
                    </div>

                    <p className="text-white/70 text-lg leading-relaxed max-w-3xl mx-auto">
                        From game development to interactive design, we provide complete gaming solutions
                        tailored to bring your vision to life with cutting-edge technology.
                    </p>
                </div>

                {/* Service Types Benefits */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {serviceTypes.map((service, index) => {
                        const IconComponent = service.icon;
                        const colors = getColorClasses(service.color);

                        return (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 group"
                            >
                                {/* Service Header */}
                                <div className="mb-6">
                                    <div className={`w-16 h-16 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className={`w-8 h-8 ${colors.icon}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-white/70 text-base leading-relaxed mb-4">
                                        {service.description}
                                    </p>
                                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                                        {service.highlight}
                                    </div>
                                </div>

                                {/* Features List */}
                                <div className="space-y-3">
                                    {service.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-start space-x-3">
                                            <CheckCircle className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                                            <span className="text-white/80 text-sm leading-relaxed">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>



            </div>
        </section>
    );
};

export default Benefits;