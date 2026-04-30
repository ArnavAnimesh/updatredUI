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
        if (theme === 'osmo') {
            return "bg-white/90 backdrop-blur-md text-[#0f0f0f] border-b border-[#f0f0f0] px-8 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300";
        } else if (theme === 'gravity') {
            return "bg-[#050510]/80 backdrop-blur-[24px] text-[#f1f5f9] border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300";
        } else {
            return "bg-[#1E3A5F] text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 transition-colors duration-300";
        }
    };

    const getLogoClass = () => {
        if (theme === 'osmo') return "text-2xl font-[800] tracking-tighter text-[#0f0f0f] uppercase";
        if (theme === 'gravity') return "text-2xl font-bold tracking-tighter text-[#f1f5f9] uppercase drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]";
        return "text-2xl font-black tracking-tighter italic text-white uppercase";
    };

    const getLinkClass = () => {
        if (theme === 'osmo') return "flex items-center gap-1 hover:bg-black/5 px-3 py-1.5 rounded-full transition-all uppercase text-[#0f0f0f]/80 hover:text-[#0f0f0f]";
        if (theme === 'gravity') return "flex items-center gap-1 hover:text-[#7c3aed] transition-colors uppercase drop-shadow-sm";
        return "flex items-center gap-1 hover:text-[#F97316] transition-colors uppercase";
    };

    const getLogoutBtnClass = () => {
        if (theme === 'osmo') return "bg-[#0f0f0f] hover:bg-[#1a1a1a] text-white px-5 py-2 rounded-full flex items-center gap-2 text-xs font-bold uppercase transition-all shadow-sm active:scale-95";
        if (theme === 'gravity') return "bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] active:scale-95 border border-purple-500/30 btn-glow";
        return "bg-[#F97316] hover:bg-[#EA6C0A] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase transition-all shadow-lg shadow-orange-900/20 active:scale-95 border border-transparent";
    };

    return (
        <nav className={getNavbarClass()}>
            {/* 1. LOGO SECTION */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                <RiRocketLine className={`text-3xl group-hover:rotate-12 transition-transform duration-300 ${theme === 'osmo' ? 'text-[#6366f1]' : theme === 'gravity' ? 'text-[#f59e0b]' : 'text-[#F97316]'}`} />
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
                                                className={`block px-6 py-4 transition-colors border-b last:border-0 ${theme === 'gravity' ? 'border-white/5 text-gray-300 hover:bg-white/5 hover:text-white' : theme === 'osmo' ? 'border-gray-50 text-gray-700 hover:bg-gray-50 hover:text-black' : 'border-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
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

                {/* User Badge */}
                <div className={`hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-wider py-2 ${theme === 'osmo' ? 'text-[#6366f1]' : theme === 'gravity' ? 'text-[#f59e0b]' : 'text-orange-400'}`}>
                    <RiUser3Line className="text-sm" />
                    <span className={theme === 'osmo' ? 'text-black' : 'text-white'}>{userName} <span className="opacity-40 mx-1">|</span> {role}</span>
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
