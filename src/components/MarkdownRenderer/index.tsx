import ReactMarkdown from 'react-markdown';
import { Button } from '../ui/Button';

interface MarkdownRendererProps {
  content: string;
  isPassAction?: boolean;
  isEvaluating?: boolean;
  onOpenExplainToPass?: () => void;
}

export function MarkdownRenderer({
  content,
  isPassAction,
  isEvaluating,
  onOpenExplainToPass,
}: MarkdownRendererProps) {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="m-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-4 m-0 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 m-0 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="m-0">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">{children}</strong>
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
        {content}
      </ReactMarkdown>
      {isPassAction && onOpenExplainToPass && (
        <Button
          type="button"
          onClick={onOpenExplainToPass}
          disabled={isEvaluating}
          className="mt-1 text-[12px] py-2 px-3"
        >
          Answer Explain-to-Pass
        </Button>
      )}
    </div>
  );
}
