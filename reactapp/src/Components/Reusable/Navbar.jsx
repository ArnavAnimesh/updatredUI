import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiLogoutBoxLine, RiRocketLine, RiUser3Line, RiArrowDownSLine } from 'react-icons/ri';
import { logoutSuccess } from '../../slices/userSlice';
import api from '../../apiConfig';
import ConfirmDialog from './ConfirmDialog';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '../../hooks/useTheme';

const Navbar = ({ role, links }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showUserCard, setShowUserCard] = useState(false);
    
    // Get the user's name from Redux
    const { userName } = useSelector((state) => state.user);
    const { theme } = useTheme();

    // Logout logic (same for everyone)
    const handleConfirmLogout = async () => {
        setShowLogoutConfirm(false);
        try {
            await api.post('/user/logout');
        } catch (error) {
            console.log("Logout API failed, clearing local state.");
        } finally {
            dispatch(logoutSuccess());
            navigate('/');
        }
    };

    const getNavbarClass = () => {
        if (theme === 'gravity') {
            return "bg-[#050510]/80 backdrop-blur-[24px] text-[#f1f5f9] border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300";
        } else {
            return "bg-[#1E3A5F] text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 transition-colors duration-300";
        }
    };

    const getLogoClass = () => {
        
        if (theme === 'gravity') return "text-2xl font-bold tracking-tighter text-[#f1f5f9] uppercase drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        return "text-2xl font-black tracking-tighter italic text-white uppercase";
    };

    const getLinkClass = () => {
        
        if (theme === 'gravity') return "flex items-center gap-1 hover:text-[#7c3aed] transition-colors uppercase drop-shadow-sm";
        return "flex items-center gap-1 hover:text-[#F97316] transition-colors uppercase";
    };

    const getLogoutBtnClass = () => {
        
        if (theme === 'gravity') return "bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] active:scale-95 border border-purple-500/30 btn-glow";
        return "bg-[#F97316] hover:bg-[#EA6C0A] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase transition-all shadow-lg shadow-orange-900/20 active:scale-95 border border-transparent";
    };

    return (
        <nav className={getNavbarClass()}>
            {/* 1. LOGO SECTION */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                <RiRocketLine className={`text-3xl group-hover:rotate-12 transition-transform duration-300 ${theme === 'gravity' ? 'text-[#f59e0b]' : 'text-[#F97316]'}`} />
                <span className={getLogoClass()}>STARTUPNEST</span>
            </div>

            {/* 2. DYNAMIC NAVIGATION LINKS */}
            <div className="hidden lg:flex items-center gap-10 font-bold text-sm tracking-wide">
                {links.map((link, index) => (
                    <React.Fragment key={index}>
                        {link.subLinks ? (
                            /* DROPDOWN MENU */
                            <div className="relative group cursor-pointer py-2">
                                <div className={getLinkClass()}>
                                    <span>{link.label}</span>
                                    <RiArrowDownSLine className="text-lg group-hover:rotate-180 transition-transform duration-300" />
                                </div>

                                <div className={`absolute top-full left-0 mt-1 w-64 rounded-2xl shadow-2xl overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 border ${theme === 'gravity' ? 'bg-[#050510]/90 backdrop-blur-xl border-white/10' : 'bg-white border-gray-100'}`}>
                                    <div className="py-2">
                                        {link.subLinks.map((sub, subIndex) => (
                                            <Link 
                                                key={subIndex}
                                                to={sub.path} 
                                                className={`block px-6 py-4 transition-colors border-b last:border-0 ${theme === 'gravity' ? 'border-white/5 text-gray-300 hover:bg-white/5 hover:text-white' : 'border-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
                                            >
                                                <span className="flex flex-col">
                                                    <span className="font-bold">{sub.label}</span>
                                                    {sub.desc && <span className={`text-[10px] uppercase ${theme === 'gravity' ? 'text-gray-500' : 'text-gray-400'}`}>{sub.desc}</span>}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* SIMPLE LINK */
                            <Link to={link.path} className={getLinkClass().replace('flex items-center gap-1 ', '')}>
                                {link.label}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* 3. USER ACTIONS */}
            <div className="flex items-center gap-4 lg:gap-6 h-full">
                
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* User Badge with Hover Card */}
                <div 
                    className="relative group py-2"
                    onMouseEnter={() => setShowUserCard(true)}
                    onMouseLeave={() => setShowUserCard(false)}
                >
                    <div className={`hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-wider cursor-help transition-all ${theme === 'gravity' ? 'text-[#f59e0b]' : 'text-orange-400'}`}>
                        <RiUser3Line className="text-sm" />
                        <span className={'text-white'}>{userName}</span>
                    </div>
                    
                    {/* Hover Info Card */}
                    {showUserCard && (
                        <div className={`absolute top-full right-0 mt-2 w-52 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] info-pop z-[60] border backdrop-blur-md ${theme === 'gravity' ? 'bg-[#050510]/95 border-white/10 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black ${theme === 'gravity' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-50 text-orange-600'}`}>
                                    {userName?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Welcome back</p>
                                    <p className="font-bold text-sm truncate">{userName}</p>
                                </div>
                            </div>
                            <div className={`border-t pt-3 ${theme === 'gravity' ? 'border-white/10' : 'border-gray-50'}`}>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Access Role</p>
                                <div className="flex">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${theme === 'gravity' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' : 'bg-[#1E3A5F] text-white'}`}>
                                        {role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className={getLogoutBtnClass()}
                >
                    <RiLogoutBoxLine className="text-base" />
                    <span>Logout</span>
                </button>
            </div>

            {/* Logout Confirmation */}
            <ConfirmDialog 
                isOpen={showLogoutConfirm}
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={handleConfirmLogout}
                title="Logout Confirmation"
                message="Are you sure you want to logout? You will need to login again to access your dashboard."
                confirmText="Logout"
                danger={true}
            />
        </nav>
    );
};

export default Navbar;
