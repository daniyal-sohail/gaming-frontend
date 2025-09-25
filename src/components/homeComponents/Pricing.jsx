import React from 'react';
import { Check } from 'lucide-react';
import Title from '@/common/Title';
import Heading from '@/common/Heading';

const Pricing = () => {
    const pricingTiers = [
        {
            name: "STARTER",
            fee: "Free to join",
            description: "Perfect for freelancers getting started and small projects",
            features: [
                "Create your professional profile",
                "Browse and apply to projects",
                "Basic project management tools",
                "Standard customer support",
                "Access to community resources"
            ],
            buttonText: "Start for free",
            buttonStyle: "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5",
            popular: false
        },
        {
            name: "PROFESSIONAL",
            fee: "$29/month",
            description: "For experienced freelancers and growing teams",
            features: [
                "Priority in search results",
                "Advanced portfolio showcase",
                "Team collaboration features",
                "Priority customer support",
                "Analytics and insights dashboard"
            ],
            buttonText: "Go Professional",
            buttonStyle: "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5",
            popular: true
        },
        {
            name: "TEAM",
            fee: "$99/month",
            description: "For agencies and large freelancer teams",
            features: [
                "Unlimited team members",
                "Advanced project management",
                "White-label client portal",
                "Dedicated account manager",
                "Custom integrations available"
            ],
            buttonText: "Contact sales",
            buttonStyle: "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5",
            popular: false
        }
    ];

    return (
        <section className="bg-black text-white py-20 max-w-6xl mx-auto">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header - Centered */}
                <div className="text-center mb-16">
                    {/* Title Component */}
                    <div className="mb-6 flex justify-center">
                        <Title title="Pricing Plans" />
                    </div>

                    {/* Main Heading */}
                    <Heading headOne="Choose Your" headTwo="Plan" headThree="" />

                    {/* Description */}
                    <p className="text-xl text-white/70 mt-4 max-w-2xl mx-auto">
                        Choose the perfect plan for your freelancing career or team. Start free and upgrade as you grow.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingTiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 ${tier.popular ? 'border-white/20' : 'border-white/10'
                                }`}
                        >
                            {/* Popular Badge */}
                            {tier.popular && (
                                <div className="absolute top-6 right-6">
                                    <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium px-4 py-2 rounded-full">
                                        Popular
                                    </span>
                                </div>
                            )}

                            {/* Tier Name */}
                            <div className="mb-6">
                                <p className="text-gray-400 text-sm font-medium tracking-wider uppercase mb-2">
                                    {tier.name}
                                </p>
                                <h3 className="text-2xl font-bold text-white">
                                    {tier.fee}
                                </h3>
                            </div>

                            {/* Description */}
                            <p className="text-gray-400 text-base leading-relaxed mb-8">
                                {tier.description}
                            </p>

                            {/* Features */}
                            <div className="mb-10">
                                <ul className="space-y-4">
                                    {tier.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start space-x-3">
                                            <Check className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-300 text-base leading-relaxed">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA Button */}
                            <button
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 cursor-pointer ${tier.buttonStyle}`}
                            >
                                {tier.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;