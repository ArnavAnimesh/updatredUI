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
        if (theme === 'osmo') return "p-4 md:p-8 w-full max-w-7xl mx-auto flex-grow flex flex-col bg-[#fafafa] text-[#0f0f0f] page-transition";
        return "p-4 md:p-8 w-full max-w-7xl mx-auto flex-grow flex flex-col bg-gray-50/30";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        if (theme === 'osmo') return "text-3xl font-[800] text-[#0f0f0f] tracking-tight";
        return "text-3xl font-black text-gray-900 tracking-tight";
    };

    const getSubtitleClass = () => {
        if (theme === 'gravity') return "text-gray-400 font-medium mt-1";
        if (theme === 'osmo') return "text-[#71717a] font-medium mt-1";
        return "text-gray-500 font-medium mt-1";
    };

    const getSearchClass = () => {
        if (theme === 'gravity') return "w-full pl-12 pr-4 py-4 border rounded-2xl outline-none transition-all font-medium bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.4)] placeholder:text-gray-500";
        if (theme === 'osmo') return "w-full pl-12 pr-4 py-4 bg-white border border-[#e4e4e7] rounded-full shadow-sm focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)] outline-none transition-all placeholder:text-gray-400 font-medium text-[#0f0f0f]";
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
                <div className="flex-1 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-0">
                    <div className="flex-1 overflow-auto">
                        <Table 
                            columns={columns} 
                            rows={profiles} 
                            renderRow={renderRow} 
                        />
                    </div>
                    <div className="flex-none">
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
