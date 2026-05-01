/**
 * ViewStartupOpportunities Component
 * This page allows Entrepreneurs to browse all startup opportunities listed by Mentors.
 * It uses the shared startup state and includes server-side search and pagination.
 * Strictly follows PRD Section 5.4.1.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiSearchLine, RiLightbulbLine, RiCheckLine } from 'react-icons/ri';

import startupService from '../services/startupService';
import startupSubmissionService from '../services/startupSubmissionService';
import { fetchStart, fetchSuccess, fetchFailure } from '../slices/startupSlice';

// Reusable Components
import Table from '../Components/Reusable/Table';
import Pagination from '../Components/Reusable/Pagination';
import EmptyState from '../Components/Reusable/EmptyState';
import Loader from '../Components/Reusable/Loader';
import { useTheme } from '../hooks/useTheme';

const ViewStartupOpportunities = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { profiles, loading, pagination } = useSelector((state) => state.startup);
    const { theme } = useTheme();
    
    // Local state for search and submission tracking
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [submittedProfileIds, setSubmittedProfileIds] = useState(new Set());

    // --- 1. DEBOUNCE SEARCH (PRD 6.1) ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // --- 2. DATA FETCHING ---
    const fetchUserSubmissions = useCallback(async () => {
        try {
            const response = await startupSubmissionService.getMySubmissions();
            if (response.success) {
                // Extract IDs of profiles already submitted to
                const ids = new Set(response.data.map(sub => 
                    typeof sub.startupProfileId === 'object' ? sub.startupProfileId._id : sub.startupProfileId
                ));
                setSubmittedProfileIds(ids);
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    }, []);

    const loadOpportunities = useCallback(async (page = 1, keyword = '') => {
        dispatch(fetchStart());
        try {
            const response = await startupService.getAllProfiles({ 
                page, 
                keyword,
                sortBy: 'createdAt',
                order: 'desc'
            });
            if (response.success) {
                dispatch(fetchSuccess(response));
            }
        } catch (error) {
            dispatch(fetchFailure(error.message));
            toast.error("Failed to load opportunities");
        }
    }, [dispatch]);

    useEffect(() => {
        loadOpportunities(1, debouncedSearch);
        fetchUserSubmissions();
    }, [debouncedSearch, loadOpportunities, fetchUserSubmissions]);

    // --- 3. EVENT HANDLERS ---
    const handlePageChange = (newPage) => {
        loadOpportunities(newPage, debouncedSearch);
    };

    const handleSubmitIdea = (profileId, category, fundingLimit) => {
        // We pass the profile info in the state so the submission form knows which one it's for
        navigate('/submit-idea', { state: { profileId, category, fundingLimit } });
    };

    // --- 4. TABLE CONFIGURATION ---
    const columns = [
        "Mentor",
        "Category",
        "Target Industry",
        "Funding Limit",
        "Preferred Stage",
        "Action"
    ];

    const renderRow = (profile) => {
        const isSubmitted = submittedProfileIds.has(profile._id);

        return (
            <>
                <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className={`text-sm font-bold ${theme === 'gravity' ? 'text-gray-200' : 'text-gray-900'}`}>{profile.mentorId?.userName}</span>
                        <span className={`text-xs ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-500'}`}>{profile.mentorId?.email}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme === 'gravity' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-50 text-orange-700'}`}>
                        {profile.category}
                    </span>
                </td>
                <td className={`px-6 py-4 text-sm font-medium ${theme === 'gravity' ? 'text-gray-300' : 'text-gray-600'}`}>{profile.targetIndustry}</td>
                <td className={`px-6 py-4 text-sm font-bold ${theme === 'gravity' ? 'text-white' : 'text-gray-900'}`}>Up to ₹{profile.fundingLimit?.toLocaleString()}</td>
                <td className="px-6 py-4">
                    <span className={`text-sm capitalize ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-600'}`}>{profile.preferredStage}</span>
                </td>
                <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => !isSubmitted && handleSubmitIdea(profile._id, profile.category, profile.fundingLimit)}
                        disabled={isSubmitted}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                            isSubmitted 
                            ? (theme === 'gravity' ? 'bg-white/5 text-gray-500 cursor-not-allowed shadow-none border border-white/10' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200')
                            : (theme === 'gravity' ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-purple-500' : 'bg-orange-500 hover:bg-orange-600 text-white')
                        }`}
                    >
                        {isSubmitted ? (
                            <>
                                <RiCheckLine className="text-lg" />
                                <span>Already Applied</span>
                            </>
                        ) : (
                            <>
                                <RiLightbulbLine className="text-lg" />
                                <span>Submit Idea</span>
                            </>
                        )}
                    </button>
                </td>
            </>
        );
    };

    const getRootClass = () => {
        if (theme === 'gravity') return "p-4 md:p-8 w-full max-w-7xl mx-auto flex-grow flex flex-col relative z-10 page-transition text-white";
        
        return "p-4 md:p-8 w-full max-w-7xl mx-auto flex-grow flex flex-col bg-gray-50/30";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        
        return "text-3xl font-black text-gray-900 tracking-tight";
    };

    const getSubtitleClass = () => {
        if (theme === 'gravity') return "text-gray-400 font-medium mt-1";
        
        return "text-gray-500 font-medium mt-1";
    };

    const getSearchClass = () => {
        if (theme === 'gravity') return "w-full pl-12 pr-4 py-4 border rounded-2xl outline-none transition-all font-medium bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.4)] placeholder:text-gray-500";
        
        return "w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400 font-medium";
    };

    return (
        <div className={getRootClass()}>
            {/* Header Section */}
            <div className="mb-8">
                <h1 className={getTitleClass()}>Startup Opportunities</h1>
                <p className={getSubtitleClass()}>Browse and find the perfect mentor for your startup idea.</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                    type="text"
                    placeholder="Search by category, industry or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={getSearchClass()}
                />
            </div>

            {/* Content Area */}
            {loading ? (
                <Loader />
            ) : profiles && profiles.length > 0 ? (
                <div className="flex-1 overflow-auto flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
                    {Object.entries(
                        profiles.reduce((acc, profile) => {
                            const mentorName = profile.mentorId?.userName || "Anonymous Mentor";
                            if (!acc[mentorName]) acc[mentorName] = { 
                                mentor: profile.mentorId, 
                                items: [] 
                            };
                            acc[mentorName].items.push(profile);
                            return acc;
                        }, {})
                    ).map(([mentorName, group], idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            {/* Mentor Header Section */}
                            <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl border ${
                                theme === 'gravity' 
                                ? 'bg-white/5 border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(124,58,237,0.1)]' 
                                : 'bg-white border-gray-100 shadow-md'
                            }`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                                    theme === 'gravity' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-100 text-orange-600'
                                }`}>
                                    {mentorName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-black tracking-tight ${theme === 'gravity' ? 'text-white' : 'text-gray-900'}`}>
                                        {mentorName}
                                    </h3>
                                    <p className={`text-xs font-medium ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {group.mentor?.email} • {group.items.length} listed {group.items.length === 1 ? 'opportunity' : 'opportunities'}
                                    </p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    theme === 'gravity' ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                                }`}>
                                    Verified Mentor
                                </div>
                            </div>

                            {/* Opportunities Table for this Mentor */}
                            <div className="min-w-0">
                                <Table 
                                    columns={columns.slice(1)} // Remove 'Mentor' column since it's now in the header
                                    rows={group.items} 
                                    renderRow={(profile) => {
                                        const isSubmitted = submittedProfileIds.has(profile._id);
                                        return (
                                            <>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme === 'gravity' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-50 text-orange-700'}`}>
                                                        {profile.category}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 text-sm font-medium ${theme === 'gravity' ? 'text-gray-300' : 'text-gray-600'}`}>{profile.targetIndustry}</td>
                                                <td className={`px-6 py-4 text-sm font-bold ${theme === 'gravity' ? 'text-white' : 'text-gray-900'}`}>Up to ₹{profile.fundingLimit?.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm capitalize ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-600'}`}>{profile.preferredStage}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => !isSubmitted && handleSubmitIdea(profile._id, profile.category, profile.fundingLimit)}
                                                        disabled={isSubmitted}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                                                            isSubmitted 
                                                            ? (theme === 'gravity' ? 'bg-white/5 text-gray-500 cursor-not-allowed shadow-none border border-white/10' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200')
                                                            : (theme === 'gravity' ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-purple-500' : 'bg-orange-500 hover:bg-orange-600 text-white')
                                                        }`}
                                                    >
                                                        {isSubmitted ? (
                                                            <>
                                                                <RiCheckLine className="text-lg" />
                                                                <span>Already Applied</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <RiLightbulbLine className="text-lg" />
                                                                <span>Submit Idea</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </>
                                        );
                                    }} 
                                />
                            </div>
                        </div>
                    ))}
                    
                    <div className="flex-none mt-4">
                        <Pagination 
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            ) : (
                <EmptyState 
                    message={searchTerm ? "No opportunities match your search." : "There are no startup opportunities listed at the moment."} 
                    icon="💼"
                />
            )}
        </div>
    );
};

export default ViewStartupOpportunities;
