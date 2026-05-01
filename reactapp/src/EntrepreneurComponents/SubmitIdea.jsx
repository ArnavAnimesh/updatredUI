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
import { playAddSound } from '../sounds/clickSound';

const SubmitIdea = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const { profileId, category, fundingLimit } = location.state || {};

    const [formData, setFormData] = useState({
        marketPotential: '',
        launchYear: '',
        expectedFunding: '',
        address: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.marketPotential) {
            newErrors.marketPotential = "Required";
        } else if (formData.marketPotential < 1 || formData.marketPotential > 100) {
            newErrors.marketPotential = "Score 1-100";
        }

        if (!formData.launchYear) {
            newErrors.launchYear = "Required";
        } else {
            const selectedDate = new Date(formData.launchYear);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate <= today) {
                newErrors.launchYear = "Future date only";
            }
        }

        if (!formData.expectedFunding) {
            newErrors.expectedFunding = "Required";
        } else if (Number(formData.expectedFunding) <= 0) {
            newErrors.expectedFunding = "Positive only";
        } else if (fundingLimit && Number(formData.expectedFunding) > fundingLimit) {
            newErrors.expectedFunding = `Limit: ₹${fundingLimit.toLocaleString()}`;
        }

        if (!formData.address || formData.address.length < 10) {
            newErrors.address = "Minimum 10 chars";
        }

        if (!selectedFile) {
            newErrors.pitchDeckFile = "PDF required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setErrors(prev => ({ ...prev, pitchDeckFile: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) setShowConfirm(true);
        else toast.warning("Please check the form for errors.");
    };

    const handleConfirmSubmit = async () => {
        setShowConfirm(false);
        setIsSubmitting(true);

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
                playAddSound();
                setShowSuccess(true);
            }
        } catch (error) {
            toast.error(error.message || "Submission failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessOk = () => {
        setShowSuccess(false);
        navigate('/entrepreneur/my-submissions');
    };

    if (!profileId) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-[80vh] p-10 relative z-10 ${theme === 'gravity' ? 'text-white' : ''}`}>
                <RiErrorWarningLine className={`text-6xl ${theme === 'gravity' ? 'text-purple-400' : 'text-orange-400'} mb-4`} />
                <h2 className="text-2xl font-bold">No Opportunity Selected</h2>
                <button onClick={() => navigate('/mentor-opportunities')} className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold">Back to Opportunities</button>
            </div>
        );
    }

    // --- PREMIUM THEME UTILS ---
    const isGravity = theme === 'gravity';

    return (
        <div className={`p-4 md:p-8 w-full max-w-5xl mx-auto flex-grow relative z-10 page-transition ${isGravity ? 'text-white' : 'text-gray-900'}`}>
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <div className={`p-5 rounded-3xl ${isGravity ? 'bg-purple-500/20 border border-purple-500/30 shadow-[0_0_30px_rgba(124,58,237,0.3)]' : 'bg-orange-100'}`}>
                        <RiRocket2Line className={`text-5xl ${isGravity ? 'text-purple-400' : 'text-orange-600'}`} />
                    </div>
                    <div>
                        <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isGravity ? 'text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]' : ''}`}>
                            Submit Your Idea
                        </h1>
                        <p className={`text-sm font-bold mt-1 uppercase tracking-widest ${isGravity ? 'text-gray-400' : 'text-gray-500'}`}>
                            Opportunity ID: <span className={isGravity ? 'text-purple-400' : 'text-orange-600'}>#{profileId.slice(-6)}</span>
                        </p>
                    </div>
                </div>

                <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 ${isGravity ? 'bg-white/5 border-white/10 backdrop-blur-md' : 'bg-gray-50 border-gray-100'}`}>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Applying For</span>
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${isGravity ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]' : 'bg-orange-500 text-white'}`}>
                        {category}
                    </span>
                </div>
            </div>

            {/* Main Form Content */}
            <form onSubmit={handleSubmit} className={`grid grid-cols-1 lg:grid-cols-12 gap-8`}>
                
                {/* Left Column: Details */}
                <div className={`lg:col-span-7 space-y-6 p-6 md:p-8 rounded-[2.5rem] border ${isGravity ? 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl' : 'bg-white shadow-xl border-gray-100'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-1.5 h-6 rounded-full ${isGravity ? 'bg-purple-500' : 'bg-orange-500'}`} />
                        <h2 className="text-xl font-bold tracking-tight">Idea Specifications</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="Market Potential Score (1-100)"
                            type="number"
                            name="marketPotential"
                            value={formData.marketPotential}
                            onChange={handleChange}
                            error={errors.marketPotential}
                            placeholder="e.g. 92"
                            className="bg-transparent"
                        />
                        <Input 
                            label="Anticipated Launch Date"
                            type="date"
                            name="launchYear"
                            value={formData.launchYear}
                            onChange={handleChange}
                            error={errors.launchYear}
                            className="bg-transparent"
                        />
                    </div>

                    <Input 
                        label={`Expected Funding Requested (Mentor Limit: ₹${fundingLimit?.toLocaleString()})`}
                        type="number"
                        name="expectedFunding"
                        value={formData.expectedFunding}
                        onChange={handleChange}
                        error={errors.expectedFunding}
                        placeholder="Amount in ₹"
                        className="bg-transparent"
                    />

                    <div className="space-y-2">
                        <label className={`block text-sm font-bold ml-1 ${isGravity ? 'text-gray-400' : 'text-gray-700'}`}>Office / Project Address</label>
                        <textarea 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className={`w-full px-5 py-4 rounded-3xl border outline-none transition-all resize-none font-medium placeholder:text-gray-500/50 ${
                                isGravity 
                                ? `bg-white/5 text-white border-white/10 focus:border-purple-500 focus:shadow-[0_0_20px_rgba(124,58,237,0.3)] ${errors.address ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''}`
                                : `bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 ${errors.address ? 'border-red-500' : ''}`
                            }`}
                            placeholder="Tell us where you're based..."
                        />
                        {errors.address && <p className="text-[11px] text-red-500 font-black uppercase tracking-wider ml-2 animate-pulse">{errors.address}</p>}
                    </div>
                </div>

                {/* Right Column: Upload & Actions */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    {/* Upload Card */}
                    <div className={`p-6 md:p-8 rounded-[2.5rem] border flex-1 flex flex-col ${isGravity ? 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl' : 'bg-white shadow-xl border-gray-100'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-1.5 h-6 rounded-full ${isGravity ? 'bg-purple-500' : 'bg-orange-500'}`} />
                            <h2 className="text-xl font-bold tracking-tight">Pitch Deck</h2>
                        </div>

                        <div className={`relative flex-1 group border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center transition-all duration-300 ${
                            selectedFile 
                            ? (isGravity ? 'border-purple-400 bg-purple-500/10' : 'border-green-400 bg-green-50')
                            : (isGravity ? 'border-white/10 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/5' : 'border-gray-200 bg-gray-50 hover:border-orange-300')
                        }`}>
                            <input 
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                                selectedFile 
                                ? (isGravity ? 'bg-purple-400 text-white' : 'bg-green-500 text-white')
                                : (isGravity ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-400')
                            }`}>
                                <RiUploadCloud2Line className="text-3xl" />
                            </div>

                            <p className={`text-center font-bold px-4 ${isGravity ? 'text-gray-200' : 'text-gray-900'}`}>
                                {selectedFile ? selectedFile.name : "Drop your PDF pitch deck here"}
                            </p>
                            <p className={`text-xs font-medium mt-2 opacity-60 ${isGravity ? 'text-gray-400' : 'text-gray-500'}`}>
                                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "Max size: 10MB"}
                            </p>

                            {selectedFile && (
                                <div className={`mt-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isGravity ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                    File Attached
                                </div>
                            )}
                        </div>
                        {errors.pitchDeckFile && <p className="text-red-500 text-xs font-bold text-center mt-3">{errors.pitchDeckFile}</p>}
                    </div>

                    {/* Actions Card */}
                    <div className={`p-6 rounded-[2rem] border ${isGravity ? 'bg-white/5 border-white/10 shadow-xl' : 'bg-white shadow-xl'}`}>
                        <div className="flex flex-col gap-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-2xl text-lg font-black tracking-tight transition-all active:scale-[0.98] ${
                                    isGravity 
                                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_10px_30px_rgba(124,58,237,0.4)] border-t border-white/20' 
                                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
                                } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Processing...' : 'Submit Pitch Now'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => navigate('/mentor-opportunities')}
                                className={`w-full py-3 rounded-2xl font-bold transition-all ${
                                    isGravity ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                Cancel & Return
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Dialogs */}
            <ConfirmDialog 
                isOpen={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmSubmit}
                title="Ready to Pitch?"
                message="Your startup idea will be sent to the mentor for review. You won't be able to edit the pitch deck once it's submitted."
                confirmText="Confirm Submission"
                cancelText="Let me double-check"
            />
            <ConfirmDialog 
                isOpen={showSuccess}
                onConfirm={handleSuccessOk}
                title="Submission Sent!"
                message="Awesome! Your idea is now in the hands of the mentor. We've notified them via email."
                confirmText="Check Status"
                showCancel={false}
            />
        </div>
    );
};

export default SubmitIdea;
