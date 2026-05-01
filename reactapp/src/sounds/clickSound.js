// Check if the user has muted all sounds
const isMuted = () => localStorage.getItem('app_muted') === 'true';

const createOscillator = (audioContext, freq, startTime, duration, type = 'sine') => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, startTime);
    
    return { oscillator, gainNode };
};

export const playClickSound = () => {
    if (isMuted()) return;
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const { oscillator, gainNode } = createOscillator(audioContext, 800, audioContext.currentTime, 0.15);
        
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) { console.log('Audio error'); }
};

export const playAddSound = () => {
    if (isMuted()) return;
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Soothing upward chime
        const startTime = audioContext.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, i) => {
            const { oscillator, gainNode } = createOscillator(audioContext, freq, startTime + i * 0.05, 0.2);
            gainNode.gain.setValueAtTime(0.05, startTime + i * 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.05 + 0.2);
            oscillator.start(startTime + i * 0.05);
            oscillator.stop(startTime + i * 0.05 + 0.2);
        });
    } catch (error) { console.log('Audio error'); }
};

export const playDeleteSound = () => {
    if (isMuted()) return;
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Soft dampened downward note
        const startTime = audioContext.currentTime;
        const { oscillator, gainNode } = createOscillator(audioContext, 220, startTime, 0.3, 'triangle');
        oscillator.frequency.exponentialRampToValueAtTime(110, startTime + 0.3);
        gainNode.gain.setValueAtTime(0.08, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
    } catch (error) { console.log('Audio error'); }
};
