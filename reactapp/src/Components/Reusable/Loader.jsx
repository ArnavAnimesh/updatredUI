/**
 * Loader Component
 * This component provides a visual indicator that data is being loaded.
 * It can be used as a full-page overlay or as an inline spinner.
 * 
 * Props:
 * - fullPage: Boolean. If true, it centers the loader in the middle of the screen.
 */

import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const Loader = ({ fullPage = false }) => {
    const { theme } = useTheme();

    // Container background depends on theme
    const getContainerClasses = () => {
        let base = fullPage 
            ? "fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm "
            : "flex flex-col items-center justify-center p-12 w-full h-full ";
        
        if (theme === 'gravity') base += "bg-[#050510]/80";
        else if (theme === 'osmo') base += "bg-[#fafafa]/80";
        else base += "bg-white/80";

        return base;
    };

    return (
        <div className={getContainerClasses()}>
            {theme === 'gravity' && (
                <div className="flex flex-col items-center">
                    <div className="relative flex justify-center items-center w-24 h-24 mb-6">
                        <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin blur-[2px] shadow-[0_0_15px_rgba(124,58,237,0.8)]"></div>
                        <div className="absolute inset-2 rounded-full border-b-2 border-amber-500 animate-spin animation-delay-500 blur-[1px] shadow-[0_0_10px_rgba(245,158,11,0.8)]" style={{animationDirection: 'reverse'}}></div>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-amber-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(124,58,237,1)]"></div>
                    </div>
                    <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 animate-pulse tracking-[0.2em] uppercase">
                        Establishing Link...
                    </p>
                </div>
            )}

            {theme === 'osmo' && (
                <div className="flex flex-col items-center">
                    <div className="flex space-x-2 mb-4">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <p className="text-xs font-[800] text-[#0f0f0f]/60 tracking-widest uppercase">
                        Loading
                    </p>
                </div>
            )}

            {theme === 'default' && (
                <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-4">
                        <div className="absolute inset-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
                        <div className="absolute inset-0 w-full h-full border-4 border-transparent border-t-[#F97316] rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm font-black text-slate-500 animate-pulse tracking-wide uppercase">
                        Loading...
                    </p>
                </div>
            )}
        </div>
    );
};

export default Loader;
