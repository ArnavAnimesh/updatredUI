// This file is the Signup Page of the application.
// It allows new users to create an account by providing their details.
// It uses regex to validate inputs and sends the data to the backend.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../apiConfig';
import Button from './Reusable/Button';
import Input from './Reusable/Input';
import { useTheme } from '../hooks/useTheme';

const Signup = () => {
    // Hook to navigate between pages
    const navigate = useNavigate();
    const { theme } = useTheme();

    // State to store all the input field values
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        role: 'Entrepreneur', // Default role
        secretQuestionAnswer: ''
    });

    // State to store error messages for each field
    const [errors, setErrors] = useState({});

    // This function updates the state as the user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear the error for this field if it was already showing one
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // This function checks if all fields follow our security and format rules (Regex)
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Username check: at least 3 chars, letters/numbers/underscores only
        const userNameRegex = /^[a-zA-Z0-9_]{3,}$/;
        if (!userNameRegex.test(formData.userName)) {
            newErrors.userName = 'Username must be at least 3 characters (letters, numbers, or underscores).';
            isValid = false;
        }

        // Email check: must be a valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        // Mobile check: exactly 10 digits starting with 6-9
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
            isValid = false;
        }

        // Password check: min 8 chars, 1 uppercase, 1 digit, 1 special char
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password needs: min 8 chars, 1 uppercase, 1 number, and 1 special character.';
            isValid = false;
        }

        // Password match check
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
            isValid = false;
        }

        // Secret question answer check
        if (!formData.secretQuestionAnswer) {
            newErrors.secretQuestionAnswer = 'Please provide an answer for the secret question.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // This function handles the signup process when the form is submitted
    const handleSignup = useCallback(async (e) => {
        e.preventDefault();

        // Validate the form before calling the API
        if (!validateForm()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        try {
            // Send the registration data to our backend
            const response = await api.post('/user/signup', formData);

            if (response.data.success) {
                // If successful, show a message and go directly to the Home page
                toast.success(response.data.message);
                navigate('/'); // Redirecting to home page instead of login
            }
        } catch (error) {
            // If the server sends an error (like email already exists)
            const message = error.response?.data?.message || "Failed to create account. Please try again.";
            toast.error(message);
        }
    }, [formData, navigate,validateForm]);

    const getWrapperClass = () => {
        if (theme === 'gravity') return "min-h-screen bg-transparent flex items-center justify-center p-4 page-transition relative z-10";
        if (theme === 'osmo') return "min-h-screen bg-[#fafafa] flex items-center justify-center p-4 page-transition";
        return "min-h-screen bg-slate-50 flex items-center justify-center p-4";
    };

    const getCardClass = () => {
        if (theme === 'gravity') return "bg-white/5 backdrop-blur-[30px] p-6 rounded-[1.5rem] shadow-[0_0_40px_rgba(124,58,237,0.15)] border border-white/10 w-full max-w-lg card-enter";
        if (theme === 'osmo') return "bg-white p-6 rounded-[1.5rem] shadow-[0_2px_40px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] w-full max-w-lg transition-transform duration-300";
        return "bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg border border-slate-100";
    };

    return (
        <div className={getWrapperClass()}>
            {/* The main card for the signup form */}
            <div className={getCardClass()}>
                <div className="text-center mb-4">
                    <h2 className={`text-2xl md:text-3xl mb-1 ${theme === 'gravity' ? 'font-bold text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]' : theme === 'osmo' ? 'font-[800] text-[#0f0f0f]' : 'font-black text-[#1E3A5F]'}`}>Create Account</h2>
                    <p className={`text-sm ${theme === 'gravity' ? 'text-gray-400' : 'text-slate-500'}`}>Join StartupNest and start your journey</p>
                </div>

                {/* The Signup Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Username"
                            name="userName"
                            placeholder="johndoe_99"
                            value={formData.userName}
                            onChange={handleChange}
                            error={errors.userName}
                        />
                        <Input 
                            label="Mobile Number"
                            name="mobile"
                            placeholder="9876543210"
                            value={formData.mobile}
                            onChange={handleChange}
                            error={errors.mobile}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        {/* Role Selection Dropdown */}
                        <div className="flex flex-col gap-1">
                            <label className={`text-sm font-semibold ${theme === 'gravity' ? 'text-gray-400 hidden' : 'text-slate-700'}`}>Select Role *</label>
                            <select 
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={`w-full border rounded-xl px-4 py-2 outline-none transition-all ${theme === 'gravity' ? 'bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.4)]' : theme === 'osmo' ? 'bg-white border-[#e4e4e7] focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]' : 'border-slate-200 bg-white focus:border-[#1E3A5F]'}`}
                            >
                                <option value="Entrepreneur" className={theme === 'gravity' ? 'text-black' : ''}>Entrepreneur</option>
                                <option value="Mentor" className={theme === 'gravity' ? 'text-black' : ''}>Mentor</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />
                        <Input 
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />
                    </div>

                    <div className={`p-3 rounded-xl border ${theme === 'gravity' ? 'bg-white/5 border-white/10 backdrop-blur-md' : theme === 'osmo' ? 'bg-[#fafafa] border-[#e4e4e7]' : 'bg-slate-50 border-slate-200'}`}>
                        <p className={`text-xs font-bold uppercase mb-1 ${theme === 'gravity' ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(124,58,237,0.5)]' : theme === 'osmo' ? 'text-[#6366f1]' : 'text-slate-500'}`}>Security Question</p>
                        <p className={`text-xs mb-2 ${theme === 'gravity' ? 'text-gray-300' : 'text-slate-700'}`}>What was the name of your first school?</p>
                        <Input 
                            label="Your Answer"
                            name="secretQuestionAnswer"
                            placeholder="St. Mary's School"
                            value={formData.secretQuestionAnswer}
                            onChange={handleChange}
                            error={errors.secretQuestionAnswer}
                        />
                    </div>

                    <Button text="Register Account" type="submit" />
                </form>

                {/* Link to go back to the Login page */}
                <div className={`mt-4 text-center pt-4 border-t ${theme === 'gravity' ? 'border-white/10' : theme === 'osmo' ? 'border-[#f0f0f0]' : 'border-slate-100'}`}>
                    <p className={theme === 'gravity' ? 'text-gray-400' : 'text-slate-600'}>
                        Already have an account?{' '}
                        <Link to="/login" className={`font-bold hover:underline ${theme === 'gravity' ? 'text-white' : theme === 'osmo' ? 'text-[#0f0f0f]' : 'text-[#1E3A5F]'}`}>
                            Login Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;