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
        if (theme === 'gravity') return "min-h-screen bg-transparent flex items-center justify-center p-6 page-transition relative z-10";
        if (theme === 'osmo') return "min-h-screen bg-[#fafafa] flex items-center justify-center p-6 page-transition";
        return "min-h-screen bg-slate-50 flex items-center justify-center p-6";
    };

    const getCardClass = () => {
        if (theme === 'gravity') return "bg-white/5 backdrop-blur-[30px] rounded-[1.5rem] shadow-[0_0_40px_rgba(124,58,237,0.15)] border border-white/10 w-full max-w-md overflow-hidden card-enter";
        if (theme === 'osmo') return "bg-white rounded-[1.5rem] shadow-[0_2px_40px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] w-full max-w-md overflow-hidden transition-transform duration-300";
        return "bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden";
    };

    const getHeaderClass = () => {
        if (theme === 'gravity') return "p-8 text-center border-b border-white/10 bg-transparent";
        if (theme === 'osmo') return "p-8 text-center bg-white border-b border-[#f0f0f0]";
        return "bg-[#1E3A5F] p-8 text-center text-white";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        if (theme === 'osmo') return "text-2xl font-[800] tracking-tight text-[#0f0f0f]";
        return "text-2xl font-bold tracking-tight";
    };

    const getSubtitleClass = () => {
        if (theme === 'gravity') return "text-gray-400 text-sm mt-2";
        if (theme === 'osmo') return "text-[#71717a] text-sm mt-2";
        return "text-slate-300 text-sm mt-2";
    };

    return (
        <div className={getWrapperClass()}>
            <div className={getCardClass()}>
                {/* Header Section */}
                <div className={getHeaderClass()}>
                    <RiRocketLine className={`text-5xl mx-auto mb-4 ${theme === 'gravity' ? 'text-purple-500 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]' : theme === 'osmo' ? 'text-[#6366f1]' : 'text-[#F97316]'}`} />
                    <h1 className={getTitleClass()}>StartupNest</h1>
                    <p className={getSubtitleClass()}>Empowering ideas, one startup at a time.</p>
                </div>

                <div className={`p-8 ${theme === 'gravity' ? 'bg-transparent' : 'bg-white'}`}>
                    <h2 className={`text-xl font-bold mb-6 ${theme === 'gravity' ? 'text-white' : theme === 'osmo' ? 'text-[#0f0f0f]' : 'text-slate-800'}`}>Login to your account</h2>

                    {/* The Login Form */}
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

                        <div className="space-y-1">
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                            <div className="text-right">
                                <Link to="/forgot-password" intrinsic="true" className={`text-sm font-bold hover:underline ${theme === 'gravity' ? 'text-purple-400' : theme === 'osmo' ? 'text-[#6366f1]' : 'text-[#F97316]'}`}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <Button text="Login" type="submit" />
                    </form>

                    {/* Link to the Signup page */}
                    <div className={`mt-8 text-center pt-6 border-t ${theme === 'gravity' ? 'border-white/10' : theme === 'osmo' ? 'border-[#f0f0f0]' : 'border-slate-100'}`}>
                        <p className={`text-sm ${theme === 'gravity' ? 'text-gray-400' : 'text-slate-600'}`}>
                            New here?{' '}
                            <Link to="/signup" className={`font-bold hover:underline ${theme === 'gravity' ? 'text-white' : theme === 'osmo' ? 'text-[#0f0f0f]' : 'text-[#1E3A5F]'}`}>
                                Create an Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;