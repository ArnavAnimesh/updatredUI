import React from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * Reusable Table Component
 * This follows the corporate design system with a clean, structured look.
 * It's fully responsive and handles empty states gracefully.
 */
const Table = ({ columns, rows, renderRow }) => {
    const { theme } = useTheme();

    const getContainerClass = () => {
        if (theme === 'gravity') return "w-full overflow-hidden overflow-x-auto border border-white/10 rounded-[1.5rem] shadow-[0_0_30px_rgba(124,58,237,0.15)] bg-white/5 backdrop-blur-[30px]";
        
        return "w-full overflow-hidden overflow-x-auto border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 bg-white";
    };

    const getHeaderRowClass = () => {
        if (theme === 'gravity') return "bg-transparent";
        
        return "bg-transparent";
    };

    const getHeaderCellClass = () => {
        if (theme === 'gravity') return "sticky top-0 z-10 bg-[#050510]/95 backdrop-blur-md px-6 py-5 text-xs font-bold tracking-widest text-gray-400 uppercase border-b border-white/10";
        
        return "sticky top-0 z-10 bg-gray-50 px-6 py-5 text-xs font-black tracking-widest text-gray-400 uppercase border-b border-gray-100";
    };

    const getRowClass = () => {
        if (theme === 'gravity') return "transition-all duration-200 hover:bg-white/5 border-b border-white/5 last:border-b-0";
        
        return "transition-all duration-200 hover:bg-gray-50/50";
    };
    return (
        <div className={getContainerClass()}>
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className={getHeaderRowClass()}>
                        {columns.map((column, index) => (
                            <th 
                                key={index} 
                                className={getHeaderCellClass()}
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className={theme === 'gravity' || 'divide-y divide-gray-50'}>
                    {rows && rows.length > 0 ? (
                        rows.map((row, rowIndex) => (
                            <tr 
                                key={rowIndex} 
                                className={getRowClass()}
                            >
                                {renderRow(row, rowIndex)}
                            </tr>
                        ))
                    ) : null}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
