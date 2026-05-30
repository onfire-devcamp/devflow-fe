import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [inputVal, setInputVal] = useState<string>('');

  const handleSend = () => {
    if (!inputVal.trim()) return;
    onSend(inputVal);
    setInputVal('');
  };

  return (
    <div className="p-3 border-t border-primary-mid/20 bg-transparent shrink-0">
      <div className="flex items-center bg-primary-soft/80 rounded-2xl border border-primary-mid focus-within:border-primary focus-within:bg-primary-soft focus-within:shadow-2xs px-1 pl-4 py-1 transition-all">
        <Input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Devi something... (Enter to send)"
          className="flex-1 !bg-transparent !text-xs !py-1.5 font-medium placeholder:!text-fg-muted/60 !border-none !pl-0 !pr-0 !ring-0 focus:!ring-0"
        />
        <Button
          variant="primary"
          onClick={handleSend}
          className="!w-7 !h-7 !p-0 !py-0 flex items-center justify-center ml-2 shadow-xs"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
