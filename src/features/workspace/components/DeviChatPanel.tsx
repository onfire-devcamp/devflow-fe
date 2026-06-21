import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import mascot from '../../../assets/mascot.png';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { ChatMessage } from '../types';
import { Resizable } from 're-resizable';

interface DeviChatPanelProps {
  messages: ChatMessage[];
  isEvaluating: boolean;
  isChatting: boolean;
  isLoadingHistory: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadOlderMessages: () => void;
  onSendMessage: (message: string) => void;
  onOpenExplainToPass: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function DeviChatPanel({
  messages,
  isEvaluating,
  isChatting,
  isLoadingHistory,
  isFetchingNextPage,
  hasNextPage,
  onLoadOlderMessages,
  onSendMessage,
  onOpenExplainToPass,
  isOpen = false,
  onClose,
}: DeviChatPanelProps) {
  const [inputMessage, setInputMessage] = useState('');

  const { ref: loadOlderRef, inView } = useInView({
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadOlderMessages();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadOlderMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isEvaluating || isChatting || isLoadingHistory)
      return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const displayMessages = [...messages].reverse();

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.sender === 'user';
    return (
      <div
        key={msg.id}
        className={`flex gap-2 max-w-[85%] ${
          isUser ? 'self-end flex-row-reverse' : 'self-start items-start'
        }`}
      >
        {!isUser && (
          <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-200 flex items-center justify-center shadow-sm flex-shrink-0 bg-amber-50">
            <img
              src={mascot}
              alt="Devi Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className={`px-3.5 py-2 text-xs rounded-2xl shadow-sm leading-relaxed min-w-0 break-words ${
            isUser
              ? 'bg-primary text-white rounded-tr-none'
              : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap m-0">{msg.text}</p>
          ) : (
            <MarkdownRenderer
              content={msg.text}
              isPassAction={msg.isPassAction}
              isEvaluating={isEvaluating}
              onOpenExplainToPass={onOpenExplainToPass}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <Resizable
      defaultSize={{ width: 336, height: '100%' }}
      minWidth={280}
      maxWidth={600}
      enable={{ left: true }}
      handleClasses={{
        left: 'hover:bg-primary/40 transition-colors',
      }}
      className={`absolute inset-y-0 right-0 z-[60] bg-primary-soft border-l border-primary-mid flex-col overflow-hidden transition-transform duration-300 xl:relative xl:translate-x-0 ${
        isOpen ? 'translate-x-0 flex' : 'translate-x-full hidden xl:flex'
      }`}
    >
      <div className="p-4 border-b border-primary-mid flex items-center justify-between bg-transparent">
        <div>
          <h3 className="font-bold text-sm text-slate-800">Devi</h3>
          <p className="text-[11px] text-fg-muted">
            AI mentor • Here to save the day!
          </p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            onClick={onClose}
            className="xl:hidden !p-2 !text-slate-400 hover:!bg-slate-200/50 !rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse bg-transparent">
        {(isEvaluating || isChatting) && (
          <div className="flex gap-2 max-w-[85%] self-start items-start animate-pulse">
            <div className="w-7 h-7 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-xs flex-shrink-0">
              <img
                src={mascot}
                alt="Devi Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-3.5 py-2 text-xs rounded-2xl rounded-tl-none bg-purple-50 text-purple-600 font-medium border border-purple-100 italic">
              {isEvaluating ? 'Reviewing your code...' : 'Thinking...'}
            </div>
          </div>
        )}

        {displayMessages.map(renderMessage)}

        {isLoadingHistory && (
          <div className="py-2 text-center text-[11px] text-slate-400 italic">
            Loading chat...
          </div>
        )}

        {isFetchingNextPage && (
          <div className="py-2 text-center text-[11px] text-slate-400 italic">
            Loading older messages...
          </div>
        )}

        {hasNextPage && <div ref={loadOlderRef} className="h-px w-full" />}
        <div className="flex-1 min-h-[8px]" />
      </div>

      <div className="p-3 border-t border-primary-mid bg-transparent">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Devi for help..."
            disabled={isEvaluating || isChatting || isLoadingHistory}
            className="!rounded-lg !h-9 !py-0 !px-3 !text-xs flex-1"
          />
          <Button
            type="submit"
            disabled={
              !inputMessage.trim() ||
              isEvaluating ||
              isChatting ||
              isLoadingHistory
            }
            className="!w-auto !h-9 px-3 !py-0 !rounded-lg text-xs flex-shrink-0"
          >
            Send
          </Button>
        </form>
      </div>
    </Resizable>
  );
}
