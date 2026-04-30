/**
 * ConfirmDialog Component
 * This is a reusable modal used to ask the user for confirmation before performing
 * a destructive or important action (like deleting a profile or logging out).
 * 
 * Props:
 * - isOpen: Boolean. Controls whether the dialog is visible.
 * - title: String. The main heading of the dialog.
 * - message: String. The descriptive text explaining the action.
 * - onConfirm: Function. Called when the user clicks the "Confirm" button.
 * - onCancel: Function. Called when the user clicks "Cancel" or closes the modal.
 * - confirmText: String (optional). Text for the confirm button.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import { useTheme } from '../../hooks/useTheme';

const ConfirmDialog = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    danger = false,
    showCancel = true
}) => {
    const { theme } = useTheme();

    // If the modal is not supposed to be open, return nothing
    if (!isOpen) return null;

    const getOverlayClass = () => {
        if (theme === 'gravity') return "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050510]/80 backdrop-blur-xl animate-in fade-in duration-200";
        if (theme === 'osmo') return "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200";
        return "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200";
    };

    const getModalClass = () => {
        if (theme === 'gravity') return "w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-[30px] rounded-[2rem] shadow-[0_0_50px_rgba(124,58,237,0.3)] overflow-hidden animate-in zoom-in-95 duration-200";
        if (theme === 'osmo') return "w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200";
        return "w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200";
    };

    const getTitleClass = () => {
        if (theme === 'gravity') return "text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(124,58,237,0.5)] mb-2";
        if (theme === 'osmo') return "text-xl font-[800] text-[#0f0f0f] mb-2";
        return "text-xl font-bold text-gray-900 mb-2";
    };

    const getMessageClass = () => {
        if (theme === 'gravity') return "text-gray-400 font-medium";
        if (theme === 'osmo') return "text-[#71717a] font-medium";
        return "text-gray-600 font-medium";
    };

    const getFooterClass = () => {
        if (theme === 'gravity') return "flex items-center justify-end p-6 space-x-3 bg-white/5 border-t border-white/10";
        if (theme === 'osmo') return "flex items-center justify-end p-6 space-x-3 bg-[#fafafa] border-t border-[#f0f0f0]";
        return "flex items-center justify-end p-6 space-x-3 bg-gray-50/50";
    };

    const getCancelBtnClass = () => {
        if (theme === 'gravity') return "px-4 py-2 text-sm font-bold text-gray-400 transition-colors hover:text-white";
        if (theme === 'osmo') return "px-4 py-2 text-sm font-bold text-[#71717a] transition-colors hover:text-[#0f0f0f]";
        return "px-4 py-2 text-sm font-bold text-gray-500 transition-colors hover:text-gray-900";
    };

    return ReactDOM.createPortal(
        <div className={getOverlayClass()}>
            {/* Modal Container */}
            <div className={getModalClass()}>
                
                {/* Header & Message */}
                <div className="p-6 text-left">
                    <h3 className={getTitleClass()}>
                        {title}
                    </h3>
                    <p className={getMessageClass()}>
                        {message}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className={getFooterClass()}>
                    {/* Cancel Button */}
                    {showCancel && (
                        <button
                            onClick={onCancel}
                            className={getCancelBtnClass()}
                        >
                            {cancelText}
                        </button>
                    )}

                    {/* Confirm Button */}
                    <Button
                        text={confirmText}
                        onClick={onConfirm}
                        className={`${danger && theme === 'gravity' ? 'bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)] border-red-500' : danger ? 'bg-red-600 hover:bg-red-700' : theme === 'gravity' ? 'bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-purple-500' : 'bg-orange-500 hover:bg-orange-600 shadow-md'} text-white px-6`}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmDialog;
