import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
    const { theme, setTheme, cycleTheme } = useTheme();

    // Mobile view uses a simple click to cycle
    const handleMobileClick = () => {
        cycleTheme();
    };

    const getPillStyle = () => {
        switch (theme) {
            case 'osmo':
                return 'bg-black text-gray-500 border border-gray-800';
            case 'gravity':
                return 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-400';
            case 'default':
            default:
                return 'bg-white border border-gray-200 text-gray-500';
        }
    };

    const getActiveSegmentStyle = (isActive) => {
        if (!isActive) return 'hover:text-gray-300';
        switch (theme) {
            case 'osmo':
                return 'bg-white text-black font-bold shadow-sm';
            case 'gravity':
                return 'bg-purple-600/30 text-white font-bold shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-purple-500/30';
            case 'default':
            default:
                return 'bg-blue-50 text-blue-700 font-bold';
        }
    };

    return (
        <>
            {/* Desktop View */}
            <div className={`hidden lg:flex items-center rounded-full p-1 transition-all duration-300 ${getPillStyle()}`}>
                <button
                    onClick={() => setTheme('default')}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-full transition-all duration-300 ${getActiveSegmentStyle(theme === 'default')}`}
                >
                    ◻ Classic
                </button>
                <button
                    onClick={() => setTheme('osmo')}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-full transition-all duration-300 ${getActiveSegmentStyle(theme === 'osmo')}`}
                >
                    ◈ Improved
                </button>
                <button
                    onClick={() => setTheme('gravity')}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-full transition-all duration-300 ${getActiveSegmentStyle(theme === 'gravity')}`}
                >
                    ⬡ Modern
                </button>
            </div>

            {/* Mobile View */}
            <button
                onClick={handleMobileClick}
                className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${getPillStyle()}`}
            >
                {theme === 'default' && <span>◻</span>}
                {theme === 'osmo' && <span>◈</span>}
                {theme === 'gravity' && <span className="text-purple-400 drop-shadow-[0_0_5px_rgba(124,58,237,0.5)]">⬡</span>}
            </button>
        </>
    );
};

export default ThemeToggle;
