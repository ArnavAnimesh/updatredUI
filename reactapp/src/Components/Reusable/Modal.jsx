/**
 * Modal Component
 * A generic, reusable container that overlays the screen.
 * It provides a consistent layout with a header (title + close button) 
 * and a content area for any children components.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../../hooks/useTheme';

const Modal = ({ isOpen, onClose, title, children }) => {
    const { theme } = useTheme();
    // Return null if the modal is closed
    if (!isOpen) return null;

    const getOverlayClass = () => {
        if (theme === 'gravity') return "fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#050510]/80 backdrop-blur-xl animate-in fade-in duration-300";
        
        return "fixed inset-0 z-[90] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300";
    };

    const getModalClass = () => {
        if (theme === 'gravity') return "relative w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-[30px] rounded-[2rem] shadow-[0_0_50px_rgba(124,58,237,0.3)] overflow-hidden animate-in zoom-in-95 duration-300";
        
        return "relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300";
    };

    const getHeaderClass = () => {
        if (theme === 'gravity') return "flex items-center justify-between p-6 border-b border-white/10";
        
        return "flex items-center justify-between p-6 border-b border-gray-100";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]";
        
        return "text-2xl font-bold text-gray-900";
    };

    const getCloseBtnClass = () => {
        if (theme === 'gravity') return "p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10";
        
        return "p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100";
    };

    return ReactDOM.createPortal(
        <div className={getOverlayClass()}>
            {/* Modal Body */}
            <div className={getModalClass()}>
                
                {/* Modal Header */}
                <div className={getHeaderClass()}>
                    <h2 className={getTitleClass()}>{title}</h2>
                    
                    {/* Close Button Icon */}
                    <button 
                        onClick={onClose}
                        className={getCloseBtnClass()}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content - Where the children are rendered */}
                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
