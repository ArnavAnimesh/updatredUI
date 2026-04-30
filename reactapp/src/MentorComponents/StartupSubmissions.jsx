/**
 * StartupSubmissions.jsx
 * This component provides a dashboard for Mentors to review startup ideas sent by Entrepreneurs.
 * Features: Filtering, Sorting, Pagination (10/page), Detail View, and Status Management.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
    RiFilter2Line, 
    RiSortAsc, 
    RiEyeLine, 
    RiCheckLine, 
    RiCloseLine, 
    RiFilePdfLine,
    RiRocket2Line
} from 'react-icons/ri';

// Import our reusable components
import Table from '../Components/Reusable/Table';
import Pagination from '../Components/Reusable/Pagination';
import EmptyState from '../Components/Reusable/EmptyState';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import Modal from '../Components/Reusable/Modal';
import Loader from '../Components/Reusable/Loader';

import startupSubmissionService from '../services/startupSubmissionService';
import { useTheme } from '../hooks/useTheme';

const StartupSubmissions = () => {
    // --- 1. STATE MANAGEMENT ---
    const { theme } = useTheme();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0 });
    
    // Filter and Sort states
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    // Action/Dialog states
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ show: false, type: '', id: null });

    // --- 2. DATA FETCHING ---

    const loadSubmissions = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                status: statusFilter,
                order: sortOrder
            };
            const response = await startupSubmissionService.getMentorSubmissions(params);
            if (response.success) {
                setSubmissions(response.data);
                setPagination({
                    currentPage: response.pagination.currentPage,
                    totalPages: response.pagination.totalPages
                });
            }
        } catch (error) {
            toast.error(error.message || "Failed to load submissions");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, sortOrder]);

    useEffect(() => {
        loadSubmissions(1);
    }, [loadSubmissions]);

    // --- 3. ACTION HANDLERS ---

    const handlePageChange = (newPage) => {
        loadSubmissions(newPage);
    };

    const handleViewDetails = (submission) => {
        setSelectedSubmission(submission);
        setShowDetailModal(true);
    };

    const openConfirm = (type, id) => {
        setConfirmAction({ show: true, type, id });
    };

    const handleConfirmAction = async () => {
        const { type, id } = confirmAction;
        setConfirmAction({ show: false, type: '', id: null });

        try {
            if (type === 'delete') {
                const response = await startupSubmissionService.deleteSubmission(id);
                if (response.success) {
                    toast.success("Submission deleted successfully");
                    loadSubmissions(pagination.currentPage);
                }
            } else {
                // Shortlist (2) or Reject (3)
                const status = type === 'shortlist' ? 2 : 3;
                const response = await startupSubmissionService.updateStatus(id, status);
                if (response.success) {
                    toast.success(`Submission ${type === 'shortlist' ? 'shortlisted' : 'rejected'}`);
                    loadSubmissions(pagination.currentPage);
                }
            }
        } catch (error) {
            toast.error(error.message || "Action failed");
        }
    };

    // --- 4. TABLE CONFIGURATION ---

    const columns = [
        "Entrepreneur",
        "Startup Name",
        "Date Submitted",
        "Status",
        "Actions"
    ];

    const getStatusBadge = (status) => {
        const styles = {
            1: "bg-yellow-100 text-yellow-700",
            2: "bg-green-100 text-green-700",
            3: "bg-red-100 text-red-700"
        };
        const labels = { 1: "Pending", 2: "Shortlisted", 3: "Rejected" };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const renderRow = (submission) => (
        <>
            <td className="px-6 py-4">
                <span className={`text-sm font-bold ${theme === 'gravity' ? 'text-gray-200' : 'text-gray-900'}`}>{submission.userName}</span>
            </td>
            <td className="px-6 py-4">
                <span className={`text-sm font-medium ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {submission.startupProfileId?.category || 'N/A'}
                </span>
            </td>
            <td className={`px-6 py-4 text-sm font-medium ${theme === 'gravity' ? 'text-gray-300' : 'text-gray-500'}`}>
                {new Date(submission.submissionDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
                {getStatusBadge(submission.status)}
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    {/* View Details - Always Available */}
                    <button 
                        onClick={() => handleViewDetails(submission)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                    >
                        <RiEyeLine size={18} />
                    </button>

                    {/* Shortlist Action - Available if not already shortlisted */}
                    {submission.status !== 2 && (
                        <button 
                            onClick={() => openConfirm('shortlist', submission._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Shortlist"
                        >
                            <RiCheckLine size={18} />
                        </button>
                    )}

                    {/* Reject Action - Available if not already rejected (remains available after shortlist) */}
                    {submission.status !== 3 && (
                        <button 
                            onClick={() => openConfirm('reject', submission._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Reject"
                        >
                            <RiCloseLine size={18} />
                        </button>
                    )}
                </div>
            </td>
        </>
    );

    const getRootClass = () => {
        if (theme === 'gravity') return "p-4 md:p-8 w-full max-w-7xl mx-auto flex-grow flex flex-col relative z-10 page-transition text-white";
        if (theme === 'osmo') return "p-4 md:p-8 w-full max-w-7xl mx-auto flex-grow flex flex-col bg-[#fafafa] text-[#0f0f0f] page-transition";
        return "p-4 md:p-8 w-full max-w-7xl mx-auto flex-grow flex flex-col";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        if (theme === 'osmo') return "text-3xl font-[800] text-[#0f0f0f] tracking-tight";
        return "text-3xl font-black text-gray-900 tracking-tight";
    };

    const getSubtitleClass = () => {
        if (theme === 'gravity') return "text-gray-400 font-medium";
        if (theme === 'osmo') return "text-[#71717a] font-medium";
        return "text-gray-500 font-medium";
    };

    const getSelectClass = () => {
        if (theme === 'gravity') return "pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all font-bold text-sm bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.4)]";
        if (theme === 'osmo') return "pl-10 pr-4 py-2.5 bg-white border border-[#e4e4e7] rounded-full shadow-sm outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)] font-bold text-sm text-[#0f0f0f]";
        return "pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm text-gray-700";
    };

    return (
        <div className={getRootClass()}>
            {/* Header and Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className={getTitleClass()}>Startup Submissions</h1>
                    <p className={getSubtitleClass()}>Review and manage ideas sent to your startup opportunities.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Filter */}
                    <div className="relative">
                        <RiFilter2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={getSelectClass()}
                        >
                            <option value="" className={theme === 'gravity' ? 'text-black' : ''}>All Statuses</option>
                            <option value="1" className={theme === 'gravity' ? 'text-black' : ''}>Pending</option>
                            <option value="2" className={theme === 'gravity' ? 'text-black' : ''}>Shortlisted</option>
                            <option value="3" className={theme === 'gravity' ? 'text-black' : ''}>Rejected</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div className="relative">
                        <RiSortAsc className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className={getSelectClass()}
                        >
                            <option value="desc" className={theme === 'gravity' ? 'text-black' : ''}>Newest First</option>
                            <option value="asc" className={theme === 'gravity' ? 'text-black' : ''}>Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <Loader />
            ) : submissions && submissions.length > 0 ? (
                <div className="flex-1 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-0">
                    <div className="flex-1 overflow-auto">
                        <Table 
                            columns={columns}
                            rows={submissions}
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
                    message="No submissions found matching your criteria."
                    icon="📂"
                />
            )}

            {/* View Details Modal */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Startup Idea Details"
            >
                {selectedSubmission && (
                    <div className={`space-y-6 ${theme === 'gravity' ? 'text-gray-200' : 'text-gray-800'}`}>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Entrepreneur</p>
                                <p className="font-bold text-lg">{selectedSubmission.userName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Target Category</p>
                                <p className={`font-bold text-lg ${theme === 'gravity' ? 'text-purple-400' : 'text-orange-600'}`}>{selectedSubmission.startupProfileId?.category}</p>
                            </div>
                        </div>

                        <div className={`p-4 rounded-2xl grid grid-cols-3 gap-4 ${theme === 'gravity' ? 'bg-white/5 border border-white/10' : 'bg-gray-50'}`}>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Potential</p>
                                <p className={`font-black ${theme === 'gravity' ? 'text-blue-400' : 'text-blue-600'}`}>{selectedSubmission.marketPotential}%</p>
                            </div>
                            <div className={`text-center border-x ${theme === 'gravity' ? 'border-white/10' : 'border-gray-200'}`}>
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Launch</p>
                                <p className={`font-black ${theme === 'gravity' ? 'text-gray-200' : 'text-gray-800'}`}>{new Date(selectedSubmission.launchYear).getFullYear()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Funding Req.</p>
                                <p className={`font-black ${theme === 'gravity' ? 'text-green-400' : 'text-green-600'}`}>₹{selectedSubmission.expectedFunding?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pitch Deck (PDF)</p>
                            <a 
                                href={`http://localhost:8080/${selectedSubmission.pitchDeckFile}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`flex items-center gap-3 p-4 border rounded-2xl font-bold transition-all group ${theme === 'gravity' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20' : 'bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100'}`}
                            >
                                <RiFilePdfLine className="text-2xl" />
                                <span>View Pitch Deck Document</span>
                                <RiRocket2Line className="ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </a>
                        </div>

                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Physical Address</p>
                            <p className={`text-sm font-medium border p-4 rounded-2xl leading-relaxed ${theme === 'gravity' ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-gray-100 text-gray-800'}`}>
                                {selectedSubmission.address}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Generic Confirmation Dialog */}
            <ConfirmDialog 
                isOpen={confirmAction.show}
                onCancel={() => setConfirmAction({ show: false, type: '', id: null })}
                onConfirm={handleConfirmAction}
                title={`Confirm ${confirmAction.type === 'delete' ? 'Deletion' : 'Status Update'}`}
                message={`Are you sure you want to ${confirmAction.type} this submission? This action ${confirmAction.type === 'delete' ? 'cannot be undone.' : 'will notify the entrepreneur.'}`}
                confirmText={`Yes, ${confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)}`}
                danger={confirmAction.type === 'delete' || confirmAction.type === 'reject'}
            />
        </div>
    );
};

export default StartupSubmissions;
