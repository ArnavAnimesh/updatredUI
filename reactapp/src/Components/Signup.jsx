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

    // OTP State
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');

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
                if (response.data.data?.requiresOtp) {
                    setShowOtp(true);
                    toast.success(response.data.message);
                } else {
                    toast.success(response.data.message);
                    navigate('/'); 
                }
            }
        } catch (error) {
            // If the server sends an error (like email already exists)
            const message = error.response?.data?.message || "Failed to create account. Please try again.";
            toast.error(message);
        }
    }, [formData, navigate,validateForm]);

    // This function handles OTP Verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP.");
            return;
        }

        try {
            const response = await api.post('/user/verify-otp', { email: formData.email, otp });
            if (response.data.success) {
                toast.success("Account verified successfully! You can now login.");
                navigate('/login');
            }
        } catch (error) {
            const message = error.response?.data?.message || "Invalid or expired OTP.";
            toast.error(message);
        }
    };

    const getWrapperClass = () => {
        if (theme === 'gravity') return "h-[100dvh] bg-[#050510] flex relative z-10 overflow-hidden";
        
        return "h-[100dvh] bg-slate-50 flex overflow-hidden";
    };

    const getLeftPaneClass = () => {
        return "w-full lg:w-1/2 flex items-center justify-center p-4 md:p-6 z-10 page-transition relative overflow-y-auto lg:overflow-hidden";
    };

    const getRightPaneClass = () => {
        if (theme === 'gravity') return "hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900/40 to-black border-l border-white/10 text-white";
        
        return "hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1E3A5F] to-[#0f1d30] text-white";
    };

    const getFormContainerClass = () => {
        if (theme === 'gravity') return "w-full max-w-xl card-enter my-auto";
        
        return "w-full max-w-xl my-auto";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-3xl md:text-4xl font-black tracking-tight text-white mb-2 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        
        return "text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2";
    };

    return (
        <div className={getWrapperClass()}>
            {/* Left Pane - Form */}
            <div className={getLeftPaneClass()}>
                {/* Optional decorative blur for Gravity */}
                {theme === 'gravity' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
                )}

                <div className={getFormContainerClass()}>
                    <div className={`p-6 md:p-8 rounded-[2.5rem] shadow-2xl ${theme === 'gravity' ? 'bg-white/5 backdrop-blur-3xl border border-white/10' : 'bg-white border border-gray-100'}`}>
                        {!showOtp ? (
                            <>
                                <div className="mb-4 md:mb-6">
                                    <h2 className={getTitleClass()}>Create Account</h2>
                                    <p className={`text-sm md:text-base font-medium ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Join StartupNest and start your journey as an Entrepreneur or Mentor.
                                    </p>
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
                                        <div className="flex flex-col gap-1 w-full text-left">
                                            <label className={`text-sm font-bold ml-1 ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-700'}`}>
                                                Select Role <span className="text-red-500">*</span>
                                            </label>
                                            <select 
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                className={`w-full border rounded-2xl px-4 py-3 outline-none transition-all font-medium ${
                                                    theme === 'gravity' 
                                                    ? 'bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-purple-500 focus:shadow-[0_0_20px_rgba(124,58,237,0.3)]' 
                                                    : 'border-gray-200 bg-gray-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-50'
                                                }`}
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

                                    <div className={`p-4 rounded-2xl border mt-1 ${theme === 'gravity' ? 'bg-white/5 border-white/10 backdrop-blur-md' : 'bg-orange-50/50 border-orange-100'}`}>
                                        <p className={`text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 ${theme === 'gravity' ? 'text-indigo-400' : 'text-orange-600'}`}>Security Question</p>
                                        <p className={`text-xs md:text-sm font-medium mb-3 ${theme === 'gravity' ? 'text-gray-300' : 'text-gray-700'}`}>What was the name of your first school?</p>
                                        <Input 
                                            label="Your Answer"
                                            name="secretQuestionAnswer"
                                            placeholder="St. Mary's School"
                                            value={formData.secretQuestionAnswer}
                                            onChange={handleChange}
                                            error={errors.secretQuestionAnswer}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <Button 
                                            text="Register Account" 
                                            type="submit" 
                                            className="w-full py-3 text-base font-black"
                                        />
                                    </div>
                                </form>

                                {/* Link to go back to the Login page */}
                                <div className="mt-4 md:mt-6 text-center">
                                    <p className={`text-sm font-medium ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Already have an account?{' '}
                                        <Link to="/login" className={`font-bold transition-colors ${theme === 'gravity' ? 'text-white hover:text-indigo-400' : 'text-gray-900 hover:text-orange-500'}`}>
                                            Sign in instead
                                        </Link>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="py-8">
                                <div className="text-center mb-10">
                                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-2xl ${theme === 'gravity' ? 'bg-indigo-600 shadow-indigo-500/50' : 'bg-orange-500 shadow-orange-500/40'}`}>
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <h2 className={getTitleClass()}>Verify your email</h2>
                                    <p className={`text-base font-medium mt-4 ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-600'}`}>We sent a 4-digit code to</p>
                                    <p className={`text-lg font-bold ${theme === 'gravity' ? 'text-white' : 'text-gray-900'}`}>{formData.email}</p>
                                </div>

                                <form onSubmit={handleVerifyOtp} className="space-y-8 max-w-xs mx-auto">
                                    <div className="flex justify-center">
                                        <input 
                                            type="text"
                                            maxLength="4"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className={`w-full text-center text-4xl font-black tracking-[1em] indent-[1em] px-4 py-5 border rounded-3xl outline-none transition-all ${
                                                theme === 'gravity' 
                                                ? 'bg-white/5 text-white border-white/10 backdrop-blur-md focus:border-indigo-500 focus:shadow-[0_0_30px_rgba(99,102,241,0.3)]' 
                                                : 'border-gray-200 bg-gray-50 focus:border-orange-500 focus:ring-4 focus:ring-orange-100'
                                            }`}
                                            placeholder="••••"
                                        />
                                    </div>
                                    <Button text="Verify Account" type="submit" className="w-full py-4 text-lg font-black" />
                                </form>
                                
                                <div className="mt-10 text-center">
                                    <button onClick={() => setShowOtp(false)} className={`text-sm font-bold transition-colors ${theme === 'gravity' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                                        ← Use a different email
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Pane - Visuals */}
            <div className={getRightPaneClass()}>
                {/* Decorative background elements */}
                {theme === 'gravity' && (
                    <>
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-800/40 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent pointer-events-none" />
                    </>
                )}

                <div className="relative z-10 max-w-lg p-12 flex flex-col items-center text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                        {theme === 'gravity' ? <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Build the Future</span> : "Build the Future."}
                    </h2>
                    
                    <p className={`text-lg md:text-xl font-medium leading-relaxed ${theme === 'gravity' ? 'text-gray-300' : 'text-gray-300'}`}>
                        Whether you're pitching a unicorn idea or funding the next big thing, you're in the right place.
                    </p>

                    <div className="w-full max-w-sm mt-12 space-y-4 text-left">
                        <div className={`p-5 rounded-3xl backdrop-blur-md border flex items-center gap-4 ${theme === 'gravity' ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/5'}`}>
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xl">1</div>
                            <div>
                                <h3 className="font-bold text-lg">Create Profile</h3>
                                <p className="text-sm opacity-70">Set up your identity in seconds.</p>
                            </div>
                        </div>
                        <div className={`p-5 rounded-3xl backdrop-blur-md border flex items-center gap-4 ${theme === 'gravity' ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/5'}`}>
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xl">2</div>
                            <div>
                                <h3 className="font-bold text-lg">Connect</h3>
                                <p className="text-sm opacity-70">Match with the perfect opportunity.</p>
                            </div>
                        </div>
                        <div className={`p-5 rounded-3xl backdrop-blur-md border flex items-center gap-4 ${theme === 'gravity' ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/5'}`}>
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xl">3</div>
                            <div>
                                <h3 className="font-bold text-lg">Scale</h3>
                                <p className="text-sm opacity-70">Launch and grow your business.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;