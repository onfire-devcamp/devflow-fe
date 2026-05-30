import React from 'react';
import mascot from '../../../assets/mascot.png';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  msg: ChatMessageType;
}

export function ChatMessage({ msg }: ChatMessageProps) {
  const isUser = msg.sender === 'user';

  return (
    <div
      className={`flex items-start space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-xl border border-primary-mid/40 bg-primary-soft overflow-hidden shrink-0 mt-0.5 shadow-3xs">
          <img
            src="/devi-logo.png"
            alt="Devi"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = mascot;
            }}
          />
        </div>
      )}

      <div
        className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs font-medium border ${
          isUser
            ? 'bg-primary text-card border-primary shadow-xs'
            : 'bg-primary-soft/90 text-fg border-primary-mid shadow-2xs'
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}
