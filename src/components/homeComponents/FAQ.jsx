"use client";
import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import Title from '@/common/Title';
import Heading from '@/common/Heading';

const FAQ = () => {
    const [expandedItem, setExpandedItem] = useState(null);

    const faqData = [
        {
            question: "How does the platform work for clients?",
            answer: "Clients can browse through vetted freelancer teams, review portfolios, and post project requirements. Our platform makes it easy to connect with skilled professionals who match your specific needs, whether you need a single expert or an entire team."
        },
        {
            question: "How do freelancers get started on the platform?",
            answer: "Freelancers can create detailed profiles showcasing their skills, experience, and portfolio. Once approved, they can browse available projects, submit proposals, and build their reputation through successful project completions and client reviews."
        },
        {
            question: "What types of projects are available?",
            answer: "Our platform features diverse projects ranging from web development, mobile apps, design, marketing, writing, and more. Projects vary from short-term tasks to long-term collaborations, accommodating different skill levels and expertise areas."
        },
        {
            question: "How do I find the right freelancer for my project?",
            answer: "Use our advanced search filters to find freelancers by skills, experience level, location, and ratings. You can review portfolios, read client feedback, and interview candidates before making your decision. Our matching system also suggests suitable freelancers based on your project requirements."
        },
        {
            question: "What support do you provide during projects?",
            answer: "We offer comprehensive project support including dispute resolution, communication tools, project tracking, and dedicated customer service. Our team is available to help resolve any issues and ensure successful project completion."
        }
    ];

    const toggleExpanded = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

    return (
        <section className="bg-white text-black py-12 max-w-6xl mx-auto">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Side - FAQ Header */}
                    <div className="lg:sticky lg:top-20 lg:self-start">
                        <div className="mb-8">
                            {/* Title Component */}
                            <div className="mb-6">
                                <Title title="Frequently Asked Questions" />
                            </div>

                            {/* Main Heading */}
                            <div className="mb-8">
                                <Heading headOne="Got" headTwo="Questions?" headThree="" align="left" />
                            </div>

                            {/* Description */}
                            <p className="text-black/70 text-lg leading-relaxed">
                                Everything you need to know about our freelancing platform, from getting started to project completion.
                                Still have questions? We're here to help!
                            </p>
                        </div>
                    </div>

                    {/* Right Side - FAQ Items */}
                    <div className="space-y-4">
                        {faqData.map((item, index) => (
                            <div
                                key={index}
                                className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl overflow-hidden hover:bg-black/10 hover:border-black/20 hover:shadow-[inset_0_1px_0_0_rgba(0,0,0,0.1),0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 group"
                            >
                                <button
                                    onClick={() => toggleExpanded(index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-black/5 transition-colors duration-200 cursor-pointer"
                                >
                                    <div className="flex items-center space-x-4">
                                        <ArrowUpRight className="w-5 h-5 text-cyan-500 flex-shrink-0 group-hover:text-cyan-400 transition-colors duration-200" />
                                        <h3 className="text-xl font-semibold text-black">
                                            {item.question}
                                        </h3>
                                    </div>
                                    <div className="flex-shrink-0 ml-4">
                                        {expandedItem === index ? (
                                            <ChevronUp className="w-6 h-6 text-cyan-500 group-hover:text-cyan-400 transition-colors duration-200" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6 text-cyan-500 group-hover:text-cyan-400 transition-colors duration-200" />
                                        )}
                                    </div>
                                </button>

                                {/* Expandable Answer */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedItem === index
                                        ? 'max-h-96 opacity-100'
                                        : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-8 pb-6">
                                        <div className="pl-9">
                                            <p className="text-gray-700 text-base leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;