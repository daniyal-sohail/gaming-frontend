import React from 'react';
import {
    Code,
    Palette,
    Bot,
    Handshake,
    PenTool,
    User,
    Building,
    Scale,
    Users,
    Wrench
} from 'lucide-react';
import Title from '@/common/Title';
import Heading from '@/common/Heading';

const HomeServices = () => {
    const services = [
        {
            icon: <Code className="w-8 h-8" />,
            title: "Development &",
            subtitle: "IT"
        },
        {
            icon: <Palette className="w-8 h-8" />,
            title: "Design &",
            subtitle: "Creative"
        },
        {
            icon: <Bot className="w-8 h-8" />,
            title: "AI Services",
            subtitle: ""
        },
        {
            icon: <Handshake className="w-8 h-8" />,
            title: "Sales &",
            subtitle: "Marketing"
        },
        {
            icon: <PenTool className="w-8 h-8" />,
            title: "Writing &",
            subtitle: "Translation"
        },
        {
            icon: <User className="w-8 h-8" />,
            title: "Admin &",
            subtitle: "Support"
        },
        {
            icon: <Building className="w-8 h-8" />,
            title: "Finance &",
            subtitle: "Accounting"
        },
        {
            icon: <Scale className="w-8 h-8" />,
            title: "Legal",
            subtitle: ""
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "HR & Training",
            subtitle: ""
        },
        {
            icon: <Wrench className="w-8 h-8" />,
            title: "Engineering &",
            subtitle: "Architecture"
        }
    ];

    return (
        <section className="bg-black text-white py-20 max-w-6xl mx-auto">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header - Left Aligned */}
                <div className="mb-16 text-left">
                    {/* Title Component */}
                    <div className="mb-6">
                        <Title title="Our Services" />
                    </div>

                    {/* Main Heading */}
                    <Heading headOne="Expert Solutions for" headTwo="Interactive Gaming" headThree="" align="left" />

                    {/* Description */}
                    <p className="text-xl text-white/70 mt-4 max-w-2xl">
                        From development to design, we provide comprehensive services to bring your gaming ideas to life.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                        >
                            {/* Icon */}
                            <div className="text-[#fc964c] mb-6 group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>

                            {/* Text */}
                            <div>
                                <h3 className="text-xl font-semibold text-white leading-tight">
                                    {service.title}
                                </h3>
                                {service.subtitle && (
                                    <h3 className="text-xl font-semibold text-white leading-tight">
                                        {service.subtitle}
                                    </h3>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeServices;