// This is a simple reusable Input component with a label and error message.
import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const Input = ({ label, type, name, value, onChange, error, placeholder, ...rest }) => {
    const { theme } = useTheme();

    if (theme === 'gravity') {
        return (
            <div className="flex flex-col gap-1 w-full text-left">
                <div className="formless-input-container">
                    <input 
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder=" " 
                        {...rest}
                        className={`formless-input w-full border rounded-xl px-4 py-3 outline-none transition-all bg-white/5 text-white backdrop-blur-md 
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                            ${error ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-white/10 focus:border-purple-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.4)]'}`}
                    />
                    <label className="formless-label font-bold">
                        {label} <span className="text-red-500">*</span>
                    </label>
                </div>
                {error && <p className="text-xs text-red-500 font-medium drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">{error}</p>}
            </div>
        );
    }

    const getInputClass = () => {
        if (theme === 'osmo') return `border rounded-xl px-4 py-3 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white ${error ? 'border-red-500' : 'border-[#e4e4e7] focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]'}`;
        
        return `border rounded-xl px-4 py-3 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50'}`;
    };

    return (
        <div className="flex flex-col gap-1 w-full text-left">
            <label className={`text-sm font-bold ${theme === 'osmo' ? 'text-[#0f0f0f]' : 'text-gray-700'}`}>
                {label} <span className="text-red-500">*</span>
            </label>
            
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...rest}
                className={getInputClass()}
            />
            
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        </div>
    );
};

export default Input;