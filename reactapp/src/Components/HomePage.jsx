/**
 * HomePage Component
 * This is the landing page for all authenticated users.
 * It features a full-screen hero with a background image and a contact section.
 * Note: The navbar is handled at the App.jsx layout level.
 */

import React from 'react';
import { useTheme } from '../hooks/useTheme';
import DashboardCharts from './DashboardCharts';

const HomePage = () => {
    const { theme } = useTheme();
    const getRootClass = () => {
        if (theme === 'osmo') return "h-full w-full overflow-hidden flex flex-col bg-[#fafafa] page-transition";
        if (theme === 'gravity') return "h-full w-full overflow-hidden flex flex-col bg-transparent page-transition text-white";
        return "h-full w-full overflow-hidden flex flex-col bg-[#1E3A5F]";
    };

    return (
        <div className={getRootClass()}>
            
            {/* Section 1: Hero Section */}
            <div 
                className="relative w-full h-full flex flex-col items-center justify-start bg-cover bg-center"
                style={{ backgroundImage: theme === 'gravity' ? "none" : "url('/startupnest.png')" }}
            >
                {/* Darkened overlay for readability (hidden in gravity) */}
                {theme !== 'gravity' && <div className="absolute inset-0 bg-black/40"></div>}

                <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-4xl mt-12 mb-8">
                    <div className="mb-6">
                        <h1 className={`text-5xl md:text-7xl font-black tracking-tighter drop-shadow-2xl ${theme === 'gravity' ? 'text-white' : 'text-white'}`}>
                            StartupNest
                        </h1>
                    </div>

                    <div className={theme === 'gravity' ? "bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] shadow-[0_0_30px_rgba(124,58,237,0.2)] border border-white/10" : theme === 'osmo' ? "bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl border border-white/20" : "bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20"}>
                        <p className={`text-base md:text-xl font-medium leading-relaxed ${theme === 'osmo' ? 'text-[#0f0f0f]' : 'text-white'}`}>
                            Welcome to StartupNest, your gateway to innovation. 
                            Our platform connects aspiring entrepreneurs with experienced mentors 
                            ready to support and fund the next big idea.
                        </p>
                    </div>
                </div>

                {/* Dashboard Charts */}
                <DashboardCharts />
            </div>
        </div>
    );
};

export default HomePage;