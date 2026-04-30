// This is a simple reusable Button component.
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { playClickSound } from '../../sounds/clickSound';

const Button = ({ children, text, onClick, type = "button", disabled, loading, className = "" }) => {
    const { theme } = useTheme();

    const handleClick = (e) => {
        if (theme === 'gravity') {
            playClickSound();
            
            // Add ripple
            const button = e.currentTarget;
            const circle = document.createElement("span");
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            
            const rect = button.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add("ripple-span");
            
            button.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        }
        if (onClick) onClick(e);
    };

    const getBtnClass = () => {
        if (theme === 'osmo') return `w-full bg-[#0f0f0f] text-white py-3.5 rounded-full font-bold transition-all hover:bg-[#1a1a1a] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-sm relative overflow-hidden flex items-center justify-center gap-2 ${className}`;
        
        if (theme === 'gravity') return `w-full bg-purple-600 text-white py-3 rounded-xl font-bold transition-all hover:bg-purple-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-purple-500/30 btn-glow relative overflow-hidden flex items-center justify-center gap-2 ${className}`;
        
        return `w-full bg-[#1E3A5F] text-white py-2.5 rounded-lg font-bold transition-all hover:bg-[#2D5282] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 ${className}`;
    };

    return (
        <button 
            type={type}
            onClick={handleClick}
            disabled={disabled || loading}
            className={getBtnClass()}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : null}
            {children || text}
        </button>
    );
};

export default Button;