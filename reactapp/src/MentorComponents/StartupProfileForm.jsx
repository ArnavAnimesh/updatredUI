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
        if (theme === 'osmo') return "p-2 md:p-4 w-full max-w-4xl mx-auto flex-grow bg-[#fafafa] text-[#0f0f0f] page-transition mb-8";
        return "p-2 md:p-4 w-full max-w-4xl mx-auto flex-grow bg-gray-50/30 mb-8";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        if (theme === 'osmo') return "text-2xl md:text-3xl font-[800] text-[#0f0f0f] tracking-tight";
        return "text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight";
    };

    const getSubtitleClass = () => {
        if (theme === 'gravity') return "mt-2 text-gray-400 font-medium";
        if (theme === 'osmo') return "mt-2 text-[#71717a] font-medium";
        return "mt-2 text-gray-600 font-medium";
    };

    const getCardClass = () => {
        if (theme === 'gravity') return "bg-white/5 backdrop-blur-[30px] rounded-[1.5rem] shadow-[0_0_40px_rgba(124,58,237,0.15)] border border-white/10 p-4 md:p-6 card-enter";
        if (theme === 'osmo') return "bg-white rounded-[1.5rem] shadow-[0_2px_40px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] p-4 md:p-6 transition-transform duration-300";
        return "bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-4 md:p-6 border border-gray-100";
    };

    const getSelectClass = (hasError) => {
        if (theme === 'gravity') return `w-full p-3 border rounded-xl outline-none transition-all bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.4)] ${hasError ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}`;
        if (theme === 'osmo') return `w-full p-3 bg-white border rounded-xl outline-none transition-all focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)] ${hasError ? 'border-red-500' : 'border-[#e4e4e7]'}`;
        return `w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all ${hasError ? 'border-red-500' : 'border-gray-200'}`;
    };

    const getLabelClass = () => {
        if (theme === 'gravity') return "block text-xs md:text-sm font-bold text-gray-400 mb-1";
        if (theme === 'osmo') return "block text-xs md:text-sm font-bold text-[#0f0f0f] mb-1";
        return "block text-xs md:text-sm font-bold text-gray-700 mb-1";
    };

    const getTextAreaClass = (hasError) => {
        if (theme === 'gravity') return `w-full p-4 border rounded-2xl outline-none transition-all resize-none bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.4)] ${hasError ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}`;
        if (theme === 'osmo') return `w-full p-4 bg-white border rounded-2xl outline-none transition-all resize-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)] ${hasError ? 'border-red-500' : 'border-[#e4e4e7]'}`;
        return `w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none ${hasError ? 'border-red-500' : 'border-gray-200'}`;
    };

    return (
        <div className={getRootClass()}>
            <div className="max-w-3xl mx-auto">
                
                {/* Back Button (Only visible when editing) */}
                {isEditing && (
                    <button 
                        onClick={() => navigate('/view-profiles')}
                        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm"
                    >
                        <RiArrowLeftLine />
                        <span>Back to Profiles</span>
                    </button>
                )}

                {/* Page Header */}
                <div className="mb-4 md:mb-6 text-center">
                    <h1 className={getTitleClass()}>
                        {isEditing ? "Edit Startup Profile" : "Create Startup Opportunity"}
                    </h1>
                    <p className={getSubtitleClass()}>
                        {isEditing 
                            ? "Update the details of your startup opportunity below." 
                            : "Fill in the details to list a new opportunity for entrepreneurs."}
                    </p>
                </div>

                {/* Form Card */}
                <div className={getCardClass()}>
                    <form onSubmit={handleSubmitClick} className="space-y-4">
                        
                        {/* 1. Business Category, Industry & Stage (Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={getLabelClass()}>Business Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={getSelectClass(errors.category)}
                                >
                                    <option value="" className={theme === 'gravity' ? 'text-black' : ''}>Select Category</option>
                                    {categories.map(c => <option key={c} value={c} className={theme === 'gravity' ? 'text-black' : ''}>{c}</option>)}
                                </select>
                                {errors.category && <p className="mt-1 text-xs font-bold text-red-500">{errors.category}</p>}
                            </div>

                            <div>
                                <label className={getLabelClass()}>Target Industry</label>
                                <select
                                    name="targetIndustry"
                                    value={formData.targetIndustry}
                                    onChange={handleChange}
                                    className={getSelectClass(errors.targetIndustry)}
                                >
                                    <option value="" className={theme === 'gravity' ? 'text-black' : ''}>Select Industry</option>
                                    {industries.map(i => <option key={i} value={i} className={theme === 'gravity' ? 'text-black' : ''}>{i}</option>)}
                                </select>
                                {errors.targetIndustry && <p className="mt-1 text-xs font-bold text-red-500">{errors.targetIndustry}</p>}
                            </div>

                            <div>
                                <label className={getLabelClass()}>Preferred Stage</label>
                                <select
                                    name="preferredStage"
                                    value={formData.preferredStage}
                                    onChange={handleChange}
                                    className={getSelectClass(errors.preferredStage)}
                                >
                                    <option value="" className={theme === 'gravity' ? 'text-black' : ''}>Select Stage</option>
                                    {stages.map(s => <option key={s} value={s} className={theme === 'gravity' ? 'text-black' : ''}>{s}</option>)}
                                </select>
                                {errors.preferredStage && <p className="mt-1 text-xs font-bold text-red-500">{errors.preferredStage}</p>}
                            </div>
                        </div>

                        {/* 2. Funding Limit & Equity (Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                value={formData.avgEquityExpectation}
                                onChange={handleChange}
                                error={errors.avgEquityExpectation}
                                placeholder="e.g. 10"
                            />
                        </div>

                        {/* 3. Description */}
                        <div>
                            <label className={getLabelClass()}>Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Briefly describe the opportunity and what you are looking for..."
                                className={getTextAreaClass(errors.description)}
                            />
                            <div className="flex justify-between mt-1">
                                {errors.description ? (
                                    <p className="text-xs font-bold text-red-500">{errors.description}</p>
                                ) : (
                                    <p className="text-xs text-gray-400">Min 20 characters, Max 500.</p>
                                )}
                                <span className={`text-xs font-bold ${formData.description.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {formData.description.length}/500
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button
                                text={isEditing ? "Update Profile" : "Create Opportunity"}
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl shadow-lg shadow-orange-200 font-bold text-lg active:scale-[0.98] transition-all"
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isConfirmOpen}
                title={isEditing ? "Update Profile?" : "Create Profile?"}
                message={isEditing 
                    ? "Are you sure you want to save the changes to this startup opportunity?" 
                    : "Are you sure you want to list this startup opportunity? This will be visible to entrepreneurs."}
                confirmText={isEditing ? "Yes, Update It" : "Yes, List It"}
                onConfirm={handleConfirmSubmit}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
};

export default StartupProfileForm;
