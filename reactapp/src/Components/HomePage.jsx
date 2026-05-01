/**
 * HomePage Component
 * This is the landing page for all authenticated users.
 * It features a full-screen hero with a background image, dynamic metric cards,
 * and a hover-activated charts modal.
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import DashboardCharts from './DashboardCharts';
import startupSubmissionService from '../services/startupSubmissionService';
import { RiBarChartBoxLine, RiTimeLine, RiCheckDoubleLine, RiCloseCircleLine } from 'react-icons/ri';

const HomePage = () => {
    const { theme } = useTheme();
    const { userName, role } = useSelector((state) => state.user);
    const [stats, setStats] = useState({ total: 0, pending: 0, shortlisted: 0, rejected: 0 });
    const [showCharts, setShowCharts] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            if (!role) return;
            try {
                let submissions = [];
                if (role === 'Mentor') {
                    const res = await startupSubmissionService.getMentorSubmissions({ limit: 100 });
                    if (res.success) submissions = res.data;
                } else if (role === 'Entrepreneur') {
                    const res = await startupSubmissionService.getMySubmissions({ limit: 100 });
                    if (res.success) submissions = res.data;
                }
                
                let pending = 0, shortlisted = 0, rejected = 0;
                submissions.forEach(sub => {
                    if (sub.status === 1) pending++;
                    else if (sub.status === 2) shortlisted++;
                    else if (sub.status === 3) rejected++;
                });

                setStats({
                    total: submissions.length,
                    pending,
                    shortlisted,
                    rejected
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchStats();
    }, [role]);

    const getRootClass = () => {
        
        if (theme === 'gravity') return "h-full w-full overflow-hidden flex flex-col bg-transparent page-transition text-white";
        return "h-full w-full overflow-hidden flex flex-col bg-[#1E3A5F]";
    };

    return (
        <div className={getRootClass()}>
            
            {/* Hero Section / Dashboard Layout */}
            <div 
                className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: theme === 'gravity' ? "none" : "url('/startupnest.png')" }}
            >
                {/* Darkened overlay for readability to match the screenshot */}
                {theme !== 'gravity' && <div className="absolute inset-0 bg-[#0e1726]/80 backdrop-blur-sm"></div>}

                <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-5xl mt-0">
                    <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mb-4">Dashboard System</p>
                    
                    <h1 className={`text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl mb-5 ${theme === 'gravity' ? 'text-white' : 'text-white'}`}>
                        Welcome back, <span className="text-orange-500">{userName}</span>
                    </h1>
                    
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">Authenticated As</span>
                        <span className="px-3 py-1 rounded-md bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-sm shadow-inner">
                            {role}
                        </span>
                    </div>

                    <p className="text-sm md:text-base font-medium leading-relaxed text-gray-300 max-w-2xl mb-16">
                        Your central hub for mentorship. Review pitches and discover the next big thing.
                    </p>

                    {/* Metric Cards */}
                    <div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full"
                        onMouseEnter={() => setShowCharts(true)}
                        onMouseLeave={() => setShowCharts(false)}
                    >
                        {/* Card 1: Total Submissions */}
                        <div className="bg-[#111e36]/90 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 text-left hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-2xl">
                            <div className="bg-black/30 w-10 h-10 rounded-[0.8rem] flex items-center justify-center mb-6">
                                <RiBarChartBoxLine className="text-gray-300 text-xl" />
                            </div>
                            <h2 className="text-5xl font-black text-white mb-2">{stats.total}</h2>
                            <p className="text-[9px] text-gray-400 font-black tracking-[0.15em] uppercase">Total Submissions</p>
                        </div>

                        {/* Card 2: Pending Review */}
                        <div className="bg-[#111e36]/90 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 text-left hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-2xl">
                            <div className="bg-black/30 w-10 h-10 rounded-[0.8rem] flex items-center justify-center mb-6">
                                <RiTimeLine className="text-yellow-500 text-xl" />
                            </div>
                            <h2 className="text-5xl font-black text-white mb-2">{stats.pending}</h2>
                            <p className="text-[9px] text-gray-400 font-black tracking-[0.15em] uppercase">Pending Review</p>
                        </div>

                        {/* Card 3: Shortlisted (Accent Card) */}
                        <div className="bg-[#0b2866]/90 backdrop-blur-xl border border-blue-500/20 rounded-[2rem] p-6 text-left hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-[0_0_40px_rgba(11,40,102,0.6)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <RiCheckDoubleLine className="text-8xl text-blue-300" />
                            </div>
                            <div className="bg-black/40 w-10 h-10 rounded-[0.8rem] flex items-center justify-center mb-6 relative z-10">
                                <RiCheckDoubleLine className="text-green-400 text-xl" />
                            </div>
                            <h2 className="text-5xl font-black text-white mb-2 relative z-10">{stats.shortlisted}</h2>
                            <p className="text-[9px] text-blue-200 font-black tracking-[0.15em] uppercase relative z-10">Shortlisted</p>
                        </div>

                        {/* Card 4: Closed/Rejected */}
                        <div className="bg-[#111e36]/90 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 text-left hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-2xl">
                            <div className="bg-black/30 w-10 h-10 rounded-[0.8rem] flex items-center justify-center mb-6">
                                <RiCloseCircleLine className="text-red-400 text-xl" />
                            </div>
                            <h2 className="text-5xl font-black text-white mb-2">{stats.rejected}</h2>
                            <p className="text-[9px] text-gray-400 font-black tracking-[0.15em] uppercase">Closed/Rejected</p>
                        </div>
                    </div>
                </div>

                {/* Floating Charts Modal on Lower Right */}
                <div 
                    className={`fixed bottom-8 right-8 w-[800px] max-w-[90vw] transition-all duration-500 z-[100] origin-bottom-right pointer-events-none ${showCharts ? 'translate-y-0 scale-[0.55] opacity-100 visible' : 'translate-y-10 scale-[0.5] opacity-0 invisible'}`}
                >
                    <div className="bg-[#0b1324]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden">
                        <DashboardCharts />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;