import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const BackgroundMusic = () => {
    const { theme } = useTheme();
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(() => localStorage.getItem('app_muted') === 'true');

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        localStorage.setItem('app_muted', newMuted);
        
        // Directly handle play/pause on button click
        if (audioRef.current) {
            if (newMuted) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log(e));
            }
        }
    };

    useEffect(() => {
        if (theme === 'gravity') {
            if (audioRef.current) {
                audioRef.current.volume = 0.2;
                if (!isMuted) {
                    audioRef.current.play().catch(e => {
                        console.log("Audio autoplay blocked by browser. User interaction needed.", e);
                    });
                }
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [theme]); // isMuted is handled by toggleMute and initial load

    // Only render the audio and mute button if we are in the Modern theme
    if (theme !== 'gravity') return null;

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* The audio file is expected to be in the public directory */}
            <audio 
                ref={audioRef} 
                src="/Project IGI - menu.mp3" 
                loop 
                muted={isMuted} 
            />
            <button 
                onClick={toggleMute}
                className="bg-white/10 backdrop-blur-xl border border-purple-500/30 p-3 rounded-full text-purple-200 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:bg-purple-600/30 hover:text-white transition-all duration-300 flex items-center justify-center"
                title={isMuted ? "Unmute Background Music" : "Mute Background Music"}
            >
                {isMuted ? (
                    // Speaker X Icon (Muted)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                ) : (
                    // Speaker Wave Icon (Unmuted)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default BackgroundMusic;
