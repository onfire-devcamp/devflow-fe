import mascot from '../../../assets/mascot.png';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../types';

interface DeviChatPanelProps {
  messages: ChatMessage[];
  isEvaluating: boolean;
  isChatting: boolean;
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onOpenExplainToPass: () => void;
}

export function DeviChatPanel({
  messages,
  isEvaluating,
  isChatting,
  inputMessage,
  onInputChange,
  onSendMessage,
  onOpenExplainToPass,
}: DeviChatPanelProps) {
  return (
    <aside className="hidden xl:flex w-84 flex-shrink-0 bg-primary-soft border-l border-primary-mid flex-col h-full overflow-hidden">
      {/* Header Panel */}
      <div className="p-4 border-b border-primary-mid flex items-center justify-between bg-transparent">
        <div>
          <h3 className="font-bold text-sm text-slate-800">Devi</h3>
          <p className="text-[11px] text-fg-muted">
            AI mentor • Here to save the day!
          </p>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 max-w-[85%] ${
              msg.sender === 'user'
                ? 'self-end flex-row-reverse'
                : 'self-start items-start'
            }`}
          >
            {/* AI Avatar capybara */}
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-200 flex items-center justify-center shadow-sm flex-shrink-0 bg-amber-50">
                <img
                  src={mascot}
                  alt="Devi Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`px-3.5 py-2 text-xs rounded-2xl shadow-sm leading-relaxed min-w-0 break-words ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
              }`}
            >
              {msg.sender === 'user' ? (
                <p className="whitespace-pre-wrap m-0">{msg.text}</p>
              ) : (
                <div className="flex flex-col gap-2 min-w-0">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="m-0">{children}</p>,
                      ul: ({ children }) => (
                        <ul className="list-disc pl-4 m-0 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-4 m-0 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => <li className="m-0">{children}</li>,
                      strong: ({ children }) => (
                        <strong className="font-bold text-slate-900">
                          {children}
                        </strong>
                      ),
                      pre: ({ children }) => (
                        <pre className="block bg-[#1e1e1e] text-slate-200 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto max-w-full mt-1 mb-1">
                          {children}
                        </pre>
                      ),
                      code: ({ className, children }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-500 font-mono text-[11px] break-words">
                            {children}
                          </code>
                        ) : (
                          <code className={className}>{children}</code>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                  {msg.isPassAction && (
                    <button
                      type="button"
                      onClick={onOpenExplainToPass}
                      disabled={isEvaluating}
                      className="mt-1 w-full rounded-xl border border-primary-mid bg-primary px-3 py-2 text-left text-[11px] font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Answer Explain-to-Pass to Complete Task
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* AI Reviewing Loading Bubble */}
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
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-primary-mid bg-transparent">
        <form onSubmit={onSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Ask Devi for help..."
            disabled={isEvaluating || isChatting}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isEvaluating || isChatting}
            className="px-3 py-2 text-xs font-semibold text-white bg-primary hover:opacity-90 rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </aside>
  );
}
