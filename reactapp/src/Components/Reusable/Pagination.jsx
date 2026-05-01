/**
 * Pagination Component
 * This component provides navigation controls for paginated data lists.
 * It strictly follows PRD Section 6.2 rules:
 * - Shows current page vs total pages.
 * - Disables navigation buttons at boundaries (page 1 or last page).
 */

import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const { theme } = useTheme();
    // If there is only one page or no data, we don't need to show pagination
    if (totalPages <= 1) {
        return null;
    }

    const getWrapperClass = () => {
        if (theme === 'gravity') return "flex items-center justify-between px-6 py-4 bg-transparent border-t border-white/10 mt-4";
        
        return "flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100";
    };

    const getTextClass = () => {
        if (theme === 'gravity') return "text-sm text-gray-400";
        
        return "text-sm text-gray-700";
    };

    const getNumClass = () => {
        if (theme === 'gravity') return "font-bold text-white";
        
        return "font-semibold text-gray-900";
    };

    const getBtnClass = (isDisabled) => {
        if (theme === 'gravity') {
            return `px-4 py-2 text-sm font-bold transition-all rounded-xl border ${isDisabled ? 'bg-white/5 text-gray-600 border-transparent cursor-not-allowed' : 'bg-white/10 text-white border-white/10 hover:bg-white/20 active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.05)]'}`;
        }
        return `px-4 py-2 text-sm font-medium transition-all rounded-lg border ${isDisabled ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:scale-95 shadow-sm'}`;
    };

    return (
        <div className={getWrapperClass()}>
            {/* Left Side: Page Info */}
            <div className={getTextClass()}>
                Page <span className={getNumClass()}>{currentPage}</span> of{' '}
                <span className={getNumClass()}>{totalPages}</span>
            </div>

            {/* Right Side: Navigation Buttons */}
            <div className="flex space-x-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={getBtnClass(currentPage === 1)}
                >
                    &larr; Previous
                </button>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={getBtnClass(currentPage === totalPages)}
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    );
};

export default Pagination;
