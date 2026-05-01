/**
 * StartupProfileForm Component
 * This is the form where Mentors can create or update startup opportunities.
 * It includes full regex validation, confirmation prompts, and dynamic behavior
 * based on whether it's an "Add" or "Edit" operation.
 * Strictly follows PRD Section 5.3.1.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiArrowLeftLine } from 'react-icons/ri';
import startupService from '../services/startupService';
import Button from '../Components/Reusable/Button';
import Input from '../Components/Reusable/Input';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import Loader from '../Components/Reusable/Loader';
import { useTheme } from '../hooks/useTheme';
import { playAddSound } from '../sounds/clickSound';

const StartupProfileForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    
    // Check if we are editing by looking for profileData in the navigation state
    const editData = location.state?.profileData;
    const isEditing = !!editData;

    // --- 1. STATE MANAGEMENT ---
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        fundingLimit: '',
        avgEquityExpectation: '',
        targetIndustry: '',
        preferredStage: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // --- 2. ENUMS FROM PRD ---
    const categories = ['FinTech', 'GreenTech', 'EdTech', 'AI/ML', 'HealthTech', 'Retail', 'Other'];
    const industries = ['Energy', 'Education', 'Financial Services', 'Retail', 'Healthcare', 'Technology'];
    const stages = ['idea', 'MVP', 'pre-revenue', 'scaling', 'established'];

    // --- 3. PRE-FILL DATA (If Editing) ---
    useEffect(() => {
        if (isEditing) {
            setFormData({
                category: editData.category || '',
                description: editData.description || '',
                fundingLimit: editData.fundingLimit || '',
                avgEquityExpectation: editData.avgEquityExpectation || '',
                targetIndustry: editData.targetIndustry || '',
                preferredStage: editData.preferredStage || ''
            });
        }
    }, [isEditing, editData]);

    // --- 4. VALIDATION LOGIC ---
    const validate = () => {
        let tempErrors = {};
        
        if (!formData.category) tempErrors.category = "Please select a category";
        
        if (!formData.description) {
            tempErrors.description = "Description is required";
        } else if (formData.description.length < 20) {
            tempErrors.description = "Description must be at least 20 characters";
        } else if (formData.description.length > 500) {
            tempErrors.description = "Description cannot exceed 500 characters";
        }

        const funding = Number(formData.fundingLimit);
        if (!formData.fundingLimit) {
            tempErrors.fundingLimit = "Funding limit is required";
        } else if (isNaN(funding) || funding < 1 || funding > 10000000) {
            tempErrors.fundingLimit = "Limit must be between ₹1 and ₹10,000,000";
        }

        const equity = Number(formData.avgEquityExpectation);
        if (!formData.avgEquityExpectation) {
            tempErrors.avgEquityExpectation = "Equity percentage is required";
        } else if (isNaN(equity) || equity < 1 || equity > 100) {
            tempErrors.avgEquityExpectation = "Equity must be between 1% and 100%";
        }

        if (!formData.targetIndustry) tempErrors.targetIndustry = "Please select a target industry";
        if (!formData.preferredStage) tempErrors.preferredStage = "Please select a preferred stage";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // --- 5. EVENT HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if ((name === 'fundingLimit' || name === 'avgEquityExpectation') && Number(value) < 0) {
            setErrors(prev => ({ ...prev, [name]: "Value cannot be negative" }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (validate()) {
            setIsConfirmOpen(true);
        } else {
            toast.error("Please fix the errors in the form.");
        }
    };

    const handleConfirmSubmit = async () => {
        setIsConfirmOpen(false);
        setLoading(true);
        try {
            let response;
            if (isEditing) {
                // Call Update API (PRD requirement)
                response = await startupService.updateProfile(editData._id, formData);
            } else {
                // Call Create API
                response = await startupService.createProfile(formData);
            }

            if (response.success) {
                playAddSound();
                toast.success(isEditing ? "Profile updated successfully!" : "Startup profile created successfully!");
                navigate('/view-profiles');
            }
        } catch (error) {
            toast.error(error.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullPage={true} />;

    const getRootClass = () => {
        if (theme === 'gravity') return "p-2 md:p-4 w-full max-w-4xl mx-auto flex-grow relative z-10 page-transition text-white mb-8";
        
        return "p-2 md:p-4 w-full max-w-4xl mx-auto flex-grow bg-gray-50/30 mb-8";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        
        return "text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight";
    };

    const getSubtitleClass = () => {
        if (theme === 'gravity') return "mt-2 text-gray-400 font-medium";
        
        return "mt-2 text-gray-600 font-medium";
    };

    const getCardClass = () => {
        if (theme === 'gravity') return "bg-white/5 backdrop-blur-[30px] rounded-[1.5rem] shadow-[0_0_40px_rgba(124,58,237,0.15)] border border-white/10 p-4 md:p-6 card-enter";
        
        return "bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-4 md:p-6 border border-gray-100";
    };

    const getSelectClass = (hasError) => {
        if (theme === 'gravity') return `w-full p-3 border rounded-xl outline-none transition-all bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.4)] ${hasError ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}`;
        
        return `w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all ${hasError ? 'border-red-500' : 'border-gray-200'}`;
    };

    const getLabelClass = () => {
        if (theme === 'gravity') return "block text-xs md:text-sm font-bold text-gray-400 mb-1";
        
        return "block text-xs md:text-sm font-bold text-gray-700 mb-1";
    };

    const getTextAreaClass = (hasError) => {
        if (theme === 'gravity') return `w-full p-4 border rounded-2xl outline-none transition-all resize-none bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.4)] ${hasError ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}`;
        
        return `w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none ${hasError ? 'border-red-500' : 'border-gray-200'}`;
    };

    return (
        <div className={getRootClass()}>
            <div className="max-w-5xl mx-auto">
                
                {/* Back Button */}
                {isEditing && (
                    <button 
                        onClick={() => navigate('/view-profiles')}
                        className={`mb-6 flex items-center gap-2 transition-colors font-bold text-sm ${theme === 'gravity' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <RiArrowLeftLine />
                        <span>Back to Profiles</span>
                    </button>
                )}

                {/* Page Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className={getTitleClass()}>
                            {isEditing ? "Edit Startup Profile" : "Create Startup Opportunity"}
                        </h1>
                        <p className={getSubtitleClass()}>
                            {isEditing 
                                ? "Update the details of your startup opportunity below." 
                                : "List a new opportunity for entrepreneurs to discover."}
                        </p>
                    </div>
                    {isEditing && (
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${theme === 'gravity' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-orange-100 text-orange-600 border-orange-200'}`}>
                            Editing Mode Active
                        </div>
                    )}
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmitClick}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Left Column: Categorization (Pill Selectors) */}
                        <div className={`lg:col-span-5 space-y-8 p-6 md:p-8 rounded-[2.5rem] border ${theme === 'gravity' ? 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl' : 'bg-white shadow-xl border-gray-100'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-1.5 h-6 rounded-full ${theme === 'gravity' ? 'bg-purple-500' : 'bg-orange-500'}`} />
                                <h2 className="text-xl font-bold tracking-tight">Categorization</h2>
                            </div>

                            {/* Category Pill Selector */}
                            <div>
                                <label className={getLabelClass()}>Business Category <span className="text-red-500">*</span></label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {categories.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, category: c }))}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                                                formData.category === c
                                                ? (theme === 'gravity' ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.4)]' : 'bg-orange-500 text-white border-orange-500 shadow-md')
                                                : (theme === 'gravity' ? 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100')
                                            }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                                {errors.category && <p className="mt-2 text-[11px] font-black uppercase tracking-wider text-red-500 animate-pulse">{errors.category}</p>}
                            </div>

                            {/* Industry Pill Selector */}
                            <div>
                                <label className={getLabelClass()}>Target Industry <span className="text-red-500">*</span></label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {industries.map(i => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, targetIndustry: i }))}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                                                formData.targetIndustry === i
                                                ? (theme === 'gravity' ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.4)]' : 'bg-orange-500 text-white border-orange-500 shadow-md')
                                                : (theme === 'gravity' ? 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100')
                                            }`}
                                        >
                                            {i}
                                        </button>
                                    ))}
                                </div>
                                {errors.targetIndustry && <p className="mt-2 text-[11px] font-black uppercase tracking-wider text-red-500 animate-pulse">{errors.targetIndustry}</p>}
                            </div>

                            {/* Stage Pill Selector */}
                            <div>
                                <label className={getLabelClass()}>Preferred Stage <span className="text-red-500">*</span></label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {stages.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, preferredStage: s }))}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border capitalize ${
                                                formData.preferredStage === s
                                                ? (theme === 'gravity' ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.4)]' : 'bg-orange-500 text-white border-orange-500 shadow-md')
                                                : (theme === 'gravity' ? 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100')
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                {errors.preferredStage && <p className="mt-2 text-[11px] font-black uppercase tracking-wider text-red-500 animate-pulse">{errors.preferredStage}</p>}
                            </div>
                        </div>

                        {/* Right Column: Financials & Description */}
                        <div className="lg:col-span-7 flex flex-col gap-8">
                            
                            <div className={`p-6 md:p-8 rounded-[2.5rem] border flex-1 space-y-6 ${theme === 'gravity' ? 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl' : 'bg-white shadow-xl border-gray-100'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-1.5 h-6 rounded-full ${theme === 'gravity' ? 'bg-purple-500' : 'bg-orange-500'}`} />
                                    <h2 className="text-xl font-bold tracking-tight">Financials & Details</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Input
                                        label="Funding Limit (₹)"
                                        name="fundingLimit"
                                        type="number"
                                        min="0"
                                        value={formData.fundingLimit}
                                        onChange={handleChange}
                                        error={errors.fundingLimit}
                                        placeholder="e.g. 500000"
                                    />
                                    <Input
                                        label="Avg. Equity Expectation (%)"
                                        name="avgEquityExpectation"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.avgEquityExpectation}
                                        onChange={handleChange}
                                        error={errors.avgEquityExpectation}
                                        placeholder="e.g. 10"
                                    />
                                </div>

                                <div>
                                    <label className={getLabelClass()}>Detailed Description <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="description"
                                        rows="5"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="What kind of startup are you looking to fund? Outline your expectations..."
                                        className={getTextAreaClass(errors.description)}
                                    />
                                    <div className="flex justify-between mt-2 ml-1">
                                        {errors.description ? (
                                            <p className="text-[11px] font-black uppercase tracking-wider text-red-500 animate-pulse">{errors.description}</p>
                                        ) : (
                                            <p className={`text-xs font-bold ${theme === 'gravity' ? 'text-gray-500' : 'text-gray-400'}`}>Min 20 characters, Max 500.</p>
                                        )}
                                        <span className={`text-xs font-black ${formData.description.length > 500 ? 'text-red-500' : (theme === 'gravity' ? 'text-gray-500' : 'text-gray-400')}`}>
                                            {formData.description.length}/500
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div className={`p-6 rounded-[2rem] border ${theme === 'gravity' ? 'bg-white/5 border-white/10 shadow-xl' : 'bg-white shadow-xl'}`}>
                                <Button
                                    text={isEditing ? "Save Changes" : "Publish Opportunity"}
                                    type="submit"
                                    className={`w-full py-4 rounded-2xl text-lg font-black tracking-tight transition-all active:scale-[0.98] ${
                                        theme === 'gravity' 
                                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_10px_30px_rgba(124,58,237,0.4)] border-t border-white/20' 
                                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isConfirmOpen}
                title={isEditing ? "Update Profile?" : "Publish Profile?"}
                message={isEditing 
                    ? "Are you sure you want to save the changes to this startup opportunity?" 
                    : "Are you ready to publish this opportunity? It will be instantly visible to entrepreneurs."}
                confirmText={isEditing ? "Yes, Update It" : "Yes, Publish It"}
                onConfirm={handleConfirmSubmit}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
};

export default StartupProfileForm;
