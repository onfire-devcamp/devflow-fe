import React from 'react';
import { Button } from '../../../components/ui/Button';

interface SuggestionChipsProps {
  onChipClick: (text: string) => void;
}

export function SuggestionChips({ onChipClick }: SuggestionChipsProps) {
  const chips = ['Where do I start?', 'Give me a hint', 'Explain my approach'];

  return (
    <div className="px-4 py-2 flex flex-wrap gap-1.5 bg-transparent shrink-0">
      {chips.map((chip) => (
        <Button
          key={chip}
          variant="outline"
          onClick={() => onChipClick(chip)}
          className="!w-auto !py-1.5 px-3 text-[10px] font-bold !text-fg-muted bg-primary-soft/60 !border-primary-mid/60 !rounded-full hover:!bg-primary hover:!text-card hover:!border-primary cursor-pointer transition-all shadow-3xs"
        >
          {chip}
        </Button>
      ))}
    </div>
  );
}
