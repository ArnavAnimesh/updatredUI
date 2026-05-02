/**
 * App.jsx
 * This file handles the routing for our React app.
 * It strictly follows PRD Section 5.2.2 for route protection and role-based access.
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess } from './slices/userSlice';
import api from './apiConfig';
import { ThemeProvider } from './context/ThemeContext';

// Import our shared components
import LandingPage from './Components/LandingPage';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';

// Reusable Components
import Navbar from './Components/Reusable/Navbar';
import BackgroundMusic from './Components/BackgroundMusic';
import CosterChatbot from './Components/Reusable/CosterChatbot';
import Loader from './Components/Reusable/Loader';

// Mentor Components (Lazy Loaded)
const StartupProfileForm = React.lazy(() => import('./MentorComponents/StartupProfileForm'));
const ViewStartupProfiles = React.lazy(() => import('./MentorComponents/ViewStartupProfiles'));
const StartupSubmissions = React.lazy(() => import('./MentorComponents/StartupSubmissions'));

// Entrepreneur Components (Lazy Loaded)
const ViewStartupOpportunities = React.lazy(() => import('./EntrepreneurComponents/ViewStartupOpportunities'));
const SubmitIdea = React.lazy(() => import('./EntrepreneurComponents/SubmitIdea'));
const MySubmissions = React.lazy(() => import('./EntrepreneurComponents/MySubmissions'));


// Define Navigation Links for each role
const MENTOR_LINKS = [
    { label: 'Home', path: '/' },
    {
        label: 'Startup Profiles',
        subLinks: [
            { label: 'Add Profile', path: '/mentor/create-profile', desc: 'Create new opportunity' },
            { label: 'View Profiles', path: '/view-profiles', desc: 'Manage your listings' }
        ]
    },
    { label: 'Startup Submissions', path: '/startup-submissions' }
];

const ENTREPRENEUR_LINKS = [
    { label: 'Home', path: '/' },
    {
        label: 'Startup Ideas',
        subLinks: [
            { label: 'Browse Mentors', path: '/mentor-opportunities', desc: 'Find funding & support' },
            { label: 'My Submissions', path: '/entrepreneur/my-submissions', desc: 'Track your pitches' }
        ]
    }
];

/**
 * ProtectedRoute
 * Blocks access if not logged in. Optional role check.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, role } = useSelector((state) => state.user);

    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center min-h-screen font-semibold text-gray-500">Authenticating...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (requiredRole && role !== requiredRole) {
        // If they have the wrong role, we send them back to /home where the correct layout will catch them
        return <Navigate to="/home" />;
    }

    return children;
};

const MainLayout = () => {
    const { role } = useSelector((state) => state.user);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Navbar
                role={role}
                links={role === 'Mentor' ? MENTOR_LINKS : ENTREPRENEUR_LINKS}
            />
            <main className="flex-1 overflow-y-auto flex flex-col bg-transparent relative z-10">
                <div className="flex-grow flex flex-col">
                    <Outlet />
                </div>
            </main>
            <CosterChatbot />
        </div>
    );
};

/**
 * AuthRoute
 * Blocks access to Login/Signup if already logged in.
 */
const AuthRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);

    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center min-h-screen font-semibold text-gray-500">Checking session...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/home" />;
    }

    return children;
};

/**
 * RootRoute
 * Decides whether to show the LandingPage or redirect to /home.
 */
const RootRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.user);

    if (isAuthenticated === null) return null; // Wait for session check
    return isAuthenticated ? <Navigate to="/home" /> : <LandingPage />;
};

function App() {
    const dispatch = useDispatch();

    // Rehydrate auth state on page reload
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await api.get('/user/verify');
                if (response.data.success) {
                    dispatch(loginSuccess({
                        userName: response.data.data.userName,
                        role: response.data.data.role
                    }));
                } else {
                    dispatch(logoutSuccess());
                }
            } catch (error) {
                dispatch(logoutSuccess());
            }
        };

        verifyUser();
    }, [dispatch]);

    // Global Water Drop Effect
    useEffect(() => {
        const handleClick = (e) => {
            const drop = document.createElement('div');
            drop.className = 'water-drop';
            drop.style.left = `${e.clientX - 10}px`;
            drop.style.top = `${e.clientY - 10}px`;
            document.body.appendChild(drop);

            // Remove the element after animation ends
            setTimeout(() => {
                drop.remove();
            }, 800);
        };

        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <ThemeProvider>
        <Router>
            <React.Suspense fallback={<Loader fullPage />}>
                <Routes>
                    {/* --- 1. PUBLIC ROUTES --- */}
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                    <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
                    <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

                    {/* --- 2. SHARED PROTECTED ROUTES (Catch all roles) --- */}
                    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                        <Route path="/home" element={<HomePage />} />
                    </Route>

                    {/* --- 3. MENTOR SPECIFIC ROUTES --- */}
                    <Route element={<ProtectedRoute requiredRole="Mentor"><MainLayout /></ProtectedRoute>}>
                        <Route path="/mentor/create-profile" element={<StartupProfileForm />} />
                        <Route path="/view-profiles" element={<ViewStartupProfiles />} />
                        <Route path="/startup-submissions" element={<StartupSubmissions />} />
                    </Route>

                    {/* --- 4. ENTREPRENEUR SPECIFIC ROUTES --- */}
                    <Route element={<ProtectedRoute requiredRole="Entrepreneur"><MainLayout /></ProtectedRoute>}>
                        <Route path="/mentor-opportunities" element={<ViewStartupOpportunities />} />
                        <Route path="/submit-idea" element={<SubmitIdea />} />
                        <Route path="/entrepreneur/my-submissions" element={<MySubmissions />} />
                    </Route>

                    {/* --- 5. FALLBACK --- */}
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </React.Suspense>

                {/* Global Background Music Component */}
                <BackgroundMusic />
            </Router>
        </ThemeProvider>
    );
}

export default App;