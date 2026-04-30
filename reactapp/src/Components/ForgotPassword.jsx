// This file is the Forgot Password Page of the application.
// It allows users to reset their password if they can provide their email 
// and the exact answer to their secret security question.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiLockPasswordLine } from 'react-icons/ri';
import api from '../apiConfig';
import Button from './Reusable/Button';
import Input from './Reusable/Input';
import { useTheme } from '../hooks/useTheme';

const ForgotPassword = () => {
    // Hook to navigate back to login after success
    const navigate = useNavigate();
    const { theme } = useTheme();

    // State to store form inputs
    const [formData, setFormData] = useState({
        email: '',
        secretQuestionAnswer: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    // State to store field-level error messages
    const [errors, setErrors] = useState({});

    // This function updates the state as the user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear errors for the field being typed in
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // This function validates the inputs using Regex and matching rules
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        // Secret question answer check (cannot be empty)
        if (!formData.secretQuestionAnswer) {
            newErrors.secretQuestionAnswer = 'Please provide the answer to your secret question.';
            isValid = false;
        }

        // Password strength check (min 8 chars, 1 upper, 1 digit, 1 special)
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword = 'Password needs: min 8 chars, 1 uppercase, 1 number, and 1 special character.';
            isValid = false;
        }

        // Confirm password match check
        if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // This function handles the form submission
    const handleReset = useCallback(async (e) => {
        e.preventDefault();

        // Validate the form before calling the API
        if (!validateForm()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        try {
            // We call the forgotPassword endpoint on our backend
            const response = await api.post('/user/forgotPassword', formData);

            if (response.data.success) {
                // If successful, show a message and send them to the login page
                toast.success(response.data.message);
                navigate('/login');
            }
        } catch (error) {
            // If the reset fails (wrong email or wrong secret answer), show the error
            const message = error.response?.data?.message || "Failed to reset password. Please try again.";
            toast.error(message);
        }
    }, [formData, navigate]);

    const getWrapperClass = () => {
        if (theme === 'gravity') return "min-h-screen bg-transparent flex items-center justify-center p-6 py-12 page-transition relative z-10";
        if (theme === 'osmo') return "min-h-screen bg-[#fafafa] flex items-center justify-center p-6 py-12 page-transition";
        return "min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12";
    };

    const getCardClass = () => {
        if (theme === 'gravity') return "bg-white/5 backdrop-blur-[30px] p-8 rounded-[1.5rem] shadow-[0_0_40px_rgba(124,58,237,0.15)] border border-white/10 w-full max-w-md card-enter";
        if (theme === 'osmo') return "bg-white p-8 rounded-[1.5rem] shadow-[0_2px_40px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] w-full max-w-md transition-transform duration-300";
        return "bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100";
    };

    return (
        <div className={getWrapperClass()}>
            {/* The main card for the password reset form */}
            <div className={getCardClass()}>
                <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'gravity' ? 'bg-purple-500/10' : theme === 'osmo' ? 'bg-[#6366f1]/10' : 'bg-[#F97316]/10'}`}>
                        <RiLockPasswordLine className={`text-3xl ${theme === 'gravity' ? 'text-purple-400 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]' : theme === 'osmo' ? 'text-[#6366f1]' : 'text-[#F97316]'}`} />
                    </div>
                    <h2 className={`text-3xl mb-2 ${theme === 'gravity' ? 'font-bold text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]' : theme === 'osmo' ? 'font-[800] text-[#0f0f0f]' : 'font-black text-[#1E3A5F]'}`}>Reset Password</h2>
                    <p className={theme === 'gravity' ? 'text-gray-400' : 'text-slate-500'}>Provide your details to set a new password</p>
                </div>

                {/* The Reset Form */}
                <form onSubmit={handleReset} className="space-y-5">
                    <Input 
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <div className={`p-4 rounded-xl border ${theme === 'gravity' ? 'bg-white/5 border-white/10 backdrop-blur-md' : theme === 'osmo' ? 'bg-[#fafafa] border-[#e4e4e7]' : 'bg-slate-50 border-slate-200'}`}>
                        <p className={`text-xs font-bold uppercase mb-3 ${theme === 'gravity' ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(124,58,237,0.5)]' : theme === 'osmo' ? 'text-[#6366f1]' : 'text-slate-500'}`}>Security Question</p>
                        <p className={`text-sm mb-3 ${theme === 'gravity' ? 'text-gray-300' : 'text-slate-700'}`}>What was the name of your first school?</p>
                        <Input 
                            label="Your Answer"
                            name="secretQuestionAnswer"
                            placeholder="Exact answer you gave at signup"
                            value={formData.secretQuestionAnswer}
                            onChange={handleChange}
                            error={errors.secretQuestionAnswer}
                        />
                    </div>

                    <Input 
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                    />

                    <Input 
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        error={errors.confirmNewPassword}
                    />

                    <Button text="Update Password" type="submit" />
                </form>

                {/* Link to go back to the Login page */}
                <div className={`mt-8 text-center pt-6 border-t ${theme === 'gravity' ? 'border-white/10' : theme === 'osmo' ? 'border-[#f0f0f0]' : 'border-slate-100'}`}>
                    <p className={theme === 'gravity' ? 'text-gray-400' : 'text-slate-600'}>
                        Remember your password?{' '}
                        <Link to="/login" className={`font-bold hover:underline ${theme === 'gravity' ? 'text-white' : theme === 'osmo' ? 'text-[#0f0f0f]' : 'text-[#1E3A5F]'}`}>
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
