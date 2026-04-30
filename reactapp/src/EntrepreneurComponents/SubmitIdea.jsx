/**
 * SubmitIdea.jsx
 * This page allows Entrepreneurs to submit a startup idea for a specific Mentor opportunity.
 * It features multi-field validation, file upload (PDF), and a confirmation dialog.
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiRocket2Line, RiUploadCloud2Line, RiErrorWarningLine } from 'react-icons/ri';

// Import our reusable components
import Input from '../Components/Reusable/Input';
import Button from '../Components/Reusable/Button';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import startupSubmissionService from '../services/startupSubmissionService';
import { useTheme } from '../hooks/useTheme';

const SubmitIdea = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    // We extract the profile data passed from the browse page
    // If no state is passed (e.g. direct URL access), we redirect back
    const { profileId, category, fundingLimit } = location.state || {};

    // --- 1. STATE MANAGEMENT ---

    // Form data state
    const [formData, setFormData] = useState({
        marketPotential: '',
        launchYear: '',
        expectedFunding: '',
        address: ''
    });

    // File state
    const [selectedFile, setSelectedFile] = useState(null);

    // Validation error state
    const [errors, setErrors] = useState({});
    
    // Loading state for submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Confirmation dialog state
    const [showConfirm, setShowConfirm] = useState(false);
    
    // Success modal state
    const [showSuccess, setShowSuccess] = useState(false);

    // --- 2. VALIDATION LOGIC (PRD 7.1) ---
    // ... rest of validation logic ...

    const validateForm = () => {
        let newErrors = {};

        // Market Potential: Must be between 1 and 100
        if (!formData.marketPotential) {
            newErrors.marketPotential = "Market potential score is required.";
        } else if (formData.marketPotential < 1 || formData.marketPotential > 100) {
            newErrors.marketPotential = "Score must be between 1 and 100.";
        }

        // Launch Year: Must be a valid date and must be in the future (greater than today)
        if (!formData.launchYear) {
            newErrors.launchYear = "Anticipated launch date is required.";
        } else {
            const selectedDate = new Date(formData.launchYear);
            const today = new Date();
            // Set time to 00:00:00 for a fair comparison
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate <= today) {
                newErrors.launchYear = "Anticipated date must be in the future.";
            }
        }

        // Expected Funding: Must be positive and not exceed mentor's funding limit
        if (!formData.expectedFunding) {
            newErrors.expectedFunding = "Funding amount is required.";
        } else if (Number(formData.expectedFunding) <= 0) {
            newErrors.expectedFunding = "Funding must be a positive number.";
        } else if (fundingLimit && Number(formData.expectedFunding) > fundingLimit) {
            newErrors.expectedFunding = `Expected funding cannot exceed the mentor's limit of ₹${fundingLimit.toLocaleString()}`;
        } else if (Number(formData.expectedFunding) > 10000000) {
            newErrors.expectedFunding = "Maximum funding allowed is ₹10,000,000.";
        }

        // Address: Min 10, Max 300 characters
        if (!formData.address) {
            newErrors.address = "Location/Address is required.";
        } else if (formData.address.length < 10) {
            newErrors.address = "Address must be at least 10 characters long.";
        } else if (formData.address.length > 300) {
            newErrors.address = "Address cannot exceed 300 characters.";
        }

        // File Upload: Must be a PDF and exist
        if (!selectedFile) {
            newErrors.pitchDeckFile = "Please upload your pitch deck (PDF).";
        } else if (selectedFile.type !== 'application/pdf') {
            newErrors.pitchDeckFile = "Only PDF files are allowed.";
        } else if (selectedFile.size > 10 * 1024 * 1024) {
            newErrors.pitchDeckFile = "File size exceeds 10MB limit.";
        }

        setErrors(newErrors);
        // Returns true if no errors were found
        return Object.keys(newErrors).length === 0;
    };

    // --- 3. EVENT HANDLERS ---

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field as the user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setErrors(prev => ({ ...prev, pitchDeckFile: '' }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // We validate first
        if (validateForm()) {
            // If valid, we show the confirmation prompt
            setShowConfirm(true);
        } else {
            toast.warning("Please correct the errors before submitting.");
        }
    };

    // Actual API call after confirmation
    const handleConfirmSubmit = async () => {
        setShowConfirm(false);
        setIsSubmitting(true);

        // We use FormData to handle the file upload
        const submissionPayload = new FormData();
        submissionPayload.append('startupProfileId', profileId);
        submissionPayload.append('marketPotential', formData.marketPotential);
        submissionPayload.append('launchYear', formData.launchYear);
        submissionPayload.append('expectedFunding', formData.expectedFunding);
        submissionPayload.append('address', formData.address);
        submissionPayload.append('pitchDeckFile', selectedFile);

        try {
            const response = await startupSubmissionService.createSubmission(submissionPayload);
            if (response.success) {
                // Show success modal instead of toast
                setShowSuccess(true);
            }
        } catch (error) {
            toast.error(error.message || "Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler for success modal OK button
    const handleSuccessOk = () => {
        setShowSuccess(false);
        navigate('/entrepreneur/my-submissions');
    };

    // If no profile was passed, show a warning
    // ... rest of component ...
    if (!profileId) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-[80vh] p-10 relative z-10 ${theme === 'gravity' ? 'text-white' : ''}`}>
                <RiErrorWarningLine className={`text-6xl ${theme === 'gravity' ? 'text-purple-400' : 'text-orange-400'} mb-4`} />
                <h2 className={`text-2xl font-bold ${theme === 'gravity' ? 'text-white' : 'text-gray-800'}`}>No Opportunity Selected</h2>
                <p className={`mt-2 mb-6 text-center max-w-md ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Please select a startup opportunity from the browse page to submit your idea.
                </p>
                <button 
                    onClick={() => navigate('/mentor-opportunities')}
                    className={`text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${theme === 'gravity' ? 'bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-purple-500' : 'bg-orange-500 hover:bg-orange-600'}`}
                >
                    Back to Opportunities
                </button>
            </div>
        );
    }

    const getRootClass = () => {
        if (theme === 'gravity') return "p-2 md:p-4 w-full max-w-3xl mx-auto flex-grow relative z-10 page-transition text-white mb-8";
        if (theme === 'osmo') return "p-2 md:p-4 w-full max-w-3xl mx-auto flex-grow bg-[#fafafa] text-[#0f0f0f] page-transition mb-8";
        return "p-2 md:p-4 w-full max-w-3xl mx-auto flex-grow mb-8";
    };

    const getHeaderIconBoxClass = () => {
        if (theme === 'gravity') return "p-4 bg-purple-500/20 border border-purple-500/30 rounded-2xl shadow-[0_0_15px_rgba(124,58,237,0.3)]";
        if (theme === 'osmo') return "p-4 bg-[#f4f4f5] rounded-[1.2rem]";
        return "p-4 bg-orange-100 rounded-2xl";
    };

    const getHeaderIconClass = () => {
        if (theme === 'gravity') return "text-4xl text-purple-400";
        if (theme === 'osmo') return "text-4xl text-[#0f0f0f]";
        return "text-4xl text-orange-600";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        if (theme === 'osmo') return "text-2xl md:text-3xl font-[800] text-[#0f0f0f] tracking-tight";
        return "text-2xl md:text-3xl font-black text-gray-900 tracking-tight";
    };

    const getSubtitleClass = () => {
        if (theme === 'gravity') return "text-gray-400 font-medium";
        if (theme === 'osmo') return "text-[#71717a] font-medium";
        return "text-gray-500 font-medium";
    };

    const getFormCardClass = () => {
        if (theme === 'gravity') return "bg-white/5 backdrop-blur-[30px] rounded-[1.5rem] shadow-[0_0_40px_rgba(124,58,237,0.15)] border border-white/10 p-4 md:p-6 space-y-4 card-enter";
        if (theme === 'osmo') return "bg-white rounded-[1.5rem] shadow-[0_2px_40px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] p-4 md:p-6 space-y-4 transition-transform duration-300";
        return "bg-white p-4 md:p-6 rounded-3xl shadow-xl border border-gray-50 space-y-4";
    };

    const getLabelClass = () => {
        if (theme === 'gravity') return "block text-xs md:text-sm font-bold text-gray-400 mb-1 ml-1";
        if (theme === 'osmo') return "block text-xs md:text-sm font-bold text-[#0f0f0f] mb-1 ml-1";
        return "block text-xs md:text-sm font-bold text-gray-700 mb-1 ml-1";
    };

    const getTextAreaClass = (hasError) => {
        if (theme === 'gravity') return `w-full px-4 py-3 border rounded-2xl outline-none transition-all resize-none font-medium bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.4)] ${hasError ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}`;
        if (theme === 'osmo') return `w-full px-4 py-3 bg-white border rounded-2xl outline-none transition-all resize-none font-medium focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)] text-[#0f0f0f] ${hasError ? 'border-red-500' : 'border-[#e4e4e7]'}`;
        return `w-full px-4 py-3 bg-gray-50 border rounded-2xl outline-none transition-all resize-none font-medium text-gray-800 ${hasError ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'}`;
    };

    const getFileDropClass = () => {
        if (theme === 'gravity') {
            return `relative group border-2 border-dashed rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center transition-all ${selectedFile ? 'border-purple-400 bg-purple-500/10' : 'border-white/20 bg-white/5 hover:border-purple-400 hover:bg-purple-500/10'}`;
        }
        if (theme === 'osmo') {
            return `relative group border-2 border-dashed rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center transition-all ${selectedFile ? 'border-[#6366f1] bg-indigo-50' : 'border-[#e4e4e7] bg-[#fafafa] hover:border-black'}`;
        }
        return `relative group border-2 border-dashed rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center transition-all ${selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50'}`;
    };

    const getFileDropTextClass = () => {
        if (theme === 'gravity') return "text-sm font-bold text-gray-300";
        if (theme === 'osmo') return "text-sm font-bold text-[#0f0f0f]";
        return "text-sm font-bold text-gray-700";
    };

    const getCancelBtnClass = () => {
        if (theme === 'gravity') return "px-6 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10";
        if (theme === 'osmo') return "px-6 py-3 bg-[#fafafa] text-[#0f0f0f] rounded-[1.2rem] font-bold hover:bg-[#f0f0f0] transition-all border border-[#e4e4e7]";
        return "px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all";
    };

    return (
        <div className={getRootClass()}>
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className={getHeaderIconBoxClass()}>
                    <RiRocket2Line className={getHeaderIconClass()} />
                </div>
                <div>
                    <h1 className={getTitleClass()}>Submit Your Idea</h1>
                    <p className={getSubtitleClass()}>Applying for: <span className={`${theme === 'gravity' ? 'text-purple-400' : 'text-orange-600'} font-bold uppercase`}>{category}</span></p>
                </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className={getFormCardClass()}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Market Potential Input */}
                    <Input 
                        label="Market Potential Score (1-100)"
                        type="number"
                        name="marketPotential"
                        value={formData.marketPotential}
                        onChange={handleChange}
                        error={errors.marketPotential}
                        min="0"
                        placeholder="e.g., 85"
                    />

                    {/* Launch Year Date Picker */}
                    <Input 
                        label="Anticipated Launch Date"
                        type="date"
                        name="launchYear"
                        value={formData.launchYear}
                        onChange={handleChange}
                        error={errors.launchYear}
                        min={new Date().toISOString().split("T")[0]}
                    />

                    {/* Expected Funding Input */}
                    <Input 
                        label={`Expected Funding (Limit: ₹${fundingLimit?.toLocaleString()})`}
                        type="number"
                        name="expectedFunding"
                        value={formData.expectedFunding}
                        onChange={handleChange}
                        error={errors.expectedFunding}
                        min="0"
                        placeholder="e.g., 500000"
                    />
                </div>

                {/* Address/Location Input */}
                <div>
                    <label className={getLabelClass()}>Office/Project Address</label>
                    <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className={getTextAreaClass(errors.address)}
                        placeholder="Provide your physical address or location details..."
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-2 ml-1 font-bold animate-pulse">{errors.address}</p>}
                </div>

                {/* File Upload Section */}
                <div className="space-y-2">
                    <label className={getLabelClass()}>Pitch Deck (PDF only, Max 10MB)</label>
                    <div className={getFileDropClass()}>
                        <input 
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <RiUploadCloud2Line className={`text-3xl mb-1 ${selectedFile ? (theme === 'gravity' ? 'text-purple-400' : 'text-green-500') : (theme === 'gravity' ? 'text-gray-500 group-hover:text-purple-400' : 'text-gray-400 group-hover:text-orange-500')}`} />
                        <p className={getFileDropTextClass()}>
                            {selectedFile ? selectedFile.name : "Click to upload or drag & drop"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Only PDF format is supported</p>
                    </div>
                    {errors.pitchDeckFile && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{errors.pitchDeckFile}</p>}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-4">
                    <Button 
                        type="submit" 
                        loading={isSubmitting}
                        disabled={!!errors.expectedFunding}
                        className="flex-1 py-3 text-base"
                    >
                        Submit Idea
                    </Button>
                    <button 
                        type="button"
                        onClick={() => navigate('/mentor-opportunities')}
                        className={getCancelBtnClass()}
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {/* Confirmation Dialog */}
            <ConfirmDialog 
                isOpen={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmSubmit}
                title="Confirm Submission"
                message="Are you sure you want to submit this startup idea? You cannot change your pitch deck once it is submitted to the mentor."
                confirmText="Yes, Submit Now"
                cancelText="Check Again"
            />
            {/* Success Confirmation Dialog */}
            <ConfirmDialog 
                isOpen={showSuccess}
                onConfirm={handleSuccessOk}
                title="Submission Successful!"
                message="Your startup idea has been successfully submitted to the mentor. You can track its status in your dashboard."
                confirmText="OK, View My Submissions"
                showCancel={false}
            />
        </div>
    );
};

export default SubmitIdea;
