/**
 * EmptyState Component
 * This component is shown when a list (like Startup Profiles or Submissions) is empty.
 * It provides visual feedback so the user knows why no data is appearing.
 */

import React from 'react';

const EmptyState = ({ message, icon = "📁" }) => {
    return (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
            {/* Visual Icon */}
            <div className="text-6xl mb-6 grayscale opacity-50">
                {icon}
            </div>

            {/* Heading */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
                No records found
            </h3>

            {/* Description Message */}
            <p className="max-w-xs text-gray-500 leading-relaxed">
                {message || "There are no entries to display at the moment. Check back later or create a new one!"}
            </p>
        </div>
    );
};

export default EmptyState;
