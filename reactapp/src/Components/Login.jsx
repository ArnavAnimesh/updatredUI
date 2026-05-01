// This file is the Login Page of the application.
// It allows users to enter their email and password to access their account.
// It validates the fields, talks to the backend, and handles success or failure.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { RiRocketLine } from 'react-icons/ri';
import api from '../apiConfig';
import { loginSuccess } from '../slices/userSlice';
import Button from './Reusable/Button';
import Input from './Reusable/Input';
import { useTheme } from '../hooks/useTheme';

const Login = () => {
    // Hooks for navigation, redux dispatch, and component state
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theme } = useTheme();

    // State to store form data
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State to store field-level error messages
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    // This function updates the state when the user types in the input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear the error message as the user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // This function validates the form using Regex before we call the API
    const validateForm = () => {
        let valid = true;
        let newErrors = { email: '', password: '' };

        // Email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required.';
            valid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
            valid = false;
        }

        // Password check (must not be empty)
        if (!formData.password) {
            newErrors.password = 'Password is required.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // This function handles the login process when the form is submitted
    const handleLogin = useCallback(async (e) => {
        e.preventDefault();

        // First, we validate the form locally
        if (!validateForm()) {
            toast.error("Please correct the errors in the form.");
            return;
        }

        try {
            // We call the login API on our backend
            const response = await api.post('/user/login', formData);

            if (response.data.success) {
                // If login is successful, we show a success message
                toast.success(response.data.message);

                // We update our central Redux state with user details
                dispatch(loginSuccess({
                    role: response.data.data.role,
                    userName: response.data.data.userName
                }));

                // BUG FIX 1: Redirect user to /home correctly (dashboards will be handled there if needed)
                // But for now, we follow the user's redirect request
                navigate('/home');
            }
        } catch (error) {
            // If the login fails, we show the error message from the server
            const message = error.response?.data?.message || "Something went wrong during login.";
            toast.error(message);
        }
    }, [formData, navigate, dispatch]);


    const getWrapperClass = () => {
        if (theme === 'gravity') return "h-[100dvh] bg-[#050510] flex relative z-10 overflow-hidden";
        
        return "h-[100dvh] bg-slate-50 flex overflow-hidden";
    };

    const getLeftPaneClass = () => {
        return "w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 z-10 page-transition relative";
    };

    const getRightPaneClass = () => {
        if (theme === 'gravity') return "hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900/40 to-black border-l border-white/10 text-white";
        
        return "hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1E3A5F] to-[#0f1d30] text-white";
    };

    const getFormContainerClass = () => {
        if (theme === 'gravity') return "w-full max-w-md card-enter";
        
        return "w-full max-w-md";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-4xl font-black tracking-tight text-white mb-2 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        
        return "text-4xl font-extrabold tracking-tight text-gray-900 mb-2";
    };

    return (
        <div className={getWrapperClass()}>
            {/* Left Pane - Form */}
            <div className={getLeftPaneClass()}>
                {/* Optional decorative blur for Gravity */}
                {theme === 'gravity' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
                )}

                <div className={getFormContainerClass()}>
                    {/* Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                            <div className={`p-3 rounded-2xl ${theme === 'gravity' ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-orange-100'}`}>
                                <RiRocketLine className={`text-3xl ${theme === 'gravity' ? 'text-purple-400' : 'text-orange-600'}`} />
                            </div>
                            <span className={`text-xl font-black tracking-widest uppercase ${theme === 'gravity' ? 'text-gray-300' : 'text-gray-900'}`}>StartupNest</span>
                        </div>
                        <h1 className={getTitleClass()}>Welcome back.</h1>
                        <p className={`text-sm md:text-base font-medium ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Log in to access your dashboard, connect with founders, and track your pitches.
                        </p>
                    </div>

                    {/* Form */}
                    <div className={`p-8 md:p-10 rounded-[2.5rem] shadow-2xl ${theme === 'gravity' ? 'bg-white/5 backdrop-blur-3xl border border-white/10' : 'bg-white border border-gray-100'}`}>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />

                            <div className="space-y-2">
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                />
                                <div className="flex justify-end pt-1">
                                    <Link to="/forgot-password" intrinsic="true" className={`text-sm font-bold transition-colors ${theme === 'gravity' ? 'text-purple-400 hover:text-purple-300' : 'text-orange-500 hover:text-orange-600'}`}>
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button 
                                    text="Sign In securely" 
                                    type="submit" 
                                    className="w-full py-4 text-lg font-black"
                                />
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className={`text-sm font-medium ${theme === 'gravity' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Don't have an account yet?{' '}
                                <Link to="/signup" className={`font-bold transition-colors ${theme === 'gravity' ? 'text-white hover:text-purple-400' : 'text-gray-900 hover:text-orange-500'}`}>
                                    Create one now
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane - Visuals */}
            <div className={getRightPaneClass()}>
                {/* Decorative background elements */}
                {theme === 'gravity' && (
                    <>
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-800/40 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />
                    </>
                )}

                <div className="relative z-10 max-w-lg p-12 flex flex-col items-center text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-2xl ${theme === 'gravity' ? 'bg-purple-600 shadow-purple-500/50' : 'bg-orange-500 shadow-orange-500/40'}`}>
                        <RiRocketLine className="text-5xl text-white animate-bounce" />
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                        {theme === 'gravity' ? <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Where Ideas Take Flight</span> : "Where Ideas Take Flight."}
                    </h2>
                    
                    <p className={`text-lg md:text-xl font-medium leading-relaxed ${theme === 'gravity' ? 'text-gray-300' : 'text-gray-300'}`}>
                        Join the fastest-growing network of ambitious founders and experienced mentors building the next generation of unicorns.
                    </p>

                    {/* Social Proof Stats */}
                    <div className="grid grid-cols-2 gap-6 mt-12 w-full">
                        <div className={`p-6 rounded-3xl backdrop-blur-md border ${theme === 'gravity' ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/5'}`}>
                            <div className="text-3xl font-black mb-1">500+</div>
                            <div className="text-sm font-bold uppercase tracking-widest opacity-70">Startups Funded</div>
                        </div>
                        <div className={`p-6 rounded-3xl backdrop-blur-md border ${theme === 'gravity' ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/5'}`}>
                            <div className="text-3xl font-black mb-1">$50M</div>
                            <div className="text-sm font-bold uppercase tracking-widest opacity-70">Capital Raised</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;