import React from 'react';
import mascot from '../../../assets/mascot.png';

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 justify-start animate-fade-in">
      <div className="w-7 h-7 rounded-xl border border-primary-mid/40 bg-primary-soft overflow-hidden shrink-0 shadow-3xs">
        <img
          src="/devi-logo.png"
          alt="Devi Typing"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = mascot;
          }}
        />
      </div>

      <div className="flex items-center space-x-1 py-1.5 px-2 bg-primary-soft/50 border border-primary-mid/30 rounded-xl shadow-3xs">
        <span
          className="w-1 h-1 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1 h-1 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1 h-1 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}
