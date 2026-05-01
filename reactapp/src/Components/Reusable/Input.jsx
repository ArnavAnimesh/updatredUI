// This is a simple reusable Input component with a label and error message.
import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const Input = ({ label, type, name, value, onChange, error, placeholder, ...rest }) => {
    const { theme } = useTheme();

    if (theme === 'gravity') {
        return (
            <div className="flex flex-col gap-2 w-full text-left">
                <label className={`text-sm font-bold ml-1 ${error ? 'text-red-400' : 'text-gray-400'}`}>
                    {label} <span className="text-red-500">*</span>
                </label>
                <input 
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder} 
                    {...rest}
                    className={`w-full border rounded-2xl px-5 py-4 outline-none transition-all bg-white/5 text-white backdrop-blur-md 
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        placeholder:text-gray-500/50 focus:placeholder:text-gray-600
                        ${error ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-purple-500 focus:shadow-[0_0_20px_rgba(124,58,237,0.3)]'}`}
                />
                {error && <p className="text-[11px] text-red-500 font-black uppercase tracking-wider ml-2 animate-pulse">{error}</p>}
            </div>
        );
    }

    const getInputClass = () => {
        
        
        return `border rounded-xl px-4 py-3 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50'}`;
    };

    return (
        <div className="flex flex-col gap-1 w-full text-left">
            <label className={`text-sm font-bold ${'text-gray-700'}`}>
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