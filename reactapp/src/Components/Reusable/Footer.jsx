/**
 * Footer Component
 * This is a reusable footer displayed at the bottom of every page.
 * It reuses the "Contact Us" design from the original HomePage.
 */

import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-[#1E3A5F] via-[#1E3A5F] to-[#2D5282] p-8 flex flex-col items-center justify-center text-white text-center border-t border-white/10 mt-auto w-full">
            <div className="max-w-5xl w-full">
                {/* Section Title */}
                <h2 className="text-2xl font-black mb-8 tracking-tighter text-orange-400 uppercase italic">Get In Touch</h2>
                
                {/* Contact Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                        <span className="text-3xl mb-3">📞</span>
                        <span className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Phone</span>
                        <span className="text-lg font-black">+91 98765 43210</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                        <span className="text-3xl mb-3">📧</span>
                        <span className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Email</span>
                        <span className="text-lg font-black italic">incubator@startupnest.com</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                        <span className="text-3xl mb-3">📍</span>
                        <span className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Location</span>
                        <span className="text-base font-black leading-tight">456 Innovation Road, Tech City</span>
                    </div>
                </div>

                {/* Bottom Rights Section */}
                <div className="mt-12 pt-8 border-t border-white/5 text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">
                    © 2026 StartupNest Ecosystem. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
