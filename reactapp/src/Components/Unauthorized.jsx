import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Access Denied</h1>
      <p className="text-slate-600 mb-6">You do not have permission to view this page.</p>
      <Link to="/login" className="bg-[#1E3A5F] text-white px-6 py-2 rounded-lg font-bold">
        Back to Login
      </Link>
    </div>
  );
};

export default Unauthorized;