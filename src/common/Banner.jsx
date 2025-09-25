import React from 'react';

const Banner = () => {
    return (
        <section className="bg-black py-20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 md:p-12 text-center overflow-hidden">
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/10 rounded-2xl"></div>

                    {/* Content */}
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-snug max-w-4xl mx-auto">
                            Ready to Build Your Next Gaming Experience?
                        </h2>

                        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                            Connect with expert developers and designers to bring your interactive gaming vision to life
                        </p>

                        <button className="bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-base cursor-pointer">
                            Start Your Project
                        </button>
                    </div>

                    {/* Clean decorative circles */}
                    <div className="absolute top-4 right-8 w-16 h-16 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-12 bg-white/10 rounded-full"></div>
                    <div className="absolute top-1/2 right-4 w-8 h-8 bg-white/5 rounded-full"></div>
                </div>
            </div>
        </section>
    );
};

export default Banner;