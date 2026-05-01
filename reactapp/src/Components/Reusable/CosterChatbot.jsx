import React, { useState, useRef, useEffect } from 'react';
import { RiRobot2Line, RiCloseLine, RiSendPlane2Line, RiMessage3Line } from 'react-icons/ri';
import { useTheme } from '../../hooks/useTheme';
import api from '../../apiConfig';
import { playAddSound } from '../../sounds/clickSound';


const CosterChatbot = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm Coster. I'm here to provide information and answer your questions. How can I help you today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // Add user message
        const userMsg = { text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const msgText = inputText;
        setInputText('');
        setIsTyping(true);
        playAddSound();

        try {
            const response = await api.post('/chat/message', { message: msgText });
            if (response.data.success) {
                const botMsg = { 
                    text: response.data.data.reply, 
                    sender: 'bot' 
                };
                setMessages(prev => [...prev, botMsg]);
                playAddSound();
            } else {
                setMessages(prev => [...prev, { text: "I'm having trouble processing that request.", sender: 'bot' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { text: "Error connecting to the server.", sender: 'bot' }]);
        } finally {
            setIsTyping(false);
        }
    };


    const getToggleBtnClass = () => {
        if (theme === 'gravity') return "bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]";
        
        return "bg-[#F97316] hover:bg-[#EA6C0A] text-white shadow-lg";
    };

    const getChatWindowContainerClass = () => {
        if (theme === 'gravity') return "bg-[#050510]/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.2)]";
        
        return "bg-white border border-gray-100 shadow-2xl";
    };

    const getHeaderClass = () => {
        if (theme === 'gravity') return "bg-white/5 border-b border-white/10 text-white";
        
        return "bg-[#1E3A5F] text-white";
    };

    const getMessageClass = (sender) => {
        if (sender === 'user') {
            if (theme === 'gravity') return "bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white rounded-br-sm shadow-md";
            
            return "bg-gradient-to-r from-[#F97316] to-[#EA6C0A] text-white rounded-br-sm shadow-md";
        } else {
            if (theme === 'gravity') return "bg-white/10 backdrop-blur-md text-gray-200 rounded-bl-sm border border-white/5 shadow-sm";
            
            return "bg-white text-gray-800 rounded-bl-sm border border-gray-100 shadow-sm";
        }
    };

    const getInputContainerClass = () => {
        if (theme === 'gravity') return "bg-white/5 border-t border-white/10";
        
        return "bg-white border-t border-gray-100";
    };

    const getInputClass = () => {
        if (theme === 'gravity') return "bg-black/20 text-white border-white/10 placeholder:text-gray-500 focus:border-[#7c3aed]";
        
        return "bg-gray-50 text-gray-800 border-gray-200 placeholder:text-gray-400 focus:border-[#F97316]";
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
            
            {/* Chat Window */}
            <div 
                className={`mb-4 w-[340px] sm:w-[400px] rounded-3xl overflow-hidden origin-bottom-right transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'scale-100 opacity-100 visible translate-y-0' : 'scale-50 opacity-0 invisible translate-y-10'} ${getChatWindowContainerClass()}`}
            >
                {/* Header */}
                <div className={`p-4 flex items-center justify-between ${getHeaderClass()}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'gravity' ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'bg-white/20'}`}>
                            <RiRobot2Line className="text-lg" />
                        </div>
                        <div>
                            <h3 className="font-black text-sm uppercase tracking-wider">Coster</h3>
                            <p className={`text-[10px] uppercase font-bold tracking-widest ${theme === 'gravity' ? 'text-green-400' : 'text-green-300'}`}>Online</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className={`p-1 rounded-lg transition-colors ${theme === 'gravity' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-500'}`}
                    >
                        <RiCloseLine className="text-xl" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="h-[350px] p-5 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] sm:text-sm font-medium leading-relaxed tracking-wide ${getMessageClass(msg.sender)}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center ${theme === 'gravity' ? 'bg-white/10 border-white/5' : 'bg-white border-gray-100'} border shadow-sm`}>
                                <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'gravity' ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '0ms' }}></div>
                                <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'gravity' ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '150ms' }}></div>
                                <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'gravity' ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`p-4 ${getInputContainerClass()}`}>
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className={`flex-1 px-4 py-2 text-sm rounded-xl border outline-none transition-all ${getInputClass()}`}
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className={`p-2 w-10 h-10 flex items-center justify-center rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'gravity' ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white' : 'bg-[#F97316] hover:bg-[#EA6C0A] text-white'}`}
                        >
                            <RiSendPlane2Line className="text-lg" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all transform hover:scale-110 active:scale-95 ${getToggleBtnClass()}`}
            >
                {isOpen ? <RiCloseLine /> : <RiMessage3Line />}
            </button>

        </div>
    );
};

export default CosterChatbot;
