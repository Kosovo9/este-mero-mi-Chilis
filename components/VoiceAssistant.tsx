import React from 'react';
import { MicIcon, StopIcon } from './Icons';
import { Translation } from '../types';

interface VoiceAssistantProps {
    isActive: boolean;
    onToggle: () => void;
    t: Translation;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isActive, onToggle, t }) => {
    return (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-4">
            <button 
                onClick={onToggle}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg border-2 transition-all duration-300 ${
                    isActive 
                    ? 'bg-red-600 border-red-400 animate-pulse text-white' 
                    : 'bg-christmas-dark border-christmas-gold text-christmas-gold hover:bg-christmas-gold hover:text-christmas-dark'
                }`}
            >
                {isActive ? <StopIcon /> : <MicIcon />}
            </button>
            
            {/* Tooltip / Status Bubble */}
            <div className={`bg-christmas-cream text-christmas-dark px-4 py-2 rounded-xl shadow-xl border border-christmas-gold/20 transition-all duration-300 origin-left ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <p className="font-bold text-sm">{isActive ? t.voice.listening : t.voice.helperText}</p>
                 {isActive && (
                     <div className="flex gap-1 mt-1 h-2 items-end justify-center">
                         <div className="w-1 bg-christmas-green animate-[bounce_1s_infinite] h-full"></div>
                         <div className="w-1 bg-christmas-red animate-[bounce_1.2s_infinite] h-2/3"></div>
                         <div className="w-1 bg-christmas-gold animate-[bounce_0.8s_infinite] h-3/4"></div>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default VoiceAssistant;