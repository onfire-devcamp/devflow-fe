import React, { useRef, useEffect } from 'react';
import { usePlatformStore } from '../store/usePlatformStore';
import { Sparkles } from 'lucide-react';
import mascot from '../../../assets/mascot.png';

import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { SuggestionChips } from './SuggestionChips';
import { ChatInput } from './ChatInput';

export function RightPanel() {
  const {
    chatHistory,
    addUserMessage,
    isTyping,
    browsingFile,
    projects,
    activeProjectId,
    activeTaskId,
  } = usePlatformStore();

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const currentProj = projects.find((p) => p.id === activeProjectId);
  const currentTask = currentProj?.sections
    .flatMap((s) => s.tasks)
    .find((t) => t.id === activeTaskId);

  return (
    <section className="w-[340px] h-full bg-primary-soft border-l border-primary-mid/40 flex flex-col overflow-hidden shrink-0 font-sans">
      {/* 🌸 HEADER INFO */}
      <div className="p-4 border-b border-primary-mid/30 bg-primary-soft/60 flex items-center space-x-3 shrink-0">
        <div className="w-8 h-8 bg-primary-soft border border-primary-mid/60 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
          <img
            src="/devi-logo.png"
            alt="Devi Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = mascot;
            }}
          />
        </div>
        <div>
          <h3 className="text-xs font-bold text-fg">Devi</h3>
          <p className="text-[10px] text-fg-muted font-semibold flex items-center">
            <Sparkles className="w-2.5 h-2.5 text-purple mr-1" /> AI Mentor ·
            never hands you the answer
          </p>
        </div>
      </div>

      {/* Subheader File Tag */}
      <div className="px-4 py-1.5 bg-primary-mid/20 border-b border-primary-mid/30 text-[9px] font-extrabold text-primary tracking-wider uppercase shrink-0">
        {browsingFile
          ? `FILE: ${browsingFile.toLowerCase()}`
          : `TASK: ${currentTask?.title}`}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-transparent">
        {chatHistory.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}

        {/* Typing*/}
        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Suggested Action Chips */}
      <SuggestionChips onChipClick={addUserMessage} />

      {/* Input Form Chat */}
      <ChatInput onSend={addUserMessage} />
    </section>
  );
}
